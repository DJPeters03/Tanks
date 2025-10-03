// js/main.js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const ui = {
  level: document.getElementById('uiLevel'),
  lives: document.getElementById('uiLives'),
  score: document.getElementById('uiScore'),
  ammo: document.getElementById('uiAmmo'),
  progress: document.getElementById('progress'),
  curve: document.getElementById('curve'),
  btnStart: document.getElementById('btnStart'),
  btnPause: document.getElementById('btnPause'),
  btnReset: document.getElementById('btnReset'),
};

let level1passed=false, level2passed=false, level3passed=false, level4passed=false, level5passed=false,
    level6passed=false, level7passed=false, level8passed=false, level9passed=false, level10passed=false;

const keys = {};
window.addEventListener('keydown', e=>{ keys[e.code]=true; if (e.code==='Space') e.preventDefault(); });
window.addEventListener('keyup', e=>{ keys[e.code]=false; });

const world = {
  player: null,
  enemies: [],
  bullets: [],
  ammos: [],
  barriers: [],
  level: 1,
  lives: CONFIG.PLAYER.START_LIVES,
  score: 0,
  running: false,
  enemySpeed: CONFIG.ENEMY.SPEED_BASE,
  enemyTurn: CONFIG.ENEMY.TURN_SPEED_BASE,
  aiParams: {aimErr:0.6, shootCd:1.0, bravery:0.5},
  enemyBrains: [],
  ammoTimer: 0,
};

function resetLevelFlags(){
  level1passed=level2passed=level3passed=level4passed=level5passed=level6passed=level7passed=level8passed=level9passed=level10passed=false;
}
function updateProgressDots(){
  ui.progress.innerHTML = '';
  for (let i=1;i<=10;i++){
    const d = document.createElement('span');
    d.className='leveldot'+((i<=world.level-1)?' passed':'');
    ui.progress.appendChild(d);
  }
}

function initLevel(n){
  world.bullets.length=0;
  world.ammos.length=0;
  world.enemies.length=0;
  world.enemyBrains.length=0;
  const def = LEVELS[Math.max(0, Math.min(LEVELS.length-1, n-1))];
  world.aiParams = def.ai;
  world.enemySpeed = CONFIG.ENEMY.SPEED_BASE * (1 + 0.06*(n-1));
  world.enemyTurn = CONFIG.ENEMY.TURN_SPEED_BASE * (1 + 0.05*(n-1));
  world.barriers = buildBarriers(def.layout);

  if (!world.player){
    world.player = new Tank(CONFIG.WIDTH*0.2, CONFIG.HEIGHT*0.5, CONFIG.COLORS.player);
  }
  world.player.alive = true;
  world.player.x = CONFIG.WIDTH*0.2;
  world.player.y = CONFIG.HEIGHT*0.5;
  world.player.dir = 0;
  world.player.ammo = Math.min(CONFIG.PLAYER.MAX_AMMO, 2);

  for (let i=0;i<def.enemies;i++){
    const p = placeNonOverlapping(200, CONFIG.ENEMY.RADIUS+4, world.barriers);
    const e = new Tank(p.x, p.y, CONFIG.COLORS.enemy);
    e.isEnemy = true;
    e.speed = world.enemySpeed;
    e.turnSpeed = world.enemyTurn;
    e.ammo = 1;
    world.enemies.push(e);
    world.enemyBrains.push(new EnemyAI(e, def.ai));
  }

  const curve = ui.curve.value;
  let ammoCount = def.ammo;
  if (curve==='ammo-scarce') ammoCount = Math.max(3, Math.floor(def.ammo*0.7));
  if (curve==='swarm') ammoCount = Math.floor(def.ammo*1.2);
  for (let i=0;i<ammoCount;i++){
    const pos = placeNonOverlapping(200, CONFIG.AMMO.RADIUS+10, world.barriers);
    world.ammos.push(new Ammo(pos.x, pos.y));
  }
  world.ammoTimer = 0;

  world.level = n;
  ui.level.textContent = n;
  ui.lives.textContent = world.lives;
  ui.score.textContent = world.score;
  ui.ammo.textContent = world.player.ammo;
  updateProgressDots();
}

