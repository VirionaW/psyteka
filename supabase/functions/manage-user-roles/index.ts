// Supabase Edge Function "manage-user-roles".
// Серверный маршрут для владельца Психотеки. Отдельно от публичного сайта.
// Предназначен для деплоя ТОЛЬКО после включения Supabase Auth и применения
// SQL схемы psy_account_roles. Никогда не копировать service key в GitHub/HTML.
import { createClient } from "npm:@supabase/supabase-js@2.57.0";

const siteOrigin = "https://psyteka.onrender.com";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const baseHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": siteOrigin,
  "Vary": "Origin",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const output = (status: number, data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), { status, headers: baseHeaders });

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin");
  if (origin && origin !== siteOrigin) {
    return output(403, { error: "Недопустимый источник запроса." });
  }
  if (request.method === "OPTIONS") return output(204, {});
  if (request.method !== "POST") return output(405, { error: "Метод недоступен." });
  const jwt = /^Bearer (.+)$/i.exec(request.headers.get("Authorization") ?? "")?.[1];
  if (!jwt) return output(401, { error: "Необходим вход в аккаунт." });

  const url = Deno.env.get("SUPABASE_URL");
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !secret) return output(503, { error: "Управление аккаунтами не настроено." });

  const admin = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  try {
    // Не верим email, role, user_metadata или user_id из тела запроса.
    const { data: verified, error: authError } = await admin.auth.getUser(jwt);
    if (authError || !verified?.user || verified.user.is_anonymous)
      return output(401, { error: "Необходим подтвержденный аккаунт." });

    const { data: permission, error: permError } = await admin
      .from("psy_account_roles").select("role")
      .eq("user_id", verified.user.id).maybeSingle();
    if (permError) return output(503, { error: "Не удалось проверить права." });
    if (permission?.role !== "owner")
      return output(403, { error: "Управление ролями доступно только владельцу." });

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body))
      return output(400, { error: "Некорректный запрос." });

    if (body.action === "list") {
      const page = Number(body.page ?? 1);
      if (!Number.isInteger(page) || page < 1 || page > 10000)
        return output(400, { error: "Неверная страница списка." });
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 50 });
      if (error) return output(503, { error: "Не удалось получить пользователей." });
      const members = data?.users ?? [];
      const ids = members.map(user => user.id);
      let roles: Array<{ user_id: string; role: string }> = [];
      if (ids.length) {
        const { data: savedRoles, error: roleError } = await admin
          .from("psy_account_roles").select("user_id,role").in("user_id", ids);
        if (roleError) return output(503, { error: "Не удалось получить роли." });
        roles = savedRoles ?? [];
      }
      const roleMap = new Map(roles.map(r => [r.user_id, r.role]));
      return output(200, {
        users: members.map(user => ({
          id: user.id,
          email: user.email ?? "",
          confirmed: !!user.email_confirmed_at,
          role: roleMap.get(user.id) ?? "participant"
        })),
        page,
        totalPages: Math.ceil((data?.total ?? 0) / 50)
      });
    }

    if (body.action === "set") {
      const id = body.userId;
      const role = body.role;
      if (typeof id !== "string" || !uuidPattern.test(id) ||
          (role !== "moderator" && role !== "participant"))
        return output(400, { error: "Некорректная роль или пользователь." });
      if (id === verified.user.id)
        return output(403, { error: "Владелец не может изменить собственную роль." });
      const { data: target, error: targetError } = await admin.auth.admin.getUserById(id);
      if (targetError || !target?.user)
        return output(404, { error: "Пользователь не найден." });
      if (!target.user.email_confirmed_at)
        return output(400, { error: "Сначала пользователь должен подтвердить почту." });
      const { data: existingRole, error: lookupError } = await admin
        .from("psy_account_roles").select("role").eq("user_id", id).maybeSingle();
      if (lookupError) return output(503, { error: "Не удалось проверить текущую роль." });
      if (existingRole?.role === "owner")
        return output(403, { error: "Изменение роли владельца запрещено." });

      if (role === "moderator") {
        const { error } = await admin.from("psy_account_roles").upsert({
          user_id: id,
          role: "moderator",
          granted_by: verified.user.id,
          granted_at: new Date().toISOString()
        }, { onConflict: "user_id" });
        if (error) return output(503, { error: "Не удалось назначить модератора." });
      } else {
        const { error } = await admin.from("psy_account_roles")
          .delete().eq("user_id", id).eq("role", "moderator");
        if (error) return output(503, { error: "Не удалось снять права модератора." });
      }
      return output(200, { ok: true, role });
    }
    return output(400, { error: "Неизвестное действие." });
  } catch (error) {
    console.error("Owner roles function:", error);
    return output(500, { error: "Сервис временно недоступен." });
  }
});
