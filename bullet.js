// js/entities/bullet.js
class Bullet{
  constructor(x,y, dir, owner, isEnemy){
    this.x=x; this.y=y;
    this.vx = Math.cos(dir) * CONFIG.BULLET.SPEED;
    this.vy = Math.sin(dir) * CONFIG.BULLET.SPEED;
    this.owner = owner;
    this.isEnemy = !!isEnemy;
    this.alive = true;
    this.life = CONFIG.BULLET.LIFETIME;
    this.r = CONFIG.BULLET.RADIUS;
  }
  update(dt, barriers){
    if (!this.alive) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life<=0) this.alive=false;
    for (const b of barriers){
      if (circleRectCollide(this.x, this.y, this.r, b.x,b.y,b.w,b.h)){
        this.alive=false; break;
      }
    }
    if (this.x<0||this.y<0||this.x>CONFIG.WIDTH||this.y>CONFIG.HEIGHT) this.alive=false;
  }
  draw(ctx){
    if (!this.alive) return;
    ctx.fillStyle = this.isEnemy ? CONFIG.COLORS.bulletE : CONFIG.COLORS.bulletP;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
  }
}
