"use strict";
/* Payments are disabled server-side until seller KYC, fiscalization, price
   approval, private content delivery, and live YooKassa keys are complete.
   Never collect payment card data or trust a return_url as proof of payment. */
(function(){
 const $=id=>document.getElementById(id);
 const specialist=$("psyPaySpecialist"),organization=$("psyPayOrganization"),status=$("psyPaymentStatus");
 if(!specialist||!organization||!status)return;
 const identity=window.PSY_IDENTITY;
 let busy=false,ready=false,user=null;
 const message=(s,kind="info")=>{status.textContent=s;status.dataset.state=kind;};
 const disabled=(button,text)=>{
  button.disabled=true;button.setAttribute("aria-disabled","true");button.textContent=text;
 };
 const fn=async(action,data={})=>{
  if(!identity?.client)throw Error("Нет соединения с сервером");
  const {data:response,error}=await identity.client.functions.invoke("psy-payment-checkout",{
   body:{action,...data}
  });
  if(error)throw error;
  return response;
 };
 async function checkPaid(){
  if(!user)return;
  const {data,error}=await identity.client.from("psy_paid_access")
   .select("plan,expires_at").eq("user_id",user.id).maybeSingle();
  if(error||!data?.expires_at)return;
  const until=new Date(data.expires_at);
  if(until.getTime()<=Date.now())return;
  const plan=data.plan==="organization"?"Организация":"Специалист";
  message("Ваша оплаченная подписка «"+plan+"» действует до "+
   new Intl.DateTimeFormat("ru-RU",{dateStyle:"long",timeStyle:"short"}).format(until)+".","success");
 }
 async function verifyReturn(){
  const params=new URLSearchParams(location.search);
  const order=params.get("order");
  if(params.get("payment_return")!=="1"||!order||!/^[a-f0-9-]{36}$/i.test(order))return;
  if(!user){message("Для проверки заказа войдите в аккаунт, с которого он был оформлен.","info");return;}
  try{
   const result=await fn("check",{order_id:order});
   if(result?.status==="succeeded"){
    message("Оплата подтверждена сервером. Подписка активирована.","success");
    await checkPaid();
   }else if(result?.status==="canceled"){
    message("Платеж отменен. Средства не подтверждены, доступ не изменен.");
   }else message("Платеж пока проверяется. Обновите эту страницу позже: доступ появится после подтверждения провайдера.");
  }catch(_){
   message("Проверка платежа временно недоступна. Подписка появится после подтверждения оплаты. Если вы уже оплатили, не создавайте повторный заказ.","error");
  }
 }
 async function init(){
  disabled(specialist,"Подключаем оплату");
  disabled(organization,"Командный тариф готовится");
  try{
   if(!identity?.client)throw Error("Auth unavailable");
   const {data,error}=await identity.client.auth.getUser();
   if(error)throw error;
   user=data?.user&&!data.user.is_anonymous?data.user:null;
   const availability=await fn("availability");
   ready=availability?.enabled===true&&availability?.specialist===true;
   if(!ready){
    disabled(specialist,"Оплата пока не подключена");
    message("ЮKassa готовится к подключению. Сейчас здесь нельзя оплатить или потерять деньги: платежи выключены на сервере.");
   }else if(user){
    specialist.disabled=false;
    specialist.removeAttribute("aria-disabled");
    specialist.textContent="Оформить на 1 месяц";
    message("Оплата будет открываться у платежного провайдера. На Метоларии не нужно вводить данные карты.");
   }else{
    specialist.disabled=false;
    specialist.removeAttribute("aria-disabled");
    specialist.textContent="Войти для оплаты";
    message("Для покупки войдите в собственный аккаунт. Платеж затем будет привязан к нему.");
   }
   await verifyReturn();
   // Read-only entitlements; customer cannot grant them via the browser.
   if(new URLSearchParams(location.search).get("payment_return")!=="1")await checkPaid();
  }catch(_){
   disabled(specialist,"Оплата пока не подключена");
   message("Прием платежей пока недоступен. Покупка не начнется без подтверждения сервера.","error");
  }
 }
 specialist.addEventListener("click",async()=>{
  if(busy||!ready)return;
  if(!user){location.assign("index.html?home=1&entry=1");return;}
  if(!window.confirm("Подтвердить переход к защищенной оплате одного месяца доступа? Автосписаний не будет."))return;
  busy=true;specialist.disabled=true;
  try{
   const result=await fn("start",{plan:"specialist"});
   const checkout=result?.confirmation_url;
   if(typeof checkout!=="string"||!checkout.startsWith("https://"))throw Error("No checkout URL");
   location.assign(checkout);
  }catch(_){
   message("Создать заказ пока не удалось. Если вы уже открывали страницу оплаты, проверьте заказ прежде чем повторять.","error");
   specialist.disabled=false;
  }finally{busy=false;}
 });
 init();
})();
