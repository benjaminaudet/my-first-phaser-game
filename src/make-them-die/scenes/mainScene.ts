/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      Digitsensitive
 */

import { Player } from '../classes/Player'
import { Ennemy } from '../classes/Ennemy'
import Entity from '../classes/Entity';

const SIZE = 8;
const STARS_DENSITY: number = 1000;

export class MainScene extends Phaser.Scene {
  private player: Player;
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private ennemies: Ennemy[] = [];
  private score: number = 0;
  private scoreText: Phaser.GameObjects.Text;

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
    this.player = new Player(this, Number(this.game.config.width) * 2, Number(this.game.config.height) * 2, 'player');
    this.ennemies.forEach(ennemy => this.physics.add.collider(this.player, ennemy, this.hitPlayer, null, this));
    this.cameras.main.startFollow(this.player, true, 10, 10);
    this.cameras.main.followOffset.set(0, 0);
    this.createText();
  }

  createText(): void {
    this.scoreText = this.add.text(this.player.x, this.player.y, '');
    this.scoreText.setTint(0xff0000, 0xff0000, 0xff9999, 0xff9999);
    this.scoreText.setStroke("white", 1);
    this.scoreText.setFontSize(18)
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

  updateText(): void {
    this.scoreText.x = this.player.x + Number(this.game.config.width) / 2 - 200;
    this.scoreText.y = this.player.y - 270;
    this.scoreText.text = `
      Score: ${this.score}\n
      Health: ${this.player.health}
    `;
  }

  isGameOver(): boolean {
    if (this.player.health <= 0) {
      return true;
    }
    return false;
  }

  update(): void {  
    if (!this.isGameOver()) {
      this.updateText();
      this.player.update(this.cursors);
      const bullet = this.player.handleShoot(this.cursors);
      if (bullet) {
        this.ennemies.forEach(ennemy => this.physics.add.collider(bullet, ennemy, this.hitEnnemy, null, this));
      }
      this.ennemies.forEach(ennemy => ennemy.update());
    }
  }

  ennemyDie(ennemy): void {
    ennemy.destroy();
    this.score++;
  }

  hitEnnemy(bullet, ennemy): void {
    bullet.destroy();
    this.ennemyDie(ennemy);
  }

  hitPlayer(player, ennemy): void {
    this.ennemyDie(ennemy);
    player.health--;
  }

}
