/* ASCII frames converted from the user's linked Lain dance. */
(() => {
 const pre=document.getElementById('about-art'),toggle=document.getElementById('about-motion'),data=window.LAIN_ASCII;
 if(!pre||!data)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,visible=false,frame=0,timer;
 function selecting(){const s=getSelection();return s&&!s.isCollapsed&&(pre.contains(s.anchorNode)||pre.contains(s.focusNode));}
 function tick(){if(paused||!visible||document.hidden)return;if(!selecting()){frame=(frame+1)%data.frames.length;pre.textContent=data.frames[frame];}timer=setTimeout(tick,Math.max(80,data.delays[frame]||80));}
 function sync(){clearTimeout(timer);toggle.textContent=paused?'play motion':'pause motion';toggle.setAttribute('aria-pressed',String(paused));if(!paused&&visible&&!document.hidden)timer=setTimeout(tick,Math.max(80,data.delays[frame]||80));}
 toggle.addEventListener('click',()=>{paused=!paused;sync();});reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});document.addEventListener('visibilitychange',sync);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(pre);sync();
})();
