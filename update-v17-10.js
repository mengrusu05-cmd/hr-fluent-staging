
/* HR Fluent V17.10: network preflight + cache-safe installed app update flow.
   Important: never delete localStorage, IndexedDB, or user progress. */
(function(){
 'use strict';
 const CURRENT='17.10', BUILD='hr-fluent-v17-10-qa7';
 const SECURE=location.protocol==='https:'||location.hostname==='localhost';
 const MARKER='hr-fluent-build';
 const LAST_ATTEMPT='hr-fluent-v17-10-last-update-attempt';
 let registration=null,checking=false,checkAt=0,pending=null,refreshing=false,hiddenMsg='';
 const compare=(a,b)=>{const aa=String(a||'').split('.'),bb=String(b||'').split('.');for(let i=0;i<3;i++){const n=(Number(aa[i])||0)-(Number(bb[i])||0);if(n)return n}return 0};
 function flush(){return typeof autosaveProgress==='function' ? autosaveProgress() : false}
 function tip(t){if(typeof toast==='function')toast(t);else console.info('[HR Fluent]',t)}
 function info(t){hiddenMsg=t;const el=document.getElementById('hrVersionStatus');if(el)el.textContent=t}
 function eligible(){return !((document.activeElement?.matches?.('textarea,input,[contenteditable="true"]'))||
 (typeof state!=='undefined'&&(state.detailId||state.syncOpen||state.bookmarkOpen||['study','quiz','scene'].includes(state.tab))))}
 function closePrompt(){document.getElementById('hrFluentUpdate')?.remove()}
 function promptUpdate(v){
  if(!v)return;pending=v;
  const old=document.getElementById('hrFluentUpdate');if(old){old.querySelector('span').textContent='✨ V'+v.version+' 更新包已可用';return}
  const bar=document.createElement('div');bar.id='hrFluentUpdate';bar.className='hr-update-toast';bar.setAttribute('role','status');
  const label=document.createElement('span');label.textContent='✨ V'+v.version+' 更新包已可用';
  const apply=document.createElement('button');apply.type='button';apply.className='hr-update-now';apply.textContent='保存并更新';
  apply.addEventListener('click',()=>refresh(true,v.version));
  const later=document.createElement('button');later.type='button';later.className='hr-update-later';later.textContent='×';later.setAttribute('aria-label','稍后更新');later.addEventListener('click',closePrompt);
  bar.append(label,apply,later);document.body.appendChild(bar);
 }
 async function registerWorker(){
  if(!SECURE||!('serviceWorker' in navigator))return null;
  if(registration)return registration;
  try{registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});return registration}catch(e){return null}
 }
 async function refreshWorker(){
  const reg=await registerWorker();
  try{await reg?.update();if(reg?.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'})}catch(e){}
 }
 // Require the actual HTML to be published before navigating; a manifest arriving first is not enough.
 async function peekLiveBuild(){
  const resp=await fetch('./index.html?check_build='+Date.now(),{cache:'no-store',credentials:'same-origin'});
  if(!resp.ok)throw Error('无法获取主页：'+resp.status);
  const html=await resp.text();
  const build=html.match(/<meta\s+name=["']hr-fluent-build["']\s+content=["'](\d+(?:\.\d+){0,2})["']/i)||
              html.match(/<title>HR Fluent V(\d+(?:\.\d+){0,2})/i);
  if(!build)throw Error('线上页面缺少版本信息');
  const buildId=html.match(/<meta\s+name=["']hr-fluent-build-id["']\s+content=["']([^"']+)["']/i);
  return {version:build[1],build:buildId?.[1]||null};
 }
 async function check(manual=false){
  if(!SECURE){if(manual)tip('请从 HTTPS 网站访问以检查新版本');return}
  if(!navigator.onLine){if(manual)tip('当前离线，联网后重试');return}
  if(checking)return;
  if(!manual&&Date.now()-checkAt<60000)return;
  checking=true;checkAt=Date.now();
  if(manual)info('正在检查线上版本…');
  try{
   const response=await fetch('./version.json?check='+Date.now(),{cache:'no-store',credentials:'same-origin'});
   if(!response.ok)throw Error('版本文件 '+response.status);
   const remote=await response.json();
   if(!/^\d+(\.\d+){0,2}$/.test(String(remote.version||'')))throw Error('版本文件格式异常');
   if(compare(remote.version,CURRENT)>0 || (compare(remote.version,CURRENT)===0 && remote.build && remote.build!==BUILD)){
    const htmlVer=await peekLiveBuild();
    if(compare(htmlVer.version,remote.version)<0 || (remote.build && htmlVer.build!==remote.build)){info('检测到 V'+remote.version+'，但主页仍在发布中；请稍后检查');return}
    info('发现 V'+remote.version+'，更新可用');
    pending={version:remote.version,build:remote.build||remote.version};
    await refreshWorker();
    if(eligible())refresh(false,remote.version);else promptUpdate(pending);
    return;
   }
   pending=null;closePrompt();
   info('当前 V'+CURRENT+' · 已是最新版本（'+new Date().toLocaleTimeString('zh-CN')+'）');
   if(manual)tip('已经是最新版 V'+CURRENT);
  }catch(e){
   info('当前 V'+CURRENT+' · 检查失败，可尝试手动刷新');
   if(manual)tip('检查失败：'+(e.message||'请确认网络及 version.json'));
  }finally{checking=false}
 }
 function refresh(force=false,v=CURRENT){
  if(refreshing)return;
  if(!force&&!eligible()){promptUpdate({version:v});return}
  let attempt=null;try{attempt=JSON.parse(sessionStorage.getItem(LAST_ATTEMPT)||'null')}catch(e){}
  if(!force&&attempt&&attempt.version===v&&Date.now()-attempt.at<120000){promptUpdate({version:v});return}
  if(!flush()){info('学习记录保存失败，已取消刷新');tip('保存失败：请先导出学习记录备份，确认保存正常后再更新');return}
  try{sessionStorage.setItem(LAST_ATTEMPT,JSON.stringify({version:v,at:Date.now()}))}catch(e){}
  refreshing=true;
  // Same origin and path: preserves localStorage. Query busts the older PWA's navigation cache.
  const next=new URL('./index.html',location.href);
  next.searchParams.set('hr_refresh',v+'-'+Date.now());
  if(location.hash)next.hash=location.hash;
  location.replace(next.href);
 }
 async function forceRefresh(){
  if(!SECURE){tip('请通过 HTTPS 网址访问最新版');return}
  if(!navigator.onLine){tip('当前没有网络，无法获取最新版');return}
  const editing=document.activeElement?.matches?.('textarea,input,[contenteditable="true"]');
  if(editing&&!confirm('未提交的输入可能丢失。保存本机进度并刷新最新版本吗？'))return;
  info('正在从网站重新获取最新内容…');
  if(!flush()){info('学习记录保存失败，已取消刷新');tip('保存失败：请先备份学习记录，暂不刷新');return}
  try{
   const published=await peekLiveBuild();
   if(compare(published.version,CURRENT)<0){info('线上仍为 V'+published.version+'，请检查 GitHub Pages 部署是否完成');tip('服务器版本低于本机版本，未触发刷新');return}
   // Remove stale application caches but retain the current offline cache and ALL learning records.
   if('caches' in window){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('hr-fluent-')&&!k.startsWith('hr-fluent-v17-10-')).map(k=>caches.delete(k)))}
   await refreshWorker();
   info('网页已发布 V'+published.version+'，正在重新载入…');
   refresh(true,published.version);
  }catch(e){info('刷新失败：'+(e.message||'网络异常'));tip('无法读取最新网页；学习记录未删除')}
 }
 window.hrFluentCheckVersion=check;
 window.hrFluentForceRefresh=forceRefresh;
 document.addEventListener('visibilitychange',()=>{if(document.hidden)flush();else check()});
 window.addEventListener('pagehide',flush);
 window.addEventListener('focus',()=>check());
 window.addEventListener('pageshow',()=>check());
 window.addEventListener('load',()=>{setTimeout(()=>{registerWorker().then(()=>refreshWorker()).finally(()=>check())},1200)});
 // Poll only while active. Safari/iOS may suspend timers in background.
 setInterval(()=>{if(!document.hidden)check()},3*60*1000);
 // Render replaces the My page DOM; restore the most recent version-check status when revisiting.
 const original=window.hrFluentGetVersionStatus;
 window.hrFluentGetVersionStatus=()=>hiddenMsg||('当前 V'+CURRENT+' · 可联网检查更新');
})();
