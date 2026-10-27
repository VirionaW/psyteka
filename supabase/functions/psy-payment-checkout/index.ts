import { createClient } from "npm:@supabase/supabase-js@2.57.0";

/**
 * Психотека – подготовленный, выключенный по умолчанию checkout ЮKassa.
 * Ключи магазина и сервисный ключ доступны ТОЛЬКО Edge Function.
 * Продажи не активируются без: подтвержденных цен, фискализации,
 * приватной выдачи контента и отдельного подтверждения запуска.
 */
const origin = "https://psyteka.onrender.com";
const headers = {
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
  "Content-Type": "application/json; charset=utf-8"
};
const json = (status: number, value: Record<string, unknown>) =>
  new Response(JSON.stringify(value), { status, headers });
const env = (name: string) => Deno.env.get(name) ?? "";
const approved = () =>
  env("PSY_PAYMENTS_ENABLED") === "true" &&
  env("PSY_PRICES_APPROVED") === "true" &&
  env("PSY_FISCALIZATION_READY") === "true" &&
  env("PSY_PRIVATE_CONTENT_READY") === "true" &&
  env("PSY_YOOKASSA_LIVE_CONFIRMED") === "true" &&
  env("PSY_REFUND_PROCESS_READY") === "true" &&
  Boolean(env("YOOKASSA_SHOP_ID") && env("YOOKASSA_SECRET_KEY"));
