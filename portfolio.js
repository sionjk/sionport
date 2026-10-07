/* Edit the three projects here. image is a local asset path; url is optional. */
window.PROJECTS = [
 { title:'Halo', category:'PROJECT / 01', description:'Project overview coming soon.', detail:'A closer look at the question, process, and outcome will live here.', image:'', url:'', graphic:'halo' },
 { title:'Happiness Multiple Linear Regression Model', category:'STATISTICS / 02', description:'Project overview coming soon.', detail:'The dataset, predictors, model evaluation, and findings will be added here.', image:'', url:'', graphic:'happiness' },
 { title:'Graduate Admissions Multiple Linear Regression Model', category:'STATISTICS / 03', description:'Project overview coming soon.', detail:'The research question, modeling approach, and conclusions will be added here.', image:'', url:'', graphic:'admissions' }
];
(() => {
 const $=s=>document.querySelector(s), projects=window.PROJECTS; let current=0;
 const dots=[...document.querySelectorAll('[data-project]')];
 function graphic(kind){
  const common='<svg viewBox="0 0 460 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
  if(kind==='halo')return common+'<circle cx="230" cy="156" r="105" fill="none" stroke="#3c3c4c" stroke-width="1"/><circle cx="230" cy="156" r="84" fill="none" stroke="#3c3c4c" stroke-width="18"/><path d="M100 156H360M230 26V286" stroke="#3c3c4c" stroke-dasharray="2 7"/><text x="230" y="322" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#3c3c4c">H A L O</text></svg>';
  const pts=Array.from({length:32},(_,i)=>{const x=45+(i*53%360),y=260-x*.43+Math.sin(i*2.4)*43;return `<circle cx="${x}" cy="${y}" r="${i%4===0?5:3}" fill="#3c3c4c" opacity=".7"/>`;}).join('');
  return common+'<path d="M35 25V285H430" fill="none" stroke="#3c3c4c"/><path d="M35 220H430M35 155H430M35 90H430" stroke="#3c3c4c" opacity=".12"/>'+pts+'<path d="M40 246L416 79" stroke="#f4f1e9" stroke-width="3"/><text x="230" y="324" text-anchor="middle" font-family="Georgia,serif" font-size="19" fill="#3c3c4c">'+(kind==='happiness'?'Happiness, in context.':'Understanding admissions.')+'</text></svg>';
 }
 function render(){const p=projects[current];$('#project-title').textContent=p.title;$('#project-type').textContent=p.category;$('#project-description').textContent=p.description;$('#project-detail').textContent=p.detail;$('#project-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
 dots.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));
 const art=$('#project-art');art.replaceChildren();if(p.image){const img=new Image();img.src=p.image;img.alt=p.title+' project preview';img.style.cssText='width:100%;height:auto;display:block';art.append(img);}else art.innerHTML=graphic(p.graphic);
 $('#art-note').textContent=p.image?'Project preview':p.graphic==='halo'?'Concept graphic · project image to follow':'Illustrative graphic · not project results';
 const link=$('#project-link');let safe=false;try{safe=!!p.url&&['https:','http:'].includes(new URL(p.url,location.href).protocol);}catch{}link.hidden=!safe;if(safe)link.href=p.url;else link.removeAttribute('href');
 }
 function move(n){current=(current+n+projects.length)%projects.length;render();}
 $('#previous-project').addEventListener('click',()=>move(-1));$('#next-project').addEventListener('click',()=>move(1));dots.forEach((b,i)=>b.addEventListener('click',()=>{current=i;render();}));
 $('.project-carousel').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 const links=[...document.querySelectorAll('.section-nav a')];
 const sections=['home','projects','about'].map(id=>document.getElementById(id));
 function updateNavigation(){let active=sections[0];sections.forEach(section=>{if(section.getBoundingClientRect().top<=innerHeight*.4)active=section;});links.forEach(a=>{if(a.hash==='#'+active.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
 let pending=false;window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{updateNavigation();pending=false;});}},{passive:true});window.addEventListener('resize',updateNavigation);updateNavigation();
 render();
})();

const ruleObserver=new ResizeObserver(entries=>entries.forEach(({target,contentRect})=>{const img=target.querySelector('img');img.style.transform='scaleX('+(contentRect.width/(target.classList.contains('top')?458:458.004))+')';}));document.querySelectorAll('.project-rule').forEach(el=>ruleObserver.observe(el));
