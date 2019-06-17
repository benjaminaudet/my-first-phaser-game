import Entity from "./Entity";
import Bullet from './Bullet'

const ANGULAR_VELOCITY_INERTIA = 50;
const ANGULAR_VELOCITY = 300;
const MAX_PLAYER_SPEED = 500;
const ACCELERATION_VALUE: number = 10;

export class Player extends Entity {
  private angularVelocity: number = 0;
  private playerSpeed: number = 0;
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  private lastShot: number = 0;
  private intervalBetweenShots: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
    super(scene, x, y, texture, frame);
    this.setVelocity(0);
    this.setScale(0.1)
    this.setCollideWorldBounds(true);
    (<Phaser.Physics.Arcade.Body>this.body).setAllowGravity(false);
  }

  handleShoot(cursors): Entity {
    if (this.lastShot == 0) {
      this.lastShot = new Date().getTime();
    }
    if (cursors.space.isDown) {
      if (new Date().getTime() >= this.lastShot + this.intervalBetweenShots) {
        this.lastShot = new Date().getTime();
        const bullet = new Bullet(this.scene, this.x, this.y, 'ball');
        bullet.fire(this.angle);
        return bullet;
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
    this.setVelocity(this.velocity.x, this.velocity.y);
  }

  update(cursors): void {
    this.handleMovements(cursors);
  }
}