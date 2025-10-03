// js/utils.js
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function dist2(a,b){ const dx=a.x-b.x, dy=a.y-b.y; return dx*dx+dy*dy; }
function lineIntersectRect(x1,y1,x2,y2, rx,ry,rw,rh){
  const t0 = {value:0}, t1 = {value:1};
  const dx = x2-x1, dy = y2-y1;
  function clip(p, q){
    if (p === 0) return q >= 0;
    const r = q/p;
    if (p < 0){
      if (r > t1.value) return false;
      if (r > t0.value) t0.value = r;
    }else{
      if (r < t0.value) return false;
      if (r < t1.value) t1.value = r;
    }
    return true;
  }
  if (clip(-dx, x1 - rx) &&
      clip( dx, (rx+rw) - x1) &&
      clip(-dy, y1 - ry) &&
      clip( dy, (ry+rh) - y1)){
    return t0.value <= t1.value;
  }
  return false;
}
function circleRectCollide(cx,cy,cr, rx,ry,rw,rh){
  const nx = clamp(cx, rx, rx+rw);
  const ny = clamp(cy, ry, ry+rh);
  const dx = cx - nx, dy = cy - ny;
  return (dx*dx + dy*dy) <= cr*cr;
}
function randRange(a,b){ return a + Math.random()*(b-a); }
function placeNonOverlapping(attempts, radius, barriers){
  for (let i=0;i<attempts;i++){
    const x = randRange(40, CONFIG.WIDTH-40);
    const y = randRange(40, CONFIG.HEIGHT-40);
    let ok = true;
    for (const b of barriers){
      if (circleRectCollide(x,y,radius, b.x,b.y,b.w,b.h)){ ok=false; break; }
    }
    if (ok) return {x,y};
  }
  return {x: CONFIG.WIDTH/2, y: CONFIG.HEIGHT/2};
}

function circlesOverlap(x,y,r, circles){
  if (!circles) return false;
  for (const c of circles){
    const dx = x - c.x, dy = y - c.y;
    const rr = r + c.r;
    if (dx*dx + dy*dy <= rr*rr) return true;
  }
  return false;
}

function placeNonOverlappingEntities(attempts, radius, barriers, circles){
  for (let i=0;i<attempts;i++){
    const x = randRange(40, CONFIG.WIDTH-40);
    const y = randRange(40, CONFIG.HEIGHT-40);
    let ok = true;
    for (const b of barriers){
      if (circleRectCollide(x,y,radius, b.x,b.y,b.w,b.h)){ ok=false; break; }
    }
    if (ok && circlesOverlap(x,y,radius, circles)) ok = false;
    if (ok) return {x,y};
  }
  return {x: CONFIG.WIDTH/2, y: CONFIG.HEIGHT/2};
}
