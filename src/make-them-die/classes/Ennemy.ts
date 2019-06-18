import Entity from "./Entity";
import Bullet from "./Bullet";

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

  randomMovements() {
    if (this.body) {
      this.velocity = this.scene.physics.velocityFromAngle(this.angle - 90, 400);
      this.setVelocity(this.velocity.x, this.velocity.y);
      if (new Date().getTime() >= this.lastRotation + 10000) {
        this.lastRotation = new Date().getTime();
        this.setAngularVelocity(Phaser.Math.Between(-90, 90));
      }
    }
  }

  randomShoots() {
    if (this.body) {
      if (new Date().getTime() >= this.lastShot + 2500) {
        this.lastShot = new Date().getTime();
        const bullet = new Bullet(this.scene, this.x, this.y, 'ball_red');
        bullet.fire(this.angle);
        return bullet;
      }
    }
  }

  update(): void {
    this.randomMovements();
    this.randomShoots();
  }

}