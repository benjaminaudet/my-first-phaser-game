import Entity from "./Entity";

export default class Bullet extends Entity {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
        super(scene, x, y, texture, frame);
        this.setScale(0.1);
        (<Phaser.Physics.Arcade.Body>this.body).setAllowGravity(false);
    }

    fire(angle) {
        this.angle = angle - 90;
        let bulletVelocity = new Phaser.Math.Vector2();
        bulletVelocity = this.scene.physics.velocityFromAngle(angle - 90, 900);
        this.setVelocity(bulletVelocity.x, bulletVelocity.y);
    }

    update(): void {
    }

}