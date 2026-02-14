import Phaser from "phaser";
import type { NpcProfile } from "./data/npcs";

export default class DialogBox extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private avatar: Phaser.GameObjects.Image;
  private nameText: Phaser.GameObjects.Text;
  private roleText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private hintText: Phaser.GameObjects.Text;
  private boxWidth: number;
  private boxHeight: number;
  private avatarSize: number;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.boxWidth = Math.min(760, scene.scale.width - 32);
    this.boxHeight = 160;
    this.avatarSize = 20;

    this.bg = scene.add
      .rectangle(0, 0, this.boxWidth, this.boxHeight, 0x0b0f1a, 0.88)
      .setStrokeStyle(2, 0xffffff, 0.2)
      .setOrigin(0.5);

    this.avatar = scene.add.image(
      -this.boxWidth / 2 + 44 + this.avatarSize / 2,
      0,
      "",
    );
    this.avatar.setDisplaySize(this.avatarSize, this.avatarSize);
    this.avatar.setOrigin(0.5);

    this.nameText = scene.add.text(
      -this.boxWidth / 2 + 44 + this.avatarSize + 40,
      -this.boxHeight / 2 + 12,
      "",
      {
        fontSize: "20px",
        color: "#ffffff",
        fontStyle: "600",
      },
    );

    this.roleText = scene.add.text(
      -this.boxWidth / 2 + 44 + this.avatarSize + 40,
      -this.boxHeight / 2 + 38,
      "",
      {
        fontSize: "14px",
        color: "#c7d2fe",
      },
    );

    this.bodyText = scene.add.text(
      -this.boxWidth / 2 + 44 + this.avatarSize + 40,
      -this.boxHeight / 2 + 62,
      "",
      {
        fontSize: "16px",
        color: "#e2e8f0",
        wordWrap: { width: this.boxWidth - 60 - this.avatarSize - 40 },
      },
    );

    this.hintText = scene.add.text(
      this.boxWidth / 2 - 16,
      this.boxHeight / 2 - 18,
      "Space to close",
      {
        fontSize: "12px",
        color: "#94a3b8",
      },
    );
    this.hintText.setOrigin(1, 1);

    this.add([
      this.bg,
      this.avatar,
      this.nameText,
      this.roleText,
      this.bodyText,
      this.hintText,
    ]);
    this.setDepth(10);
    this.setScrollFactor(0);
    this.setVisible(false);

    this.reposition(scene.scale.width, scene.scale.height);

    scene.add.existing(this);
  }

  show(profile: NpcProfile): void {
    this.nameText.setText(profile.name);
    this.roleText.setText(profile.role);
    this.bodyText.setText(profile.text);
    if (this.scene.textures.exists(profile.spriteKey)) {
      this.avatar.setTexture(profile.spriteKey);
      this.avatar.setVisible(true);
    } else {
      this.avatar.setVisible(false);
    }
    this.setVisible(true);
  }

  hide(): void {
    this.setVisible(false);
  }

  reposition(width: number, height: number): void {
    this.boxWidth = Math.min(760, width - 32);

    this.bg.setSize(this.boxWidth, this.boxHeight);
    this.bg.setDisplaySize(this.boxWidth, this.boxHeight);

    this.avatar.setPosition(-this.boxWidth / 2 + 44 + this.avatarSize / 2, 0);

    this.nameText.setPosition(
      -this.boxWidth / 2 + 44 + this.avatarSize + 40,
      -this.boxHeight / 2 + 12,
    );
    this.roleText.setPosition(
      -this.boxWidth / 2 + 44 + this.avatarSize + 40,
      -this.boxHeight / 2 + 38,
    );
    this.bodyText.setPosition(
      -this.boxWidth / 2 + 44 + this.avatarSize + 40,
      -this.boxHeight / 2 + 62,
    );
    this.bodyText.setWordWrapWidth(this.boxWidth - 60 - this.avatarSize - 40);
    this.hintText.setPosition(this.boxWidth / 2 - 16, this.boxHeight / 2 - 18);

    this.setPosition(width / 2, height - this.boxHeight / 2 - 16);
  }
}
