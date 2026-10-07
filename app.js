/* Sion King portfolio. No build step. All points come from Supabase. */
(() => {
  'use strict';
  const cfg = window.PORTFOLIO;
  const labels = {github:'GitHub', linkedin:'LinkedIn', email:'Email', resume:'Résumé'};
  document.querySelectorAll('[data-link]').forEach(a => {
    const key = a.dataset.link, value = cfg.links[key]?.trim();
    if (!value) return;
    let href = key === 'email' && !value.startsWith('mailto:') ? 'mailto:' + value : value;
    try { if (!['http:','https:','mailto:'].includes(new URL(href,location.href).protocol)) return; } catch { return; }
    a.href = href;
    a.removeAttribute('aria-disabled');
    a.setAttribute('aria-label', labels[key]);
    a.querySelector('.tooltip').textContent = labels[key];
    if (key !== 'email') { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  });
  const canvas = document.querySelector('#plot'), ctx = canvas.getContext('2d');
  const status = document.querySelector('#plot-status'), count = document.querySelector('#count');
  const retry = document.querySelector('#retry');
  const live = document.querySelector('#live'), coordinates = document.querySelector('#coordinates');
  const C = 56, R = 28, W = 560, H = 364;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let heatmap = false;
  let cells = new Map(), ready = false, busy = false, lastSent = 0;
  let cursor = null, channel = null, client = null, refreshPromise = null;
  let ripples = [], frame = null;
  let realtime = false, retryAction = null, failedPoint = null;
  const cellKey = (x,y) => `${x},${y}`;
  const total = () => [...cells.values()].reduce((n,c) => n + Number(c.n),0);
  function message(text, action = null) {
    status.textContent = text; retryAction = action; retry.hidden = !action;
  }
  const idleMessage = () => message(realtime ? 'Click anywhere. Your point stays.' : 'Click anywhere. Updates every 15 seconds.');
  function connection(state){live.dataset.state=state;live.textContent=state==='live'?'LIVE':state==='syncing'?'SYNCING':state==='offline'?'OFFLINE':'CONNECTING';}
  function ripple(x,y){
    if(reduced)return;
    const key=cellKey(x,y),now=performance.now();
    if(ripples.some(r=>r.key===key&&now-r.start<600))return;
    ripples.push({x,y,key,start:now});ripples=ripples.slice(-20);
    if(frame===null)frame=requestAnimationFrame(animate);
  }
  function animate(){frame=null;draw();if(ripples.length)frame=requestAnimationFrame(animate);}
  function draw() {
    const dpr = window.devicePixelRatio || 1;
    if(canvas.width !== W*dpr || canvas.height !== H*dpr){canvas.width=W*dpr;canvas.height=H*dpr;}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    ctx.textAlign='center';ctx.textBaseline='middle';
    const now=performance.now();ripples=ripples.filter(r=>now-r.start<1200);
    for(let y=0;y<R;y++) for(let x=0;x<C;x++) {
      const n=Number(cells.get(cellKey(x,y))?.n || 0);
      if(!n){if(x%4===0&&y%4===0){ctx.fillStyle='#dfdbd1';ctx.fillRect((x+.5)*W/C,(R-y-.5)*H/R,1,1);}continue;}
      if(heatmap){ctx.fillStyle=`rgba(90,89,121,${Math.min(.9,.18+Math.log2(n+1)*.14)})`;ctx.fillRect(x*W/C,(R-y-1)*H/R,W/C-1,H/R-1);continue;}
      const char=n>7?'#':n>3?'*':n>1?'+':'·';
      ctx.font = `${n>1?'bold ':''}17px Consolas, monospace`;
      ctx.fillStyle = ripples.some(r=>r.x===x&&r.y===y)?'#a65132':'#34342d';
      ctx.fillText(char,(x+.5)*W/C,(R-y-.5)*H/R);
    }
    for(const r of ripples){
      const t=(now-r.start)/1200,px=(r.x+.5)*W/C,py=(R-r.y-.5)*H/R;
      ctx.strokeStyle=`rgba(166,81,50,${(1-t)*.6})`;ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(px,py,5+30*(1-(1-t)**3),0,Math.PI*2);ctx.stroke();
    }
    coordinates.textContent=cursor?`x ${((cursor.x+.5)/C).toFixed(2)}   y ${((cursor.y+.5)/R).toFixed(2)} · ${Number(cells.get(cellKey(cursor.x,cursor.y))?.n||0)} here`:'x —   y —';
    if(cursor){
      const px=(cursor.x+.5)*W/C,py=(R-cursor.y-.5)*H/R;
      ctx.strokeStyle='rgba(166,81,50,.25)';ctx.lineWidth=1;ctx.setLineDash([2,5]);
      ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,H);ctx.moveTo(0,py);ctx.lineTo(W,py);ctx.stroke();ctx.setLineDash([]);
      ctx.strokeStyle='#a65132';ctx.beginPath();ctx.moveTo(px-7,py);ctx.lineTo(px-3,py);ctx.moveTo(px+3,py);ctx.lineTo(px+7,py);ctx.moveTo(px,py-7);ctx.lineTo(px,py-3);ctx.moveTo(px,py+3);ctx.lineTo(px,py+7);ctx.stroke();
    }
  }
  function updateCount(){count.textContent=`n = ${total().toLocaleString()}`;draw();}
  function merge(row){if(row && Number.isInteger(row.x)&&Number.isInteger(row.y)){
    const key=cellKey(row.x,row.y),old=cells.get(key);
    if(!old || Number(row.n)>Number(old.n))cells.set(key,row);
  }}
  async function refresh(){
    if(refreshPromise)return refreshPromise;
    refreshPromise=(async()=>{
      // 1,568 cells exceed the default Supabase 1,000-row limit: paginate.
      const next=[];
      for(let offset=0;offset<C*R;offset+=500){
        const {data,error}=await client.from('plot_cells').select('x,y,n').order('x').order('y').range(offset,offset+499);
        if(error)throw error;next.push(...data);if(data.length<500)break;
      }
      // Counts are monotonic. Merge avoids losing an event received during fetch.
      next.forEach(merge);updateCount();
    })().finally(()=>{refreshPromise=null;});
    return refreshPromise;
  }
  async function connect(){
    ready=false;connection('connecting');message('Connecting to the distribution…');
    try {
      if(!window.supabase)throw new Error('Client could not load');
      if(!client)client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey);
      await refresh();ready=true;idleMessage();
      if(channel)await client.removeChannel(channel);
      channel=client.channel('portfolio-distribution').on('postgres_changes',{event:'*',schema:'public',table:'plot_cells'},payload=>{
        const row=payload.new;if(row&&Number(row.n)>Number(cells.get(cellKey(row.x,row.y))?.n||0))ripple(row.x,row.y);
        merge(payload.new);updateCount();
      }).subscribe(state=>{
        realtime=state==='SUBSCRIBED';
        connection(realtime?'live':'syncing');
        if(realtime)refresh().catch(()=>{});
        if(ready&&!busy&&!failedPoint)idleMessage();
      });
    } catch(error) {
      ready=false;connection('offline');console.info('Distribution unavailable:',error.code||error.message);
      message('The distribution is temporarily unavailable.',connect);
    }
  }
  async function session(){
    const {data,error}=await client.auth.getSession();if(error)throw error;
    if(data.session)return;
    const result=await client.auth.signInAnonymously();if(result.error)throw result.error;
  }
  async function submit(point){
    if(!ready){message('The distribution is temporarily unavailable.',connect);return;}
    if(busy)return;
    if(Date.now()-lastSent<2000){message('Give your point a moment to settle.');return;}
    busy=true;message('Leaving your point…');
    try {
      await session();
      const {error}=await client.rpc('leave_point',{p_id:point.id,p_x:point.x,p_y:point.y});
      if(error)throw error;
      failedPoint=null;lastSent=Date.now();
      ripple(Math.min(C-1,Math.floor(point.x*C)),Math.min(R-1,Math.floor(point.y*R)));draw();
      message('Your point is part of the distribution.');
      // The insert succeeded even if this separate read fails. Do not retry it as a new point.
      try{await refresh();}catch{message('Your point is saved. Reconnecting to the plot…',connect);}
    } catch(error) {
      failedPoint=point;
      const rateLimited=/wait a moment/i.test(error.message||'');
      message(rateLimited?'Give your point a moment to settle.':'Couldn’t save your point. Please try again.',()=>submit(point));
      console.info('Point not confirmed:',error.code||error.message);
    } finally {busy=false;}
  }
  function pointer(event){const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(event.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,1-(event.clientY-r.top)/r.height))};}
  canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const p=pointer(e);cursor={x:Math.min(C-1,Math.floor(p.x*C)),y:Math.min(R-1,Math.floor(p.y*R))};draw();});
  canvas.addEventListener('pointerleave',()=>{cursor=null;draw();});
  canvas.addEventListener('click',e=>{const p=pointer(e);submit({id:crypto.randomUUID(),...p});});
  canvas.addEventListener('focus',()=>{cursor={x:Math.floor(C/2),y:Math.floor(R/2)};draw();});
  canvas.addEventListener('blur',()=>{cursor=null;draw();});
  canvas.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key))return;e.preventDefault();
    cursor ||= {x:Math.floor(C/2),y:Math.floor(R/2)};
    if(e.key==='ArrowLeft')cursor.x=Math.max(0,cursor.x-1);
    if(e.key==='ArrowRight')cursor.x=Math.min(C-1,cursor.x+1);
    if(e.key==='ArrowUp')cursor.y=Math.min(R-1,cursor.y+1);
    if(e.key==='ArrowDown')cursor.y=Math.max(0,cursor.y-1);
    if(e.key==='Enter'||e.key===' ')submit({id:crypto.randomUUID(),x:(cursor.x+.5)/C,y:(cursor.y+.5)/R});draw();
  });
  document.querySelector('#plot-mode')?.addEventListener('click', e=>{heatmap=!heatmap;e.currentTarget.setAttribute('aria-pressed',String(heatmap));e.currentTarget.textContent=heatmap?'Show ASCII':'Show heatmap';draw();});
  retry.addEventListener('click',()=>retryAction?.());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden && client)refresh().catch(()=>{});});
  window.addEventListener('online',connect);
  setInterval(()=>{if(!document.hidden && client){if(!ready)connect();else refresh().catch(()=>{connection('offline');if(!busy)message('Connection interrupted. Your saved points remain.',connect);});}},15000);
  draw();connect();
})();