function handlePlayer(dt){
  const P = world.player;
  if (!P.alive) return;
  if (keys['KeyA']) P.dir -= P.turnSpeed*dt;
  if (keys['KeyD']) P.dir += P.turnSpeed*dt;
  let mv = 0;
  if (keys['KeyW']) mv += 1;
  if (keys['KeyS']) mv -= 1;
  const nx = P.x + Math.cos(P.dir)*P.speed*dt*mv;
  const ny = P.y + Math.sin(P.dir)*P.speed*dt*mv;
  P.tryMove(nx,ny, world.barriers);
  if (keys['Space']) {
    P.shoot(world.bullets);
  }
  P.updateCooldown(dt);
}

function collectPickups(){
  const actors = [world.player, ...world.enemies];
  for (const a of actors){
    if (!a.alive) continue;
    for (const m of world.ammos){
      if (!m.alive) continue;
      if (Math.hypot(a.x-m.x, a.y-m.y) <= a.r + m.r){
        if (a.ammo < CONFIG.PLAYER.MAX_AMMO){
          a.ammo++;
          m.alive=false;
        }
      }
    }
  }
  world.ammos = world.ammos.filter(a=>a.alive);
}

function bulletHits(){
  for (const b of world.bullets){
    if (!b.alive) continue;
    const targets = b.isEnemy ? [world.player] : world.enemies;
    for (const t of targets){
      if (!t.alive) continue;
      if (Math.hypot(b.x-t.x, b.y-t.y) <= (b.r + t.r)){
        t.alive = false;
        b.alive = false;
        if (!b.isEnemy) world.score += 100;
      }
    }
  }
  world.bullets = world.bullets.filter(b=>b.alive);
}

function checkEnd(){
  const allDead = world.enemies.every(e=>!e.alive);
  if (allDead){
    const idx = world.level;
    if (idx===1) level1passed=true;
    if (idx===2) level2passed=true;
    if (idx===3) level3passed=true;
    if (idx===4) level4passed=true;
    if (idx===5) level5passed=true;
    if (idx===6) level6passed=true;
    if (idx===7) level7passed=true;
    if (idx===8) level8passed=true;
    if (idx===9) level9passed=true;
    if (idx===10) level10passed=true;
    updateProgressDots();
    if (world.level<10){
      initLevel(world.level+1);
    }else{
      world.running=false;
      alert('You cleared all 10 levels! Final Score: '+world.score);
    }
  }
  if (!world.player.alive){
    world.lives--;
    if (world.lives<=0){
      resetLevelFlags();
      world.lives = CONFIG.PLAYER.START_LIVES;
      world.score = 0;
      initLevel(1);
    }else{
      initLevel(world.level);
    }
  }
}

let last=0, rafId=0;
function loop(ts){
  if (!world.running){ rafId = requestAnimationFrame(loop); return; }
  if (!last) last=ts;
  const dt = Math.min(0.033, (ts-last)/1000);
  last = ts;

  // UPDATE
  handlePlayer(dt);
  for (let i=0;i<world.enemies.length;i++){
    world.enemyBrains[i].update(dt, world);
    world.enemies[i].updateCooldown(dt);
  }
  for (const b of world.bullets) b.update(dt, world.barriers);

  // Timed ammo spawn: 1 every 5 seconds
  world.ammoTimer += dt;
  if (world.ammoTimer >= 5.0){
    world.ammoTimer = 0;
    const circles = [{x:world.player.x,y:world.player.y,r:world.player.r}].concat(world.enemies.map(e=>({x:e.x,y:e.y,r:e.r})));
    const pos = placeNonOverlappingEntities(300, CONFIG.AMMO.RADIUS+10, world.barriers, circles);
    world.ammos.push(new Ammo(pos.x, pos.y));
  }

  collectPickups();
  bulletHits();
  ui.ammo.textContent = world.player.ammo;
  checkEnd();

  // DRAW
  ctx.clearRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
  ctx.fillStyle = CONFIG.COLORS.barrier;
  for (const b of world.barriers){ ctx.fillRect(b.x,b.y,b.w,b.h); }
  for (const a of world.ammos) a.draw(ctx);
  for (const b of world.bullets) b.draw(ctx);
  for (const e of world.enemies) e.draw(ctx);
  world.player.draw(ctx);

  rafId = requestAnimationFrame(loop);
}

ui.btnStart.addEventListener('click', ()=>{ world.running=true; });
ui.btnPause.addEventListener('click', ()=>{ world.running=false; });
ui.btnReset.addEventListener('click', ()=>{
  resetLevelFlags();
  world.lives = CONFIG.PLAYER.START_LIVES;
  world.score = 0;
  initLevel(1);
});

initLevel(1);
updateProgressDots();
requestAnimationFrame(loop);
