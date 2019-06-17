import Entity from "./Entity";

export class Ennemy extends Entity {
    public id: string;
    public lastMovement: number = 0;
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
        super(scene, x, y, texture, frame)
        this.setCollideWorldBounds(true);
        (<Phaser.Physics.Arcade.Body>this.body).setAllowGravity(false);
        this.setScale(0.08);
        this.setAngle(Math.random() * 360);
        this.setCollideWorldBounds(true);
    }

    randomMovements() {
        if (new Date().getTime() >= this.lastMovement + 5000) {
            this.lastMovement = new Date().getTime();
            if (this.body) {
                this.setVelocity(Math.random() * 400 - 200, Math.random() * 400 - 200);
                this.setAngularVelocity(Math.random() * 200 - 100);
            }
          }
    }

    update(): void {
        this.randomMovements();
    }

}