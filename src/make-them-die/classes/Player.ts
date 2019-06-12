export class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
        super(scene, x, y, texture, frame);
        this.setVelocity(0);
        this.setScale(0.1)
        this.setCollideWorldBounds(true);
    }

    defineMovements(cursors) {
        if (cursors.left.isDown) {
            this.setAngle(270);
            this.setVelocityX(-250);
        }
        else if (cursors.right.isDown) {
            this.setAngle(90);
            this.setVelocityX(250);
        }
        if (cursors.up.isDown) {
            this.setAngle(0);
            this.setVelocityY(-250);
        }
        else if (cursors.down.isDown) {
            this.setAngle(180);
            this.setVelocityY(250);
        }
        if (cursors.right.isDown && cursors.up.isDown) {
            this.setAngle(45);
        }
        else if (cursors.right.isDown && cursors.down.isDown) {
            this.setAngle(135);
        }
        else if (cursors.left.isDown && cursors.up.isDown) {
            this.setAngle(315);
        }
        else if (cursors.left.isDown && cursors.down.isDown) {
            this.setAngle(225);
        }
    }
}