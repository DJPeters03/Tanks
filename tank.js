// js/entities/tank.js
class Tank{
  constructor(x,y, color){
    this.x=x; this.y=y;
    this.r = CONFIG.PLAYER.RADIUS;
    this.color = color || CONFIG.COLORS.player;
    this.dir = 0;
    this.speed = CONFIG.PLAYER.SPEED;
    this.turnSpeed = CONFIG.PLAYER.TURN_SPEED;
    this.alive = true;
    this.ammo = 0;
    this.cooldown = 0;
    this.cooldownDelay = 0.35;
    this.isEnemy = false;
  }
  circle(){ return {x:this.x,y:this.y,r:this.r}; }
  tryMove(nx,ny, barriers){
    for (const b of barriers){
      if (circleRectCollide(nx,ny,this.r, b.x,b.y,b.w,b.h)){
        return false;
      }
    }
    if (nx<this.r+10 || nx>CONFIG.WIDTH-this.r-10) return false;
    if (ny<this.r+10 || ny>CONFIG.HEIGHT-this.r-10) return false;
    this.x=nx; this.y=ny;
    return true;
  }
  updateCooldown(dt){ this.cooldown = Math.max(0, this.cooldown - dt); }
  shoot(bullets){
    if (this.cooldown>0 || this.ammo<=0) return;
    bullets.push(new Bullet(
      this.x + Math.cos(this.dir)*(this.r+6),
      this.y + Math.sin(this.dir)*(this.r+6),
      this.dir, this, this.isEnemy
    ));
    this.cooldown = this.cooldownDelay;
    this.ammo--;
  }
  draw(ctx){
    if (!this.alive) return;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + Math.cos(this.dir)*(this.r+10), this.y + Math.sin(this.dir)*(this.r+10));
    ctx.stroke();
    ctx.fillStyle = '#0b1020';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(String(this.ammo), this.x, this.y+4);
  }
}