const livePlans: Record<string, number> = { specialist: 39000 };
// Organization checkout deliberately blocked until team seats actually work.
const money = (kopecks: number) => (kopecks / 100).toFixed(2);
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const readJSON = async (request: Request) => {
  try { const parsed = await request.json(); return parsed && typeof parsed === "object" ? parsed : {}; }
  catch { return {}; }
};
const authHeader = () => "Basic " + btoa(env("YOOKASSA_SHOP_ID") + ":" + env("YOOKASSA_SECRET_KEY"));
async function paymentGET(paymentId: string) {
  if (!uuid.test(paymentId)) throw new Error("Invalid provider payment id");
  const response = await fetch("https://api.yookassa.ru/v3/payments/" + encodeURIComponent(paymentId), {
    headers: { Authorization: authHeader() }, signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error("Payment verification failed");
  return await response.json();
}
async function reconcile(admin: any, order: any) {
  if (!order?.provider_payment_id || !approved()) return { status: "pending" };
  const payment = await paymentGET(order.provider_payment_id);
  const amount = Number(payment?.amount?.value);
  if (payment?.id !== order.provider_payment_id ||
      payment?.amount?.currency !== "RUB" ||
      !Number.isFinite(amount) ||
      Math.round(amount * 100) !== order.amount_kopecks ||
      payment.test !== false) throw new Error("Payment details mismatch");
  if (payment.status === "succeeded" && payment.paid === true) {
    const { error } = await admin.rpc("psy_settle_payment", {
      p_order_id: order.id,
      p_payment_id: order.provider_payment_id,
      p_amount_kopecks: order.amount_kopecks
    });
    if (error) throw new Error("Payment settlement failed");
    return { status: "succeeded" };
  }
  if (payment.status === "canceled" && order.status === "pending") {
    await admin.from("psy_payment_orders").update({
      status: "canceled", updated_at: new Date().toISOString()
    }).eq("id", order.id).eq("status", "pending");
    return { status: "canceled" };
  }
  return { status: "pending" };
}

Deno.serve(async (request: Request) => {
  const incomingOrigin = request.headers.get("Origin");
  if (incomingOrigin && incomingOrigin !== origin)
    return json(403, { error: "Недопустимый источник запроса." });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });
  const body = await readJSON(request);
  const action = String(body.action ?? "");
  if (action === "availability")
    return json(200, { enabled: approved(), provider: "yookassa",
      specialist: approved(), organization: false,
      renewal: "manual", currency: "RUB" });
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return json(503, { error: "Настройка заказов не завершена." });
  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  if (action === "webhook" || (body.type === "notification" && typeof body.object?.id === "string")) {
    // No trust in unverified notification body. Always fetch payment from
    // ЮKassa by its ID and verify merchant response, currency and amount.
    if (!approved()) return json(503, { error: "Payments not configured" });
    const paymentId = body.object?.id;
    if (body.type !== "notification" || typeof paymentId !== "string" || !uuid.test(paymentId))
      return json(400, { error: "Invalid notification" });
    const { data: order, error } = await admin.from("psy_payment_orders")
      .select("id,user_id,plan,amount_kopecks,currency,provider_payment_id,status")
      .eq("provider_payment_id",paymentId).maybeSingle();
    if (error) return json(503, { error: "Temporarily unavailable" });
    if (!order) return json(200, { ok: true });
    try { await reconcile(admin, order); return json(200, { ok: true }); }
    catch { return json(503, { error: "Verification pending" }); }
  }

  const match = /^Bearer (.+)$/i.exec(request.headers.get("Authorization") || "");
  if (!match) return json(401, { error: "Войдите в аккаунт." });
  const { data: auth, error: authError } = await admin.auth.getUser(match[1]);
  if (authError || !auth?.user || auth.user.is_anonymous || !auth.user.email_confirmed_at)
    return json(401, { error: "Необходим подтвержденный аккаунт." });
  const uid = auth.user.id;

  if (action === "check") {
    if (typeof body.order_id !== "string" || !uuid.test(body.order_id))
      return json(400, { error: "Некорректный номер заказа." });
    const { data: order, error } = await admin.from("psy_payment_orders")
      .select("id,user_id,plan,amount_kopecks,currency,provider_payment_id,status")
      .eq("id",body.order_id).eq("user_id",uid).maybeSingle();
    if (error || !order) return json(404, { error: "Заказ не найден." });
    if (order.status === "succeeded") return json(200, { status: "succeeded",plan:order.plan });
    if (!approved()) return json(200, { status: order.status });
    try {
      const verified = await reconcile(admin, order);
      return json(200, { status: verified.status, plan: order.plan });
    } catch { return json(503, { error: "Проверка платежа временно недоступна." }); }
  }

  if (action !== "start") return json(400, { error: "Неизвестное действие." });
  if (!approved()) return json(503, { error: "Прием оплаты еще не подключен." });
  if (body.plan !== "specialist")
    return json(409, { error: "Этот тариф пока недоступен для покупки." });
  const { data: role, error: roleError } = await admin.from("psy_account_roles")
    .select("role").eq("user_id",uid).maybeSingle();
  if (roleError) return json(503, { error: "Проверка аккаунта недоступна." });
  if (["owner","shadow","moderator"].includes(role?.role))
    return json(409, { error: "Для команды Психотеки покупка не требуется." });
  const amountKopecks = livePlans[body.plan];
  const { data: recent, error: recentError } = await admin.from("psy_payment_orders")
    .select("id,status").eq("user_id",uid).eq("status","pending")
    .gte("created_at",new Date(Date.now()-15*60*1000).toISOString()).limit(1);
  if (recentError) return json(503, { error: "Ошибка проверки заказов." });
  if (recent?.length)
    return json(409, { error: "Незавершенный заказ уже существует. Повторите позже." });
  const { data: order, error: insertError } = await admin.from("psy_payment_orders")
    .insert({ user_id:uid,plan:"specialist",provider:"yookassa",
      amount_kopecks:amountKopecks,currency:"RUB" })
    .select("id").single();
  if (insertError || !order) return json(503, { error: "Не удалось создать заказ." });
  try {
    const response = await fetch("https://api.yookassa.ru/v3/payments",{
      method:"POST", headers:{"Authorization":authHeader(),
        "Content-Type":"application/json","Idempotence-Key":order.id},
      body:JSON.stringify({
        amount:{value:money(amountKopecks),currency:"RUB"},
        capture:true,
        confirmation:{type:"redirect",
          return_url:origin+"/subscriptions.html?payment_return=1&order="+order.id},
        description:"Психотека – Специалист, доступ на 1 месяц",
        metadata:{order_id:order.id}
      }),
      signal:AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error("Provider rejected payment request");
    const payment = await response.json();
    const next = payment?.confirmation?.confirmation_url;
    if (!uuid.test(payment?.id || "") || typeof next !== "string" ||
      !next.startsWith("https://") || payment?.amount?.currency !== "RUB" ||
      Math.round(Number(payment?.amount?.value)*100) !== amountKopecks)
      throw new Error("Invalid provider response");
    const { error: writeError } = await admin.from("psy_payment_orders")
      .update({provider_payment_id:payment.id,updated_at:new Date().toISOString()})
      .eq("id",order.id).eq("status","pending");
    if (writeError) throw new Error("Could not store provider payment");
    return json(200, { order_id:order.id,confirmation_url:next });
  } catch {
    // A provider request may have succeeded despite a network failure.
    // Order remains pending for manual reconciliation, no access is granted.
    return json(503, { error:"Платежная страница пока недоступна. Деньги не списываются на сайте Психотеки. При сомнениях обратитесь в поддержку." });
  }
});
