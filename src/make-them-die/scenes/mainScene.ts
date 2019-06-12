/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      Digitsensitive
 */

import { Player } from '../classes/Player'

export class MainScene extends Phaser.Scene {
  private stars: Phaser.GameObjects.Sprite[];
  private player: Phaser.Physics.Arcade.Image;
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private angle: number = 0;
  private bullets: any;

  constructor() {
    super({
      key: "MainScene"
    });
    this.stars = []
  }

  preload(): void {
    this.load.image("star_flare_default", "./src/make-them-die/assets/sprites/star_flare_default.png");
    this.load.image("star_flare", "./src/make-them-die/assets/sprites/star_flare.png");
    this.load.image("star_part_default", "./src/make-them-die/assets/sprites/star_part_default.png");
    this.load.image("star_part", "./src/make-them-die/assets/sprites/star_part.png");
    this.load.image("player", "./src/make-them-die/assets/sprites/player.png");
  }

  create(): void {
    this.cameras.main.setBounds(0, 0, Number(this.game.config.width) * 4, Number(this.game.config.height) * 4);
    this.physics.world.setBounds(0, 0, Number(this.game.config.width) * 4, Number(this.game.config.height) * 4);
    this.createStars(500, 0.05, 0.15);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = this.physics.add.image(Number(this.game.config.width) * 2, Number(this.game.config.height) * 2, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.1)
    this.cameras.main.startFollow(this.player, true, 0.3, 0.3);
    this.cameras.main.followOffset.set(0, 0);
  }

  createStars(density, minScale, maxScale): void {
    for (let i in [...Array(density).keys()]) {
      let star = Math.random() > 0.5 ? this.add.sprite(0, 0, "star_flare") : this.add.sprite(0, 0, "star_flare_default");
      star.setScale(Math.random() * maxScale + minScale);
      star.setRandomPosition(0, 0, Number(this.game.config.width) * 4, Number(this.game.config.height) * 4);
    }
  }

  update(): void {
    let velocity: any = {x: 0, y: 0};

    if (this.cursors.left.isDown) {
      this.angle = 270;
      velocity.x += -250;
    }
    if (this.cursors.right.isDown) {
      this.angle = 90;
      velocity.x += 250;
    }
    if (this.cursors.up.isDown) {
      this.angle = 0;
      velocity.y += -250;
    }
    if (this.cursors.down.isDown) {
      this.angle = 180;
      velocity.y += 250;
    }
    if (this.cursors.right.isDown && this.cursors.up.isDown) {
      this.angle = 45;
    }
    else if (this.cursors.right.isDown && this.cursors.down.isDown) {
      this.angle = 135;
    }
    else if (this.cursors.left.isDown && this.cursors.up.isDown) {
      this.angle = 315;
    }
    else if (this.cursors.left.isDown && this.cursors.down.isDown) {
      this.angle = 225;
    }
    this.player.setVelocityX(velocity.x);
    this.player.setVelocityY(velocity.y);
    this.player.setAngle(this.angle);
  }
}
