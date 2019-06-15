/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      Digitsensitive
 */

import { Player } from '../classes/Player'
import { Ennemy } from '../classes/Ennemy'

const ANGULAR_VELOCITY_INERTIA = 50;
const ANGULAR_VELOCITY = 300;
const MAX_PLAYER_SPEED = 500;
const SIZE = 8;
const STARS_DENSITY: number = 1000;
const ACCELERATION_VALUE: number = 10;

export class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Image;
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private angularVelocity: number = 0;
  private bullet: Phaser.Physics.Arcade.Image;
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  private playerSpeed: number = 0;
  private lastShot: number = 0;
  private intervalBetweenShots: number = 200;
  private ennemies: Ennemy[] = [];

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image("star_flare_default", "./src/make-them-die/assets/sprites/star_flare_default.png");
    this.load.image("star_flare", "./src/make-them-die/assets/sprites/star_flare.png");
    this.load.image("star_part_default", "./src/make-them-die/assets/sprites/star_part_default.png");
    this.load.image("star_part", "./src/make-them-die/assets/sprites/star_part.png");
    this.load.image("player", "./src/make-them-die/assets/sprites/player.png");
    this.load.image("ball", "./src/make-them-die/assets/sprites/ball.png");
  }

  create(): void {
    this.physics.world.setFPS(60)
    this.cameras.main.setBounds(0, 0, Number(this.game.config.width) * SIZE, Number(this.game.config.height) * SIZE);
    this.physics.world.setBounds(0, 0, Number(this.game.config.width) * SIZE, Number(this.game.config.height) * SIZE);
    this.createStars(STARS_DENSITY, 0.05, 0.15);
    this.createEnnemies(200);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = this.physics.add.image(Number(this.game.config.width) * 2, Number(this.game.config.height) * 2, 'player');
    this.ennemies.forEach(ennemy => this.physics.add.collider(this.player, ennemy, this.hitPlayer, null, this));
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.1);
    (<Phaser.Physics.Arcade.Body>this.player.body).setAllowGravity(false);
    this.cameras.main.startFollow(this.player, true, 10, 10);
    this.cameras.main.followOffset.set(0, 0);
  }

  createEnnemies(number): void {
    for (let i in [...Array(number).keys()]) {
      const ennemy = new Ennemy(this, Math.random() * Number(this.game.config.width) * SIZE, Math.random() * Number(this.game.config.height) * SIZE, 'player');

      this.ennemies.push(<Ennemy>ennemy);
    }
  }

  createStars(density, minScale, maxScale): void {
    for (let i in [...Array(density).keys()]) {
      let star = Math.random() > 0.5 ? this.add.sprite(0, 0, "star_flare") : this.add.sprite(0, 0, "star_flare_default");
      star.setScale(Math.random() * maxScale + minScale);
      star.setRandomPosition(0, 0, Number(this.game.config.width) * SIZE, Number(this.game.config.height) * SIZE);
    }
  }

  update(): void {
    this.playerShoots();
    this.playerMovements();
    this.ennemiesMovements();
  }

  playerShoots(): void {
    if (this.lastShot == 0) {
      this.lastShot = new Date().getTime();
    }
    if (this.cursors.space.isDown) {
      if (new Date().getTime() >= this.lastShot + this.intervalBetweenShots) {
        let bulletVelocity = new Phaser.Math.Vector2();
        this.lastShot = new Date().getTime();
        this.bullet = this.physics.add.image(this.player.x, this.player.y, 'ball');
        this.bullet.setScale(0.1);
        this.ennemies.forEach(ennemy => this.physics.add.collider(this.bullet, ennemy, this.hitEnnemy, null, this));
        this.bullet.angle = this.player.angle - 90;
        (<Phaser.Physics.Arcade.Body>this.bullet.body).setAllowGravity(false);
        bulletVelocity = this.physics.velocityFromAngle(this.player.angle - 90, 900);
        this.bullet.setVelocity(bulletVelocity.x, bulletVelocity.y);
      }
    }
  }

  ennemyDie(ennemy): void {
    ennemy.destroy();
  }

  hitEnnemy(bullet, ennemy): void {
    bullet.destroy();
    this.ennemyDie(ennemy);
  }

  hitPlayer(player, ennemy): void {
    this.ennemyDie(ennemy);
  }

  ennemiesMovements(): void {
    this.ennemies.forEach(ennemy => {
      ennemy.randomMovements();
    })
  }

  playerMovements(): void {
    if (this.angularVelocity > 0) {
      this.angularVelocity -= ANGULAR_VELOCITY_INERTIA;
    } else if (this.angularVelocity < 0) {
      this.angularVelocity += ANGULAR_VELOCITY_INERTIA;
    }
    this.player.setAngularVelocity(this.angularVelocity)
    if (this.cursors.up.isDown) {
      this.playerSpeed += this.playerSpeed < MAX_PLAYER_SPEED ? ACCELERATION_VALUE : 0;
      this.velocity = this.physics.velocityFromAngle(this.player.angle - 90, this.playerSpeed);
    }
    if (this.cursors.down.isDown) {
      this.playerSpeed = this.playerSpeed / 1.4;
      if (this.playerSpeed > 0) {
        this.playerSpeed -= this.playerSpeed <= MAX_PLAYER_SPEED ? ACCELERATION_VALUE : 0;
      }
      this.velocity = this.physics.velocityFromAngle(this.player.angle - 90, this.playerSpeed);
    }
    if (this.cursors.left.isDown) {
      this.angularVelocity = -ANGULAR_VELOCITY;
    }
    if (this.cursors.right.isDown) {
      this.angularVelocity = ANGULAR_VELOCITY;
    }
    this.player.setVelocity(this.velocity.x, this.velocity.y);
  }
}
