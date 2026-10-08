/* Project content and approved ASCII artwork. */
window.PROJECTS = [
 {title:'Halo',event:'Shellhacks 2026',category:'APPLIED DATA & AI / 01',awards:'1st place · Waymo track | 1st place · State Farm track',description:'A smart bike helmet that watches for approaching vehicles and alerts the rider through visual, audio, and haptic cues.',detail:'Raspberry Pi, Arduino, cameras, and ultrasonic sensors bring computer vision and real-time sensing together in a working prototype.',graphic:'halo',note:'Smart helmet · Onboard computing and sensors',links:[{platform:'Devpost',title:'Halo',detail:'The build, demo, and hackathon story',url:'https://devpost.com/software/halo-1q59hf'},{platform:'GitHub',title:'billpquach / halo',detail:'Explore the source code',url:'https://github.com/billpquach/halo'}]},
 {title:'Social Media & Happiness',category:'STATISTICS / 02',description:'Exploring how social media habits, sleep, stress, and age relate to happiness using survey data from 500 participants.',detail:'Built and evaluated regression models in R. The graphic compares observed happiness with back-transformed predictions and 95% prediction intervals.',graphic:'social',note:'Actual vs. predicted happiness · In-sample fit',links:[{platform:'GitHub',title:'sionjk / Social-Media-Happiness-Regression',detail:'Explore the analysis and source code',url:'https://github.com/sionjk/Social-Media-Happiness-Regression'}]},
 {title:'Graduate Admissions',category:'STATISTICS / 03',description:'Examining which academic factors are associated with graduate admission chance through multiple linear regression.',detail:'Compared predictors, checked model assumptions, and refined the model. CGPA showed the strongest single-predictor relationship with admission chance.',graphic:'grad',note:'Simplified CGPA-only fitted trend',links:[{platform:'PDF',title:'Graduate Admissions R Script',detail:'View the complete R script and analysis',url:'assets/graduate-admissions-r-script.pdf',preview:true}]}
];
(() => {
 const $=s=>document.querySelector(s),projects=window.PROJECTS;let current=0,disposeArt;
 const dots=[...document.querySelectorAll('.project-dots [data-project]')],art=$('#project-art'),visual=$('#project-visual');
 function resetTilt(){art.style.transform='none';}
 function render(){
  const p=projects[current];$('#project-title').textContent=p.title;$('#project-type').textContent=p.category;$('#project-description').textContent=p.description;$('#project-detail').textContent=p.detail;$('#project-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
  dots.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));
  if(disposeArt)disposeArt();resetTilt();art.replaceChildren();
  visual.dataset.art=p.graphic;
  const canvas=document.createElement('canvas');canvas.className='project-ascii';canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label',p.graphic==='halo'?'ASCII illustration of the Halo helmet, onboard computer, wiring, and sensors':p.graphic==='social'?'ASCII chart of actual versus predicted happiness, showing prediction intervals and the equality reference line':'Simplified ASCII fitted trend: higher CGPA is associated with higher predicted admission chance in the CGPA-only model');
  art.append(canvas);disposeArt=window.ProjectAscii.mount(canvas,p.graphic);$('#art-note').textContent=p.note;
  const event=$('#project-event');event.textContent=p.event||'';event.hidden=!p.event;
  const awards=$('#project-awards');awards.hidden=!p.awards;awards.textContent=(p.awards||'').replace(' | ','\n');
  const cards=$('#project-links');cards.replaceChildren();cards.hidden=!p.links.length;
  for(const item of p.links){const link=document.createElement('a');link.className='project-resource';link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';
   const platform=document.createElement('span');platform.className='project-resource-platform';platform.textContent=item.platform;
   const title=document.createElement('span');title.className='project-resource-title';title.textContent=item.title;
   const detail=document.createElement('span');detail.className='project-resource-detail';detail.textContent=item.detail;
   link.append(platform,title,detail);cards.append(link);
   if(item.preview){const panel=document.createElement('details');panel.className='project-pdf';const summary=document.createElement('summary');summary.textContent='Preview first page';const preview=document.createElement('a');preview.href=item.url;preview.target='_blank';preview.rel='noopener noreferrer';preview.setAttribute('aria-label','Open the complete Graduate Admissions R Script PDF');const image=document.createElement('img');image.src='assets/graduate-admissions-preview.png';image.alt='First page of Graduate Admissions R Script';image.loading='lazy';preview.append(image);panel.append(summary,preview);cards.append(panel);}

  }
 }
 function move(n){current=(current+n+projects.length)%projects.length;render();}
 $('#previous-project').addEventListener('click',()=>move(-1));$('#next-project').addEventListener('click',()=>move(1));dots.forEach((b,i)=>b.addEventListener('click',()=>{current=i;render();}));
 $('.project-carousel').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 visual.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduced.matches)return;const r=visual.getBoundingClientRect();art.style.transform=`rotateX(${(.5-(e.clientY-r.top)/r.height)*4}deg) rotateY(${((e.clientX-r.left)/r.width-.5)*5}deg)`;});
 visual.addEventListener('pointerleave',resetTilt);reduced.addEventListener('change',resetTilt);
 const links=[...document.querySelectorAll('.section-nav a')],sections=['home','projects','about'].map(id=>document.getElementById(id));
 function updateNavigation(){let active=sections[0];sections.forEach(section=>{if(section.getBoundingClientRect().top<=innerHeight*.4)active=section;});links.forEach(a=>{if(a.hash==='#'+active.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
 let pending=false;window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{updateNavigation();pending=false;});}},{passive:true});window.addEventListener('resize',updateNavigation);updateNavigation();render();
 const ruleObserver=new ResizeObserver(entries=>entries.forEach(({target,contentRect})=>{const img=target.querySelector('img');if(img)img.style.transform='scaleX('+(contentRect.width/458)+')';}));document.querySelectorAll('.project-rule').forEach(el=>ruleObserver.observe(el));
})();
