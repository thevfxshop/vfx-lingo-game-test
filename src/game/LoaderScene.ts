import Phaser from "phaser";
import { npcProfiles } from "./data/npcs";

export default class LoaderScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBg!: Phaser.GameObjects.Graphics;
  private barWidth = 360;
  private barHeight = 16;
  private barRadius = 8;
  private logo?: Phaser.GameObjects.Image;

  constructor() {
    super("loader-scene");
  }

  preload(): void {
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      1,
    );

    this.progressBg = this.add.graphics();
    this.progressBar = this.add.graphics();

    this.drawProgress(0);

    this.load.on("progress", (value: number) => {
      this.drawProgress(value);
    });

    this.load.on("complete", () => {
      this.cameras.main.fadeOut(350, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("set-scene");
        },
      );
    });

    this.load.svg("logo", "vfx-lingo.svg");
    this.load.once("filecomplete-svg-logo", () => {
      this.logo = this.add.image(
        this.scale.width / 2,
        this.scale.height / 2 - 60,
        "logo",
      );
      this.logo.setScale(0.4);
    });

    this.queueAssets();
  }

  create(): void {
    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      this.logo?.setPosition(gameSize.width / 2, gameSize.height / 2 - 60);
      this.drawProgress(0);
    });
  }

  private drawProgress(value: number): void {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2 + 60;
    const left = centerX - this.barWidth / 2;
    const top = centerY - this.barHeight / 2;

    this.progressBg.clear();
    this.progressBg.fillStyle(0x1f2937, 1);
    this.progressBg.fillRoundedRect(
      left,
      top,
      this.barWidth,
      this.barHeight,
      this.barRadius,
    );

    const filledWidth = Math.max(0, Math.min(1, value)) * this.barWidth;
    this.progressBar.clear();
    this.progressBar.fillStyle(0x22c55e, 1);
    this.progressBar.fillRoundedRect(
      left,
      top,
      filledWidth,
      this.barHeight,
      this.barRadius,
    );
  }

  private queueAssets(): void {
    this.load.spritesheet("player-sheet", "character/player-walk.png", {
      frameWidth: 768,
      frameHeight: 448,
    });
    this.load.image("filmset-bg", "background/filmset.png");
    this.load.image("filmset-collision", "background/filmset-collision.png");
    this.load.audio("filmset-ambience", "audio/filmset-walla.wav");

    npcProfiles.forEach((profile) => {
      this.load.image(profile.spriteKey, profile.imagePath);
    });
  }
}
