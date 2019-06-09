/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      Digitsensitive
 */

export class MainScene extends Phaser.Scene {
  private stars: Phaser.GameObjects.Sprite[];

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image("star_flare_default", "./src/boilerplate/assets/sprites/star_flare_default.png");
    this.load.image("star_flare", "./src/boilerplate/assets/sprites/star_flare.png");
    this.load.image("star_part_default", "./src/boilerplate/assets/sprites/star_part_default.png");
    this.load.image("star_part", "./src/boilerplate/assets/sprites/star_part.png");
  }

  create(): void {
    console.log(this)
    // this.stars.push(game.add.sprite(0, 300, "star_flare"));
    // this.stars.forEach(star => star.scale.setTo())
  }
}
