// js/entities/ammo.js
class Ammo{
  constructor(x,y){
    this.x=x; this.y=y;
    this.r = CONFIG.AMMO.RADIUS;
    this.alive = true;
  }
  draw(ctx){
    if (!this.alive) return;
    ctx.fillStyle = CONFIG.COLORS.ammo;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.font = '10px system-ui';
    ctx.textAlign='center';
    ctx.fillText('A', this.x, this.y+3);
  }
}
