"use strict";(function(){
 let hasCode=false,passedHome=false;
 try{const data=JSON.parse(localStorage.getItem("psy-public-preview-access")||"null");hasCode=!!(data&&typeof data.until==="number"&&data.until>Date.now())}catch(_){}
 try{passedHome=sessionStorage.getItem("psy-entry-completed")==="1"}catch(_){}
 if(hasCode&&passedHome){document.documentElement.classList.add("psy-access-ok");return}
 try{sessionStorage.setItem("psy-requested-page",location.pathname+location.search)}catch(_){}
 location.replace("index.html?access=1");
})();