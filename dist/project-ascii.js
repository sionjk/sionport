/* Approved character-only artwork. No photographic assets are displayed. */
(() => {
 const assets=window.PROJECT_ASCII_DATA;
 for(const a of Object.values(assets))a.pixels=Uint8Array.from(atob(a.rgb),c=>c.charCodeAt(0));
 window.ProjectAscii={mount(canvas,key){
 const root=canvas.closest('.project-visual'),ctx=canvas.getContext('2d'),color=true;
const silhouette=[[92,608],[258,600],[425,454],[463,371],[501,335],[630,313],[685,267],[740,251],[795,302],[813,242],[856,216],[907,228],[949,287],[1004,456],[1020,481],[1076,617],[1152,735],[1265,745],[1280,876],[1195,925],[1140,1110],[1092,1225],[1046,1271],[1020,1308],[879,1393],[627,1446],[525,1469],[512,1593],[334,1614],[306,1566],[331,1495],[364,1439],[310,1429],[221,1320],[203,1180],[248,1000],[272,837],[318,744],[329,688],[272,683],[185,694],[123,675],[92,658]];
function inside(x,y){let hit=false;for(let i=0,j=silhouette.length-1;i<silhouette.length;j=i++){const [xi,yi]=silhouette[i],[xj,yj]=silhouette[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))hit=!hit}return hit}
function theme(name){const s=document.createElement('span');s.style.color='var('+name+')';root.append(s);const c=getComputedStyle(s).color;s.remove();return c}
function sample(a,x,y){const i=(Math.min(a.h-1,Math.max(0,Math.round(y)))*a.w+Math.min(a.w-1,Math.max(0,Math.round(x))))*3;return [a.pixels[i],a.pixels[i+1],a.pixels[i+2]]}
function draw(){
const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
const dpr=Math.max(2,window.devicePixelRatio||1);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
const ink=theme('--ascii-ink'),muted=theme('--ascii-muted'),graph=theme('--ascii-accent'),dark=false,a=assets[key];ctx.textAlign='center';ctx.textBaseline='middle';
if(key==='halo'){
 const ih=h-12,iw=Math.min(w,ih*a.w/a.h),ox=(w-iw)/2,oy=(h-ih)/2;
 const stepX=w<420?2.8:3.3,stepY=stepX*1.62,cols=Math.floor(iw/stepX),rows=Math.floor(ih/stepY);
 ctx.font='900 '+(stepY*1.38)+'px "Courier New",monospace';
 const ramp=' .,:;irsXA253hMHGS#9B&@';
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  if(!inside((160+(x+.5)/cols*1870)/1.578947,(310+(y+.5)/rows*2220)/1.578947))continue;
  const [r,g,b]=sample(a,(x+.5)*a.w/cols,(y+.5)*a.h/rows),l=(.2126*r+.7152*g+.0722*b)/255;
  const v=1-Math.pow(l,.62);
  const ch=ramp[Math.min(ramp.length-1,Math.floor(Math.pow(v,1.2)*(ramp.length-1)))];
  if(ch===' ')continue;
  const chroma=Math.max(r,g,b)-Math.min(r,g,b);
  if(color&&chroma>28){const factor=dark?1:.62;ctx.fillStyle='rgb('+[r,g,b].map(t=>Math.round(dark?Math.min(245,75+t*.75):t*factor)).join(',')+')'}else ctx.fillStyle=ink;
  ctx.globalAlpha=.45+.55*v;ctx.fillText(ch,ox+(x+.5)*iw/cols,oy+(y+.5)*ih/rows);
 }
 ctx.globalAlpha=1;
}else if(key==='grad'){
 const left=w<420?50:64,right=24,top=45,bottom=55,pw=w-left-right,ph=h-top-bottom;
 const xPos=v=>left+(v-2.5)/1.5*pw,yPos=v=>top+(100-v)/80*ph;
 ctx.fillStyle=ink;ctx.font='13px Arial,sans-serif';ctx.fillText('CGPA and admission chance',w/2,16);
 ctx.fillStyle=muted;ctx.font='11px "Courier New",monospace';
 for(let x=left;x<=left+pw;x+=8)ctx.fillText('-',x,top+ph+5);
 for(let y=top;y<top+ph;y+=10)ctx.fillText('|',left-5,y);
 ctx.font='12px Arial,sans-serif';
 for(const v of [2.5,3,3.5,4]){ctx.textAlign=v===2.5?'left':v===4?'right':'center';ctx.fillText(v,xPos(v),top+ph+22)}
 ctx.textAlign='right';for(const v of [20,60,100])ctx.fillText(v,left-12,yPos(v));
 ctx.textAlign='center';ctx.fillStyle=ink;ctx.fillText('CGPA (out of 4)',left+pw/2,h-10);
 ctx.save();ctx.translate(12,top+ph/2);ctx.rotate(-Math.PI/2);ctx.fillText('Predicted admission chance (%)',0,0);ctx.restore();
 // Exact univariate coefficients reported on p. 11; no fabricated observations.
 ctx.font='500 16px "Courier New",monospace';ctx.fillStyle=color?graph:ink;
 const count=w<420?20:36;
 for(let i=0;i<count;i++){const x=2.6+(3.95-2.6)*i/(count-1);ctx.fillText('/',xPos(x),yPos(-107.215+52.231*x))}
 ctx.fillStyle=ink;ctx.font='12px Arial,sans-serif';ctx.textAlign='left';ctx.fillText('Fitted trend',xPos(2.65),yPos(76));
}else{
 const left=w<420?48:64,right=18,top=44,bottom=55,pw=w-left-right,ph=h-top-bottom;
 ctx.font='13px Arial,sans-serif';ctx.fillStyle=ink;ctx.fillText(key==='social'?'Actual vs. predicted happiness':'Admission chance vs. CGPA',w/2,16);
 const cw=3.6,ch=6.5,cols=Math.floor(pw/cw),rows=Math.floor(ph/ch);ctx.font='900 9px "Courier New",monospace';
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const [r,g,b]=sample(a,(x+.5)*a.w/cols,(y+.5)*a.h/rows),lum=(r+g+b)/3;
  if(lum>220)continue;
  let char=key==='grad'?'o':(b>r*1.25&&b>g*1.25?'+':r>g*1.4?'/':'|');
  ctx.fillStyle=color&&char==='+'?graph:ink;ctx.globalAlpha=char==='|'?.75:1;
  ctx.fillText(char,left+(x+.5)*pw/cols,top+(y+.5)*ph/rows);
 }
 ctx.globalAlpha=1;ctx.fillStyle=muted;ctx.font='11px "Courier New",monospace';
 for(let x=left;x<=left+pw;x+=7)ctx.fillText('-',x,top+ph+5);
 for(let y=top;y<top+ph;y+=8)ctx.fillText('|',left-5,y);
 ctx.font='12px Arial,sans-serif';
 const xt=key==='social'?[4,6,8,10]:[2.5,3,3.5,4],yt=key==='social'?[0,4,8,12]:[20,40,60,80,100];
 const xPos=v=>key==='social'?left+((v-4)*77.67+33)/531*pw:left+(v-2.5)/1.5*pw;
 const yPos=v=>key==='social'?top+(366-v*28.17)/383*ph:top+(100-v)/80*ph;
 for(const v of xt){ctx.textAlign=v===xt[0]?'left':v===xt[xt.length-1]?'right':'center';ctx.fillText(v,xPos(v),top+ph+21)}
 ctx.textAlign='right';for(const v of yt)ctx.fillText(v,left-12,yPos(v));
 ctx.textAlign='center';ctx.fillStyle=ink;ctx.fillText(key==='social'?'Actual happiness (1–10)':'CGPA (out of 4)',left+pw/2,h-10);
 ctx.save();ctx.translate(12,top+ph/2);ctx.rotate(-Math.PI/2);ctx.fillText(key==='social'?'Predicted happiness':'Admission chance (%)',0,0);ctx.restore();
}
}

 const observer=new ResizeObserver(draw);observer.observe(canvas);draw();
 return ()=>observer.disconnect();
 }};
})();
