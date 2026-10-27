"use strict";
/* Psyteka server-side temporary access gate. No secret belongs in GitHub.
 * Deploy as a Render WEB SERVICE, never as a Render static site.
 * PSYTEKA_ACCESS_CODE and PSYTEKA_SESSION_SECRET must be set in Render env. */
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const {URL,URLSearchParams}=require("node:url");

const PORT=Number(process.env.PORT)||10000;
const CODE=process.env.PSYTEKA_ACCESS_CODE||"";
const SECRET=process.env.PSYTEKA_SESSION_SECRET||"";
if(CODE.length<8||SECRET.length<32){
 console.error("Missing PSYTEKA_ACCESS_CODE or PSYTEKA_SESSION_SECRET; refusing insecure startup.");
 process.exit(1);
}
const TTL=8*60*60;
const root=path.resolve(__dirname);
const contentTypes={
 ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8",
 ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8",
 ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg",
 ".jpeg":"image/jpeg", ".webp":"image/webp", ".gif":"image/gif",
 ".ico":"image/x-icon", ".woff":"font/woff", ".woff2":"font/woff2",
 ".pdf":"application/pdf", ".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
 ".txt":"text/plain; charset=utf-8", ".csv":"text/csv; charset=utf-8"
};
const blockedTop=new Set(["docs","supabase","node_modules","test","tests",".git"]);
const attempts=new Map();
function hash(value){return crypto.createHash("sha256").update(value).digest()}
function equal(a,b){return a.length===b.length&&crypto.timingSafeEqual(a,b)}
function sign(value){return crypto.createHmac("sha256",SECRET).update(value).digest("hex")}
function cookieValue(){
 const expires=String(Math.floor(Date.now()/1000)+TTL);
 return expires+"."+sign(expires);
}
function authorized(req){
 const pairs=(req.headers.cookie||"").split(";");
 let token="";
 for(const pair of pairs){const i=pair.indexOf("=");if(i>=0&&pair.slice(0,i).trim()==="psyteka_session")token=pair.slice(i+1).trim()}
 const match=/^([0-9]{10,12})\.([a-f0-9]{64})$/.exec(token);
 if(!match)return false;
 const expires=Number(match[1]);
 if(!Number.isSafeInteger(expires)||expires<=Math.floor(Date.now()/1000)||expires>Math.floor(Date.now()/1000)+TTL)return false;
 return equal(Buffer.from(match[2],"hex"),Buffer.from(sign(match[1]),"hex"));
}
function escapeHtml(text){return String(text).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
function safeNext(value){return typeof value==="string"&&value.startsWith("/")&&!value.startsWith("//")&&!value.includes("\\")?value:"/"}
function response(res,status,body,type){
 res.writeHead(status,{"Content-Type":type||"text/html; charset=utf-8","Cache-Control":"private, no-store, max-age=0","Pragma":"no-cache","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"same-origin","Vary":"Cookie"});
 res.end(body);
}
function page(next,error){
 return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#285748">'+
 '<title>Доступ в Психотеку</title><style>'+
 '*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:25px 16px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#253c31;background:radial-gradient(ellipse at 12% 2%,#e7eee4,transparent 48%),radial-gradient(ellipse at 95% 100%,#eee5d8,transparent 44%),#faf9f5}'+
 'main{max-width:455px;width:100%;padding:38px;background:#fffefa;border:1px solid #dce2d9;border-radius:25px;box-shadow:0 18px 58px #17382915;text-align:center}'+
 '.mark{width:70px;height:70px;display:grid;place-items:center;margin:auto auto 12px;border-radius:22px;color:#285748;background:#e7f0e9;font-size:38px}'+
 '.brand{margin:0 0 20px;font-weight:800;font-size:20px;color:#285748}.tag{display:inline-block;padding:7px 14px;border-radius:40px;background:#f3eee6;color:#816a50;font-size:12px;font-weight:750;letter-spacing:.6px}'+
 'h1{font-size:32px;line-height:1.15;margin:17px 0 12px;letter-spacing:-.8px}p{line-height:1.6;color:#6d776e;font-size:14px;margin:0 0 26px}form{text-align:left}label{display:block;font-size:13px;font-weight:680;margin-bottom:8px}'+
 'input{width:100%;height:54px;padding:0 14px;border:1.5px solid #c8d7cb;background:#fff;border-radius:12px;color:#253c31;font-size:17px;outline:none}input:focus{border-color:#3b745d;box-shadow:0 0 0 3px #e0eee4}'+
 'button{width:100%;margin-top:12px;min-height:53px;background:#285748;border:0;border-radius:12px;color:white;font-weight:750;font-size:15px;cursor:pointer}button:hover{background:#1e4338}button:focus-visible{outline:3px solid #a8cfb4;outline-offset:3px}'+
 '.error{min-height:23px;font-size:13px;color:#ae4039;margin:8px 0 0}.foot{color:#89958b;margin:23px 0 0;font-size:12px}@media(max-width:530px){main{padding:29px 23px}h1{font-size:28px}}'+
 '</style></head><body><main><div class="mark" aria-hidden="true">✧</div><div class="brand">Психотека</div>'+
 '<span class="tag">ЗАКРЫТАЯ ВЕРСИЯ САЙТА</span><h1>Доступ по коду</h1>'+
 '<p>Введите код, чтобы открыть методическую библиотеку.</p>'+
 '<form action="/__psy_login" method="post"><input type="hidden" name="next" value="'+escapeHtml(next)+'">'+
 '<label for="code">Код доступа</label><input id="code" type="password" name="code" autocomplete="off" spellcheck="false" autocapitalize="none" maxlength="100" required autofocus>'+
 '<div class="error" role="status" aria-live="polite">'+escapeHtml(error||"")+'</div>'+
 '<button type="submit">Войти в Психотеку</button></form>'+
 '<p class="foot">Если у вас нет кода, обратитесь к владельцу проекта.</p></main></body></html>';
}
function recentAttempts(key){
 const now=Date.now(),list=(attempts.get(key)||[]).filter(t=>t>now-15*60000);
 if(list.length)attempts.set(key,list);else attempts.delete(key);
 if(attempts.size>10000)attempts.clear();
 return list;
}
function ipKey(req){return String(req.headers["x-forwarded-for"]||req.socket.remoteAddress||"unknown").split(",")[0].trim().slice(0,120)}
function readForm(req){
 return new Promise((resolve,reject)=>{
  let body="";let done=false;
  req.on("data",chunk=>{body+=chunk.toString();if(body.length>4096&&!done){done=true;reject(Error("too large"));req.destroy()}});
  req.on("end",()=>{if(!done)resolve(new URLSearchParams(body))});
  req.on("error",reject);
 });
}
function isSafeStatic(requestPath){
 let name;
 try{name=decodeURIComponent(requestPath)}catch(_){return null}
 if(name.includes("\0")||name.includes("\\")||name.includes("//"))return null;
 if(name==="/")name="/index.html";
 const segments=name.split("/").filter(Boolean);
 if(!segments.length||segments.some(s=>s.startsWith("."))||blockedTop.has(segments[0]))return null;
 const ext=path.extname(name).toLowerCase();
 if(!Object.hasOwn(contentTypes,ext))return null;
 if(segments.some(s=>s==="..")||segments[0]==="server.js")return null;
 const full=path.resolve(root,"."+name);
 if(!full.startsWith(root+path.sep))return null;
 return {full,ext};
}
const server=http.createServer(async(req,res)=>{
 const pathname=new URL(req.url||"/","http://localhost").pathname;
 if(pathname==="/__health"){response(res,200,"ok","text/plain; charset=utf-8");return}
 if(req.method==="POST"&&pathname==="/__psy_login"){
  const key=ipKey(req),history=recentAttempts(key);
  if(history.length>=8){response(res,429,page("/","Слишком много попыток. Попробуйте через 15 минут."));return}
  try{
   if(!(req.headers["content-type"]||"").startsWith("application/x-www-form-urlencoded")){response(res,415,"Unsupported");return}
   const form=await readForm(req),next=safeNext(form.get("next"));
   const offered=String(form.get("code")||"");
   if(!equal(hash(offered),hash(CODE))){
    history.push(Date.now());attempts.set(key,history);
    response(res,401,page(next,"Неверный код. Проверьте написание."));return;
   }
   attempts.delete(key);
   res.writeHead(303,{"Location":next,"Set-Cookie":"psyteka_session="+cookieValue()+"; Path=/; Max-Age="+TTL+"; HttpOnly; Secure; SameSite=Lax","Cache-Control":"no-store"});
   res.end();return;
  }catch(_){response(res,400,page("/","Ошибка проверки. Повторите попытку."));return}
 }
 if(req.method!=="GET"&&req.method!=="HEAD"){response(res,405,"Method not allowed","text/plain; charset=utf-8");return}
 if(pathname==="/__psy_logout"){
  res.writeHead(303,{"Location":"/","Set-Cookie":"psyteka_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax","Cache-Control":"no-store"});res.end();return;
 }
 if(!authorized(req)){
  if(req.method==="HEAD"){res.writeHead(401,{"Cache-Control":"no-store"});res.end();return}
  response(res,401,page(safeNext(req.url||"/")));return;
 }
 const target=isSafeStatic(pathname);
 if(!target){response(res,404,"Not found","text/plain; charset=utf-8");return}
 try{
  const stat=await fs.promises.stat(target.full);
  if(!stat.isFile()){response(res,404,"Not found","text/plain; charset=utf-8");return}
  res.writeHead(200,{"Content-Type":contentTypes[target.ext],"Content-Length":stat.size,"Cache-Control":"private, no-store, max-age=0","X-Content-Type-Options":"nosniff","X-Frame-Options":"SAMEORIGIN","Referrer-Policy":"same-origin","Vary":"Cookie"});
  if(req.method==="HEAD"){res.end();return}
  fs.createReadStream(target.full).on("error",()=>res.destroy()).pipe(res);
 }catch(_){response(res,404,"Not found","text/plain; charset=utf-8")}
});
server.listen(PORT,"0.0.0.0",()=>console.log("Protected Psyteka listening on "+PORT));