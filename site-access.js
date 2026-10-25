"use strict";(function(){let ok=false;try{const data=JSON.parse(localStorage.getItem("psy-public-preview-access")||"null");ok=!!(data&&typeof data.until==="number"&&data.until>Date.now())}catch(_){}
if(ok){document.documentElement.classList.add("psy-access-ok");return}
try{sessionStorage.setItem("psy-requested-page",location.pathname+location.search)}catch(_){}
location.replace("index.html?access=1");
})();