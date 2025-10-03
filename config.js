// js/config.js
const CONFIG = {
  WIDTH: 960,
  HEIGHT: 540,
  TILE: 30,
  DEBUG: false,
  PLAYER: {
    SPEED: 120,
    TURN_SPEED: 3.0,
    RADIUS: 16,
    MAX_AMMO: 6,
    START_LIVES: 3,
  },
  BULLET: {
    SPEED: 320,
    RADIUS: 4,
    LIFETIME: 2.5
  },
  AMMO: {
    RADIUS: 8,
    PER_LEVEL_BASE: 6
  },
  ENEMY: {
    SPEED_BASE: 90,
    TURN_SPEED_BASE: 2.4,
    RADIUS: 16
  },
  COLORS: {
    player: '#7ee787',
    enemy: '#ff7b72',
    bulletP: '#7ee787',
    bulletE: '#ffb3ac',
    ammo: '#ffd166',
    barrier: '#2b3f77'
  }
};
