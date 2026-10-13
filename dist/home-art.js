/* The supplied drawing is rendered as real text characters, not a mockup screenshot. */
(() => {
 const canvas=document.getElementById('home-art'),ctx=canvas.getContext('2d');
 const source=new Image();let pixels;
 source.onload=()=>{const off=document.createElement('canvas');off.width=source.naturalWidth;off.height=source.naturalHeight;const c=off.getContext('2d',{willReadFrequently:true});c.drawImage(source,0,0);pixels=c.getImageData(0,0,off.width,off.height);draw();};
 source.onerror=()=>{canvas.hidden=true;const img=document.createElement('img');img.src='assets/portrait-reference.png';img.alt=canvas.getAttribute('aria-label');img.style.cssText='width:100%;filter:invert(1)';canvas.after(img);};
 function draw(){if(!pixels)return;const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const step=w<400?3:3.6,sy=step*1.7,cols=Math.floor(w/step),rows=Math.floor(h/sy);ctx.font=`${sy*.95}px 'Courier New',monospace`;ctx.textAlign='center';ctx.textBaseline='middle';const ramp=' .,:;+*#%@';
 // A silhouette bounds the paper texture; the source supplies every internal detail.
 const outline=[[.03,.43],[.04,.31],[.11,.21],[.23,.12],[.38,.045],[.54,.03],[.68,.033],[.82,.075],[.91,.16],[.95,.28],[.96,.44],[.98,.50],[.91,.61],[.86,.65],[.94,.79],[1,1],[.48,1],[.57,.91],[.56,.79],[.55,.755],[.46,.807],[.41,.81],[.33,.77],[.29,.72],[.28,.70],[.26,.69],[.20,.66],[.22,.635],[.23,.60],[.22,.565],[.18,.52],[.10,.49]];
 function inside(px,py){let hit=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++){const [a,b]=outline[i],[c,d]=outline[j];if((b>py)!==(d>py)&&px<(c-a)*(py-b)/(d-b)+a)hit=!hit;}return hit;}
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){if(!inside((x+.5)/cols,(y+.5)/rows))continue;const px=Math.min(pixels.width-1,Math.floor((x+.5)/cols*pixels.width)),py=Math.min(pixels.height-1,Math.floor((y+.5)/rows*pixels.height)),i=(py*pixels.width+px)*4;const l=(pixels.data[i]+pixels.data[i+1]+pixels.data[i+2])/765;let v=Math.max(.045,(1-l-.075)/.925);const density=Math.pow(v,.62),char=ramp[Math.max(1,Math.min(9,Math.floor(density*10)))];const edge=Math.min(1,x/5,(cols-1-x)/5,(rows-y)/5);ctx.fillStyle=`rgba(235,235,235,${Math.min(1,(.35+density*.9)*edge)})`;ctx.fillText(char,(x+.5)*w/cols,(y+.5)*h/rows);}}
 source.src='assets/portrait-reference.png';new ResizeObserver(draw).observe(canvas);
})();
