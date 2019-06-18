export class GameOverScene  extends Phaser.Scene {
    private gameOverText: Phaser.GameObjects.Text;
    constructor() {
        super({
            key: "GameOverScene"
        });
    }

    create() {
        console.log('gameover');
        this.createText();
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start('MainScene');
            this.scene.stop();
          });
        this.time.addEvent({ delay: 5000, callback: () => this.restart() });
        this.input.keyboard.once('keydown-R', () => this.restart());
    }

    restart() {
      this.cameras.main.fade(250, 0, 0, 0);
    }

    createText(): void {
        this.gameOverText = this.add.text(100, Number(this.game.config.height) / 3, 'GAME OVER\nPress "R" to restart');
        this.gameOverText.setTint(0xff0000, 0xff0000, 0xff9999, 0xff9999);
        this.gameOverText.setStroke("white", 1);
        this.gameOverText.setAlign('center');
        this.gameOverText.setFontSize(54);
      }
}