// js/levels.js
const LEVELS = [
  { enemies:1, ammo:8,  ai:{aimErr:0.7, shootCd:1.2, bravery:0.3}, layout:'open' },
  { enemies:2, ammo:8,  ai:{aimErr:0.65, shootCd:1.1, bravery:0.4}, layout:'open' },
  { enemies:2, ammo:7,  ai:{aimErr:0.6, shootCd:1.0, bravery:0.45}, layout:'blocks' },
  { enemies:3, ammo:7,  ai:{aimErr:0.55, shootCd:0.95, bravery:0.5}, layout:'blocks' },
  { enemies:3, ammo:7,  ai:{aimErr:0.5, shootCd:0.9, bravery:0.55}, layout:'maze' },
  { enemies:4, ammo:6,  ai:{aimErr:0.45, shootCd:0.85, bravery:0.6}, layout:'maze' },
  { enemies:5, ammo:6,  ai:{aimErr:0.4, shootCd:0.8, bravery:0.65}, layout:'maze2' },
  { enemies:6, ammo:6,  ai:{aimErr:0.35, shootCd:0.75, bravery:0.7}, layout:'maze2' },
  { enemies:7, ammo:5,  ai:{aimErr:0.3, shootCd:0.7, bravery:0.75}, layout:'arena' },
  { enemies:8, ammo:5,  ai:{aimErr:0.25, shootCd:0.65, bravery:0.8}, layout:'arena' },
];

function buildBarriers(kind){
  const B = [];
  const W = CONFIG.WIDTH, H = CONFIG.HEIGHT;
  const playerStart = {x: W*0.2, y: H*0.5, r: CONFIG.PLAYER.RADIUS + 22};

  // Border walls
  B.push({x:0,y:0,w:W,h:10});
  B.push({x:0,y:H-10,w:W,h:10});
  B.push({x:0,y:0,w:10,h:H});
  B.push({x:W-10,y:0,w:10,h:H});

  function overlapsPlayerRect(x,y,w,h){
    return circleRectCollide(playerStart.x, playerStart.y, playerStart.r, x,y,w,h);
  }
  function tryAddRect(x,y,w,h){
    if (!overlapsPlayerRect(x,y,w,h)){
      B.push({x,y,w,h});
    }
  }
  function addBlocks(n, w,h){
    let tries = 0, added=0;
    while (added<n && tries<500){
      const x = randRange(60, W-60-w);
      const y = randRange(60, H-60-h);
      if (!overlapsPlayerRect(x,y,w,h)){
        B.push({x,y,w,h});
        added++;
      }
      tries++;
    }
  }

  if (kind==='open'){
    addBlocks(3, 80, 16);
  } else if (kind==='blocks'){
    addBlocks(6, 80, 16);
    addBlocks(4, 16, 80);
  } else if (kind==='maze'){
    for (let y=120; y<=H-120; y+=100){
      tryAddRect(120, y, W-240, 14);
    }
    addBlocks(4, 60, 16);
  } else if (kind==='maze2'){
    for (let x=120; x<=W-120; x+=120){
      tryAddRect(x, 120, 14, H-240);
    }
    addBlocks(6, 60, 16);
  } else if (kind==='arena'){
    addBlocks(10, 70, 16);
    addBlocks(6, 16, 70);
  }

  return B;
}
