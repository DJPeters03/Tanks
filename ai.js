// js/ai.js
class EnemyAI{
  constructor(tank, params){
    this.tank = tank;
    this.params = Object.assign({aimErr:0.4, shootCd:0.9, bravery:0.6}, params||{});
    this.lastShoot = 0;
  }
  steerAwayFromBarriers(dir, world){
    const T = this.tank;
    const probes = [0, 0.6, -0.6];
    let bias = 0;
    const ahead = 32 + 28*(world.level/10);
    for (const p of probes){
      const a = dir + p;
      const px = T.x + Math.cos(a)*ahead;
      const py = T.y + Math.sin(a)*ahead;
      for (const b of world.barriers){
        if (circleRectCollide(px,py, T.r*0.9, b.x,b.y,b.w,b.h)){
          bias += (p>0? -0.8 : 0.8);
        }
      }
    }
    return dir + bias*0.04;
  }
  update(dt, world){
    const T = this.tank;
    if (!T.alive) return;
    const player = world.player;

    let nearestAmmo = null, bestD=1e9;
    for (const a of world.ammos){
      if (!a.alive) continue;
      const d2 = dist2({x:T.x,y:T.y},{x:a.x,y:a.y});
      if (d2<bestD){bestD=d2; nearestAmmo=a;}
    }
    const needAmmo = (T.ammo<=0);
    let tx,ty;
    if (needAmmo && nearestAmmo){ tx=nearestAmmo.x; ty=nearestAmmo.y; }
    else{ tx=player.x; ty=player.y; }

    let aimTarget = {x:tx, y:ty};
    if (!needAmmo){
      if (!player._lx){ player._lx=player.x; player._ly=player.y; }
      const vx = (player.x - player._lx) / Math.max(dt, 1/60);
      const vy = (player.y - player._ly) / Math.max(dt, 1/60);
      aimTarget.x += vx * 0.20;
      aimTarget.y += vy * 0.20;
      player._lx = player.x; player._ly = player.y;
    }

    let desired = Math.atan2(aimTarget.y - T.y, aimTarget.x - T.x);
    desired = this.steerAwayFromBarriers(desired, world);

    const err = (Math.random()*2-1) * this.params.aimErr * 0.25;
    let delta = desired + err - T.dir;
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    const turn = clamp(delta, -T.turnSpeed*dt, T.turnSpeed*dt);
    T.dir += turn;

    const speed = world.enemySpeed;
    let nx = T.x + Math.cos(T.dir)*speed*dt;
    let ny = T.y + Math.sin(T.dir)*speed*dt;
    if (!T.tryMove(nx,ny, world.barriers)){
      const alt1 = T.dir + Math.PI*0.5;
      const alt2 = T.dir - Math.PI*0.5;
      nx = T.x + Math.cos(alt1)*speed*dt;
      ny = T.y + Math.sin(alt1)*speed*dt;
      if (!T.tryMove(nx,ny, world.barriers)){
        nx = T.x + Math.cos(alt2)*speed*dt;
        ny = T.y + Math.sin(alt2)*speed*dt;
        T.tryMove(nx,ny, world.barriers);
      }
    }

    this.lastShoot -= dt;
    if (!needAmmo && this.lastShoot<=0){
      const blocked = world.barriers.some(b => lineIntersectRect(T.x,T.y, player.x,player.y, b.x,b.y,b.w,b.h));
      const aimDot = Math.cos(Math.atan2(aimTarget.y-T.y, aimTarget.x-T.x) - T.dir);
      if (!blocked && aimDot > (0.82 - 0.22*(1-this.params.aimErr))){
        T.shoot(world.bullets);
        this.lastShoot = this.params.shootCd;
      }
    }
  }
}
