export default class Entity extends Phaser.Physics.Arcade.Image {

    constructor(scene, x, y, texture, frame?) {
        super(scene, x, y, texture, frame);

        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    }
}