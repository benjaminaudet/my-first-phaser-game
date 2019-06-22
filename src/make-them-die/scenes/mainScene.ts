/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      Digitsensitive
 */

import { Player } from '../classes/Player'
import { Ennemy } from '../classes/Ennemy'

const SIZE = 16;
const STARS_DENSITY: number = 3000;

export class MainScene extends Phaser.Scene {
  private player: Player;
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private ennemies: Ennemy[] = [];
  private score: number = 0;
  private scoreText: Phaser.GameObjects.Text;
  private nextScene: string;
  private sounds: Phaser.Sound.BaseSound[] = [];

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.path = './src/make-them-die/assets/sprites/';
    this.load.image("star_flare_default", "star_flare_default.png");
    this.load.image("star_flare", "star_flare.png");
    this.load.image("star_part_default", "star_part_default.png");
    this.load.image("star_part", "star_part.png");
    this.load.image("ennemy", "ennemy.png");
    this.load.image("player", "player_2.png");
    this.load.image("ball", "ball.png");
    this.load.image("ball_red", "ball-red.png");
    this.load.atlas('explosion1', 'explosion_1.png', 'explosion.json');
    this.load.atlas('explosion2', 'explosion_2.png', 'explosion.json');
    this.load.atlas('explosion3', 'explosion_3.png', 'explosion.json');
    this.load.atlas('explosion4', 'explosion_4.png', 'explosion.json');
    this.load.path = './src/make-them-die/assets/sounds/';
    this.load.audio('explosion1', 'explosion1.mp3');
    this.load.audio('explosion2', 'explosion2.mp3');
    this.load.audio('explosion3', 'explosion3.mp3');
    this.load.audio('laser1', 'laser1.mp3');
    this.load.audio('laser2', 'laser2.mp3');
  }

  create(): void {
    this.score = 0;
    this.physics.world.setFPS(60)

    // Set camera and world bounds
    this.cameras.main.setBounds(0, 0, Number(this.game.config.width) * SIZE, Number(this.game.config.height) * SIZE);
    this.physics.world.setBounds(0, 0, Number(this.game.config.width) * SIZE, Number(this.game.config.height) * SIZE);

    // Generate backgrounds stars
    this.createStars(STARS_DENSITY, 0.05, 0.15);
    
    // Generate ennemies
    this.createEnnemies(300);
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Create player at the center of the map
    this.player = new Player(this, Number(this.game.config.width) * SIZE / 2, Number(this.game.config.height) * SIZE / 2, 'player');
    
    // Add collisions between all ennemis and player
    this.ennemies.forEach(ennemy => this.physics.add.collider(this.player, ennemy, this.collidePlayer, null, this));

    // Make the camera follow the player
    this.cameras.main.startFollow(this.player, true, 5, 5);
    this.cameras.main.followOffset.set(0, 0);
    
    // Add score and health label
    this.createText();

    // Set the listener on camera fadeout complete to change the scene
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start(this.nextScene);
      this.scene.stop();
    });

    // Declare explosions textures
    this.declareExplosions();

    this.sounds.push(this.sound.add('explosion1'));
    this.sounds.push(this.sound.add('explosion2'));
    this.sounds.push(this.sound.add('explosion3'));
    this.sounds.push(this.sound.add('laser1'));
    this.sounds.push(this.sound.add('laser2'));
  }

  declareExplosions() {
    this.textures.addSpriteSheetFromAtlas(
      't_explosion1',
      {
        atlas: 'explosion1',
        frame: 'explosion',
        frameWidth: 512,
        frameHeight: 512,
        endFrame: 64
      }
    );
    this.textures.addSpriteSheetFromAtlas(
      't_explosion2',
      {
        atlas: 'explosion2',
        frame: 'explosion',
        frameWidth: 512,
        frameHeight: 512,
        endFrame: 64
      }
    );
    this.textures.addSpriteSheetFromAtlas(
      't_explosion3',
      {
        atlas: 'explosion3',
        frame: 'explosion',
        frameWidth: 512,
        frameHeight: 512,
        endFrame: 64
      }
    );
    this.textures.addSpriteSheetFromAtlas(
      't_explosion4',
      {
        atlas: 'explosion4',
        frame: 'explosion',
        frameWidth: 512,
        frameHeight: 512,
        endFrame: 64
      }
    );
    var config1 = {
      key: 'explode1',
      frames: this.anims.generateFrameNumbers('t_explosion1', { start: 0, end: 64 }),
      frameRate: 60,
      repeat: 0
    };
    var config2 = {
      key: 'explode2',
      frames: this.anims.generateFrameNumbers('t_explosion2', { start: 0, end: 64 }),
      frameRate: 60,
      repeat: 0
    };
    var config3 = {
      key: 'explode3',
      frames: this.anims.generateFrameNumbers('t_explosion3', { start: 0, end: 64 }),
      frameRate: 60,
      repeat: 0
    };
    var config4 = {
      key: 'explode4',
      frames: this.anims.generateFrameNumbers('t_explosion4', { start: 0, end: 64 }),
      frameRate: 60,
      repeat: 0
    };
    this.anims.create(config1);
    this.anims.create(config2);
    this.anims.create(config3);
    this.anims.create(config4);
  }

  countEnnemies() {
    let count = 0;
    this.ennemies.forEach(ennemy => {
      if (ennemy.body) {
        count++;
      }
    })
    return count;
  }

  createText(): void {
    this.scoreText = this.add.text(this.player.x, this.player.y, '');
    this.scoreText.setTint(0xff0000, 0xff0000, 0xff9999, 0xff9999);
    this.scoreText.setStroke("white", 1);
    this.scoreText.setFontSize(18);
  }

  createEnnemies(number): void {
    for (let i in [...Array(number).keys()]) {
      const ennemy = new Ennemy(this, Math.random() * Number(this.game.config.width) * SIZE, Math.random() * Number(this.game.config.height) * SIZE, 'ennemy');
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
    this.scoreText.x = this.player.x + Number(this.game.config.width) / 2 - 300;
    this.scoreText.y = this.player.y - 270;
    this.scoreText.text = `
      Score: ${this.score}\n
      Health: ${this.player.health}\n
      Ennemies left: ${this.countEnnemies()}
    `;
  }

  isGameOver(): boolean {
    if (this.player.health <= 0) {
      this.nextScene = 'GameOverScene';
      this.cameras.main.fade(1000, 0, 0, 0);
    }
    return false;
  }

  update(): void {
    if (!this.isGameOver()) {
      this.updateText();
      this.player.update(this.cursors);
      const bullets = this.player.handleShoot(this.cursors);
      if (bullets) {
        const randomLaserIndexSound = Phaser.Math.Between(3, 4);
        this.sounds[randomLaserIndexSound].play();
        bullets.forEach(bullet => this.ennemies.forEach(ennemy => this.physics.add.collider(bullet, ennemy, this.hitEnnemy, null, this)));
      }
      this.ennemies.forEach(ennemy => {
        ennemy.update();
        const bullet = ennemy.randomShoot();
        if (bullet) {
          this.physics.add.collider(bullet, this.player, this.hitPlayer, null)
        }
      });
    }
  }

  ennemyDie(ennemy): void {
    const randomExplosionNumber = Phaser.Math.Between(1, 4);
    const explosion = this.add.sprite(ennemy.x, ennemy.y, `explode${randomExplosionNumber}`).play(`explode${randomExplosionNumber}`);
    const randomExplosionNumberSound = Phaser.Math.Between(0, 2);
    this.sounds[randomExplosionNumberSound].play();
    if (randomExplosionNumber != 1) {
      explosion.setScale(0.5);
    }
    this.time.addEvent({delay: 1200, callback: () => explosion.destroy()})
    ennemy.destroy();
    this.score++;
  }

  hitEnnemy(bullet, ennemy): void {
    bullet.destroy();
    this.ennemyDie(ennemy);
  }

  collidePlayer(player, ennemy): void {
    this.ennemyDie(ennemy);
    player.health--;
  }

  hitPlayer(bullet, player): void {
    bullet.destroy();
    player.health--;
  }

}
