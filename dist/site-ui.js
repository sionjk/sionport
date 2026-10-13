(() => {
 const header=document.querySelector('.masthead');
 function sizeText(pre){const width=pre.parentElement.clientWidth;const cols=Number(pre.dataset.columns);pre.style.fontSize=`${width/(cols*.6001)}px`;}
 document.querySelectorAll('.ascii-text').forEach(pre=>{sizeText(pre);new ResizeObserver(()=>sizeText(pre)).observe(pre.parentElement);});
 function go(id,smooth=true){const section=document.getElementById(id);if(!section)return;const target=id==='projects'?section.querySelector('.project-stage'):id==='about'?section.querySelector('.about-layout'):section;const top=id==='home'?0:Math.max(0,scrollY+target.getBoundingClientRect().top-header.getBoundingClientRect().height-24);window.scrollTo({top,behavior:smooth&&!matchMedia('(prefers-reduced-motion:reduce)').matches?'smooth':'instant'});}
 document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const id=link.hash.slice(1);if(!['home','projects','about'].includes(id))return;event.preventDefault();history.pushState(null,'',`#${id}`);go(id);}));
 window.addEventListener('popstate',()=>go(location.hash.slice(1)||'home',false));
 window.addEventListener('load',()=>{if(location.hash)go(location.hash.slice(1),false);});
})();
