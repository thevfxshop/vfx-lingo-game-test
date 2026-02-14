import "./style.css";
import Phaser from "phaser";
import LoaderScene from "./game/LoaderScene";
import SetScene from "./game/SetScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 960,
  height: 540,
  backgroundColor: "#0f1220",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [LoaderScene, SetScene],
};

document.querySelector<HTMLDivElement>("#app")!.innerHTML = "";
new Phaser.Game(config);
