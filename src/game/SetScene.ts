import Phaser from "phaser";
import DialogBox from "./DialogBox";
import { npcProfiles, type NpcProfile } from "./data/npcs";

const WORLD_WIDTH = 1500;
const WORLD_HEIGHT = 1000;
const PLAYER_SPEED = 150;
const DEBUG_COLLISION = false;

export default class SetScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private npcGroup!: Phaser.Physics.Arcade.StaticGroup;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private dialog!: DialogBox;
  private promptButton!: Phaser.GameObjects.Container;
  private promptLabel!: Phaser.GameObjects.Text;
  private controlsHint!: Phaser.GameObjects.Text;
  private nearbyProfile: NpcProfile | null = null;
  private touchActive = false;

  constructor() {
    super("set-scene");
  }

  create(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,E,SPACE") as {
      [key: string]: Phaser.Input.Keyboard.Key;
    };

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    const floor = this.add.image(
      WORLD_WIDTH / 2,
      WORLD_HEIGHT / 2,
      "filmset-bg",
    );
    floor.setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);
    floor.setDepth(0);

    if (DEBUG_COLLISION) {
      const collisionOverlay = this.add.image(
        WORLD_WIDTH / 2,
        WORLD_HEIGHT / 2,
        "filmset-collision",
      );
      collisionOverlay.setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);
      collisionOverlay.setAlpha(0.35);
      collisionOverlay.setDepth(1);
    }

    this.obstacles = this.physics.add.staticGroup();
    this.createTexture("collision-pixel", 2, 2, 0xffffff);
    this.buildCollisionFromImage("filmset-collision", 32);

    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player-sheet", {
        start: 0,
        end: 28,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.player = this.physics.add.sprite(320, 450, "player-sheet", 0);
    this.player.setScale(0.4);
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setSize(
      this.player.width * this.player.scaleX,
      this.player.height * this.player.scaleY,
      true,
    );
    this.player.setFrame(0);
    this.player.setDepth(5);
    this.player.setCollideWorldBounds(true);

    const ambience = this.sound.add("filmset-ambience", {
      loop: true,
      volume: 0.35,
    });
    ambience.play();

    this.npcGroup = this.physics.add.staticGroup();
    npcProfiles.forEach((profile) => {
      const npc = this.npcGroup.create(
        profile.x,
        profile.y,
        profile.spriteKey,
      ) as Phaser.GameObjects.Image & {
        profile: NpcProfile;
      };
      npc.profile = profile;
      npc.setDepth(3);

      this.add
        .text(profile.x, profile.y + 22, profile.name, {
          fontSize: "12px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setDepth(6);
    });

    this.physics.add.collider(this.player, this.obstacles);

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.dialog = new DialogBox(this);

    const promptBg = this.add
      .rectangle(0, 0, 220, 44, 0x111827, 0.95)
      .setStrokeStyle(2, 0x22c55e, 0.9)
      .setOrigin(0.5);

    this.promptLabel = this.add.text(0, 0, "TALK", {
      fontSize: "16px",
      color: "#ffffff",
      fontStyle: "600",
    });
    this.promptLabel.setOrigin(0.5);

    this.promptButton = this.add.container(0, 0, [promptBg, this.promptLabel]);
    this.promptButton.setScrollFactor(0);
    this.promptButton.setDepth(9);
    this.promptButton.setVisible(false);

    this.controlsHint = this.add
      .text(0, 0, "Use Arrow Keys to move • Press Space to talk", {
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "rgba(15, 18, 32, 0.9)",
      })
      .setPadding(10, 8)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(9);

    this.tweens.add({
      targets: this.controlsHint,
      alpha: 0,
      ease: "Sine.easeInOut",
      duration: 2000,
      delay: 2600,
      onComplete: () => this.controlsHint.setVisible(false),
    });

    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      this.dialog.reposition(gameSize.width, gameSize.height);
      this.positionPrompt(gameSize.width, gameSize.height);
    });

    this.positionPrompt(this.scale.width, this.scale.height);
    this.controlsHint.setPosition(this.scale.width / 2, this.scale.height / 2);

    this.input.on("pointerdown", () => {
      this.touchActive = true;
    });

    this.input.on("pointerup", () => {
      this.touchActive = false;
    });
  }

  update(): void {
    this.nearbyProfile = null;
    this.physics.overlap(this.player, this.npcGroup, (_, npc) => {
      this.nearbyProfile = (npc as { profile?: NpcProfile }).profile ?? null;
    });

    const talkPressed =
      Phaser.Input.Keyboard.JustDown(this.keys.E) ||
      Phaser.Input.Keyboard.JustDown(this.keys.SPACE);

    if (this.dialog.visible) {
      this.player.setVelocity(0);
      if (talkPressed) {
        this.dialog.hide();
      }
      return;
    }

    if (this.nearbyProfile) {
      this.promptButton.setVisible(true);
      if (talkPressed) {
        this.dialog.show(this.nearbyProfile);
      }
    } else {
      this.promptButton.setVisible(false);
    }

    let vx = this.getAxis(
      this.keys.A,
      this.keys.D,
      this.cursors.left,
      this.cursors.right,
    );
    let vy = this.getAxis(
      this.keys.W,
      this.keys.S,
      this.cursors.up,
      this.cursors.down,
    );

    if (this.touchActive) {
      const pointer = this.input.activePointer;
      const worldPoint = pointer.positionToCamera(
        this.cameras.main,
      ) as Phaser.Math.Vector2;
      const dx = worldPoint.x - this.player.x;
      const dy = worldPoint.y - this.player.y;
      const distanceSq = dx * dx + dy * dy;
      if (distanceSq > 25) {
        const len = Math.sqrt(distanceSq);
        vx = dx / len;
        vy = dy / len;
      } else {
        vx = 0;
        vy = 0;
      }
    }

    const velocity = new Phaser.Math.Vector2(vx, vy)
      .normalize()
      .scale(PLAYER_SPEED);
    this.player.setVelocity(velocity.x, velocity.y);

    if (velocity.lengthSq() > 0.1) {
      this.player.setFlipX(velocity.x < 0);
      this.player.play("player-walk", true);
    } else {
      this.player.anims.stop();
      this.player.setFrame(0);
    }
  }

  private getAxis(
    negativeKey: Phaser.Input.Keyboard.Key,
    positiveKey: Phaser.Input.Keyboard.Key,
    negativeCursor: Phaser.Input.Keyboard.Key,
    positiveCursor: Phaser.Input.Keyboard.Key,
  ): number {
    const neg = negativeKey.isDown || negativeCursor.isDown;
    const pos = positiveKey.isDown || positiveCursor.isDown;

    if (neg && !pos) return -1;
    if (pos && !neg) return 1;
    return 0;
  }

  private createTexture(
    key: string,
    width: number,
    height: number,
    color: number,
  ): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(0, 0, width, height, 6);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }

  private buildCollisionFromImage(key: string, cellSize: number): void {
    if (!this.textures.exists(key)) {
      return;
    }

    const texture = this.textures.get(key);
    const source = texture.getSourceImage() as HTMLImageElement | undefined;
    if (!source) {
      return;
    }

    const canvasTexture = this.textures.createCanvas(
      `${key}-canvas`,
      source.width,
      source.height,
    );
    if (!canvasTexture) {
      return;
    }
    const canvas = canvasTexture.getSourceImage() as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const scaleX = WORLD_WIDTH / canvas.width;
    const scaleY = WORLD_HEIGHT / canvas.height;
    const sampleStep = 4;

    for (let y = 0; y < canvas.height; y += cellSize) {
      for (let x = 0; x < canvas.width; x += cellSize) {
        let solid = false;

        for (
          let yy = y;
          yy < Math.min(y + cellSize, canvas.height);
          yy += sampleStep
        ) {
          for (
            let xx = x;
            xx < Math.min(x + cellSize, canvas.width);
            xx += sampleStep
          ) {
            const idx = (yy * canvas.width + xx) * 4;
            const alpha = imageData[idx + 3];
            if (alpha > 20) {
              solid = true;
              break;
            }
          }
          if (solid) break;
        }

        if (solid) {
          const worldX = (x + cellSize / 2) * scaleX;
          const worldY = (y + cellSize / 2) * scaleY;
          const worldW = cellSize * scaleX;
          const worldH = cellSize * scaleY;

          const obstacle = this.obstacles.create(
            worldX,
            worldY,
            "collision-pixel",
          ) as Phaser.Physics.Arcade.Image;
          obstacle.setDisplaySize(worldW, worldH);
          obstacle.setVisible(DEBUG_COLLISION);
          if (DEBUG_COLLISION) {
            obstacle.setAlpha(0.4);
          }
        }
      }
    }

    canvasTexture.destroy();
  }

  private positionPrompt(width: number, height: number): void {
    this.promptButton.setPosition(width / 2, height - 70);
  }
}
