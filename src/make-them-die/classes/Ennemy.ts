import Entity from "./Entity";
import Bullet from "./Bullet";

const TIME_BETWEEN_SHOTS = 1000;
const TIME_BETWEEN_ROTATIONS = 2000;

export class Ennemy extends Entity {
  public id: string;
  public lastRotation: number = 0;
  public lastShot: number = 0;
  public velocity: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
    super(scene, x, y, texture, frame)
    this.setCollideWorldBounds(true).setBounce(1);
    (<Phaser.Physics.Arcade.Body>this.body).setAllowGravity(false);
    this.setScale(0.08);
    this.setAngle(Math.random() * 360);
  }

  randomMovement() {
    if (this.body) {
      this.velocity = this.scene.physics.velocityFromAngle(this.angle - 90, 300);
      this.setVelocity(this.velocity.x, this.velocity.y);
      if (new Date().getTime() >= this.lastRotation + TIME_BETWEEN_ROTATIONS) {
        this.lastRotation = new Date().getTime();
        this.setAngularVelocity(Phaser.Math.Between(-90, 90));
      }
    }
  }

  randomShoot(): Entity {
    if (this.body) {
      if (new Date().getTime() >= this.lastShot + TIME_BETWEEN_SHOTS) {
        this.lastShot = new Date().getTime();
        const bullet = new Bullet(this.scene, this.x, this.y, 'ball_red', 500);
        bullet.fire(this.angle);
        return bullet;
      }
    }
  }

  update(): void {
    this.randomMovement();
  }

}