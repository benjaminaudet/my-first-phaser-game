import Entity from "./Entity";
import Bullet from './Bullet'

const ANGULAR_VELOCITY_INERTIA = 50;
const ANGULAR_VELOCITY = 300;
const MAX_PLAYER_SPEED = 500;
const ACCELERATION_VALUE: number = 10;
const TIME_BETWEEN_SHOTS = 200;

export class Player extends Entity {
  private shootPatterns = [
    [
      0
    ],
    [
      -15,
      15
    ],
    [
      -15,
      0,
      15
    ],
    [
      -30,
      -15,
      15,
      30
    ],
    [
      -30,
      -15,
      0,
      15,
      30
    ]
  ];
  private angularVelocity: number = 0;
  private levelShoot: number = 1;
  private playerSpeed: number = 0;
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  private lastUpgradeShoot: number = 0;
  private lastShot: number = 0;
  private intervalBetweenShots: number = 200;
  public health: number = 15;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
    super(scene, x, y, texture, frame);
    this.setVelocity(0);
    this.setScale(0.3)
    this.setCollideWorldBounds(true);
    (<Phaser.Physics.Arcade.Body>this.body).setAllowGravity(false);
  }

  upgradeLevelShoot() {
    if (new Date().getTime() > this.lastUpgradeShoot + 250) {
      this.lastUpgradeShoot = new Date().getTime();
      this.levelShoot++;
    }
  }

  downgradeLevelShoot() {
    if (new Date().getTime() > this.lastUpgradeShoot + 250) {
      this.lastUpgradeShoot = new Date().getTime();
      this.levelShoot--;
    }
  }

  shoot(number): Entity[] {
    if (number > 5) {
      number = 5;
    } else if (number < 1) {
      number = 1;
    }
    let bullets = [];
    for (let i = 0; i < number; i++) {
      const bullet = new Bullet(this.scene, this.x, this.y, 'ball', 800);
      bullets.push(bullet);
      bullet.fire(this.angle + this.shootPatterns[number - 1][i]);
    }
    return bullets;
  }

  handleShoot(cursors): Entity[] {
    if (this.lastShot == 0) {
      this.lastShot = new Date().getTime();
    }
    if (cursors.space.isDown) {
      if (new Date().getTime() >= this.lastShot + TIME_BETWEEN_SHOTS) {
        this.lastShot = new Date().getTime();
        return this.shoot(this.levelShoot);
      }
    }
  }

  handleMovements(cursors): void {
    if (this.angularVelocity > 0) {
      this.angularVelocity -= ANGULAR_VELOCITY_INERTIA;
    } else if (this.angularVelocity < 0) {
      this.angularVelocity += ANGULAR_VELOCITY_INERTIA;
    }
    this.setAngularVelocity(this.angularVelocity)
    if (cursors.up.isDown) {
      this.playerSpeed += this.playerSpeed < MAX_PLAYER_SPEED ? ACCELERATION_VALUE : 0;
      this.velocity = this.scene.physics.velocityFromAngle(this.angle - 90, this.playerSpeed);
    }
    if (cursors.down.isDown) {
      this.playerSpeed = this.playerSpeed / 1.4;
      if (this.playerSpeed > 0) {
        this.playerSpeed -= this.playerSpeed <= MAX_PLAYER_SPEED ? ACCELERATION_VALUE : 0;
      }
      this.velocity = this.scene.physics.velocityFromAngle(this.angle - 90, this.playerSpeed);
    }
    if (cursors.left.isDown) {
      this.angularVelocity = -ANGULAR_VELOCITY;
    }
    if (cursors.right.isDown) {
      this.angularVelocity = ANGULAR_VELOCITY;
    }
    this.scene.input.keyboard.on('keydown-O', () => this.upgradeLevelShoot())
    this.scene.input.keyboard.on('keydown-P', () => this.downgradeLevelShoot())
    this.setVelocity(this.velocity.x, this.velocity.y);
  }

  update(cursors): void {
    this.handleMovements(cursors);
  }
}