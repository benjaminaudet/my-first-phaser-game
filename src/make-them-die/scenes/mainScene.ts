/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      Digitsensitive
 */

import { Player } from '../classes/Player'

const ANGULAR_VELOCITY_INERTIA = 50;
const ANGULAR_VELOCITY = 300;
const PLAYER_SPEED = 500;

export class MainScene extends Phaser.Scene {
  private stars: Phaser.GameObjects.Sprite[];
  private player: Phaser.Physics.Arcade.Image;
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private angularVelocity: number = 0;
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
    this.cameras.main.startFollow(this.player, true, 10, 10);
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
    this.playerMovements();
  }

  playerMovements(): void {
    let velocity = new Phaser.Math.Vector2();
    if (this.angularVelocity > 0) {
      this.angularVelocity -= ANGULAR_VELOCITY_INERTIA;
    } else if (this.angularVelocity < 0) {
      this.angularVelocity += ANGULAR_VELOCITY_INERTIA;
    }
    this.player.setAngularVelocity(this.angularVelocity)
    if (this.cursors.up.isDown) {
      velocity = this.physics.velocityFromAngle(this.player.angle - 90, PLAYER_SPEED);
    }
    if (this.cursors.left.isDown && !this.cursors.left.shiftKey) {
      this.angularVelocity = -ANGULAR_VELOCITY;
    } else if (this.cursors.left.isDown && this.cursors.left.shiftKey) {
      velocity = this.physics.velocityFromAngle(this.player.angle - 180, PLAYER_SPEED);
    }
    if (this.cursors.right.isDown && !this.cursors.right.shiftKey) {
      this.angularVelocity = ANGULAR_VELOCITY;
    } else if (this.cursors.right.isDown && this.cursors.right.shiftKey) {
      velocity = this.physics.velocityFromAngle(this.player.angle, PLAYER_SPEED);
    }
    this.player.setVelocity(velocity.x, velocity.y);
  }
}
