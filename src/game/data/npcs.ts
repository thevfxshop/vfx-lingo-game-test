export interface NpcProfile {
  id: string;
  name: string;
  role: string;
  text: string;
  x: number;
  y: number;
  imagePath: string;
  spriteKey: string;
  color: number;
}

export const npcProfiles: NpcProfile[] = [
  {
    id: "director",
    name: "Director",
    role: "Creative lead",
    text: "I shape the story on set and keep every department aligned with the vision.",
    x: 620,
    y: 250,
    imagePath: "npcs/director.png",
    spriteKey: "npc-director",
    color: 0xffb703,
  },
  {
    id: "camera",
    name: "DOP",
    role: "Camera department",
    text: "I frame the shots and move the camera. Ask my 1st AC for details about the lenses.",
    x: 760,
    y: 520,
    imagePath: "npcs/camera.png",
    spriteKey: "npc-camera",
    color: 0x4cc9f0,
  },
  {
    id: "producer",
    name: "Producer",
    role: "Production",
    text: "Talk to me about budget and scheduling.",
    x: 1000,
    y: 380,
    imagePath: "npcs/producer.png",
    spriteKey: "npc-producer",
    color: 0x90be6d,
  },
  {
    id: "gaffer",
    name: "Gaffer",
    role: "Light department",
    text: "I take care of the light. Ask me for a greenscreen.",
    x: 370,
    y: 620,
    imagePath: "npcs/gaffer.png",
    spriteKey: "npc-gaffer",
    color: 0x9b5de5,
  },
  {
    id: "vfx",
    name: "VFX equipment",
    role: "Visual Effects",
    text: "My VFX equipment. Keep it in close distance to the set.",
    x: 370,
    y: 320,
    imagePath: "npcs/vfx-set.png",
    spriteKey: "npc-vfx",
    color: 0x9b5de5,
  },
];
