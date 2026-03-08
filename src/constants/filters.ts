export interface FilterDefinition {
  id: string;
  name: string;
  emoji: string;
  iconName: string;
  iconColor: string;
  // 4x5 ColorMatrix: [R_r, R_g, R_b, R_a, R_bias, G_r, G_g, G_b, G_a, G_bias, B_r, B_g, B_b, B_a, B_bias, A_r, A_g, A_b, A_a, A_bias]
  matrix: number[];
  // Description shown in the UI
  description: string;
  // Accent color for the filter chip border
  accent: string;
}

export const FILTERS: FilterDefinition[] = [
  // ── Original / No Filter ──
  {
    id: "normal",
    name: "Original",
    emoji: "✨",
    iconName: "aperture",
    iconColor: "#B58F72",
    description: "No filter",
    accent: "#8B5E3C",
    matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  },

  // ── Noir — Deep B&W with crushed blacks ──
  {
    id: "noir",
    name: "Noir",
    emoji: "🖤",
    iconName: "contrast",
    iconColor: "#808080",
    description: "Crushed B&W",
    accent: "#3A3A3A",
    matrix: [
      0.33, 0.59, 0.11, 0, -0.12, 0.33, 0.59, 0.11, 0, -0.12, 0.33, 0.59, 0.11,
      0, -0.12, 0, 0, 0, 1, 0,
    ],
  },

  // ── Japan — Muted teal shadows, lifted warm highlights ──
  {
    id: "japan",
    name: "Japan",
    emoji: "🎌",
    iconName: "image",
    iconColor: "#7AA28E",
    description: "Muted Teal & Blush",
    accent: "#4A6B5A",
    matrix: [
      0.92, 0.06, -0.04, 0, 0.03, -0.04, 0.88, 0.1, 0, 0.02, -0.06, 0.08, 0.82,
      0, 0.08, 0, 0, 0, 1, 0,
    ],
  },

  // ── Dark Orange — Burnt amber, deep warm push ──
  {
    id: "dark-orange",
    name: "Dark Orange",
    emoji: "🔥",
    iconName: "flame",
    iconColor: "#D2691E",
    description: "Burnt Amber",
    accent: "#A0522D",
    matrix: [
      1.15, 0.12, -0.08, 0, 0.04, 0.02, 0.85, -0.04, 0, -0.02, -0.12, -0.08,
      0.68, 0, -0.06, 0, 0, 0, 1, 0,
    ],
  },

  // ── Sepia Dust — Aged, dusty warm tone ──
  {
    id: "sepia-dust",
    name: "Sepia Dust",
    emoji: "⏳",
    iconName: "hourglass",
    iconColor: "#A68966",
    description: "Aged & Dusty",
    accent: "#7A6543",
    matrix: [
      0.44, 0.72, 0.16, 0, 0.04, 0.35, 0.65, 0.14, 0, 0.01, 0.24, 0.46, 0.12, 0,
      -0.04, 0, 0, 0, 1, 0,
    ],
  },

  // ── Faded Film — Washed-out analog with lifted blacks ──
  {
    id: "faded-film",
    name: "Faded Film",
    emoji: "🎞️",
    iconName: "film",
    iconColor: "#8E7F75",
    description: "Washed Analog",
    accent: "#6B5B4F",
    matrix: [
      0.82, 0.08, 0.02, 0, 0.1, 0.04, 0.78, 0.06, 0, 0.1, 0.02, 0.04, 0.72, 0,
      0.12, 0, 0, 0, 1, 0,
    ],
  },

  // ── Tobacco — Dark, rich brown tone with contrasty shadows ──
  {
    id: "tobacco",
    name: "Tobacco",
    emoji: "🍂",
    iconName: "color-filter",
    iconColor: "#8B4513",
    description: "Rich & Dark Brown",
    accent: "#5C3A1E",
    matrix: [
      0.98, 0.14, -0.06, 0, -0.04, 0.04, 0.82, 0.0, 0, -0.06, -0.08, -0.04,
      0.62, 0, -0.08, 0, 0, 0, 1, 0,
    ],
  },

  // ── Kyoto — Soft pink-peach with desaturated greens ──
  {
    id: "kyoto",
    name: "Kyoto",
    emoji: "🌸",
    iconName: "leaf",
    iconColor: "#C19A9A",
    description: "Soft Sakura Tone",
    accent: "#8B6B6B",
    matrix: [
      0.94, 0.1, 0.02, 0, 0.05, 0.04, 0.82, 0.04, 0, 0.02, 0.06, 0.02, 0.8, 0,
      0.04, 0, 0, 0, 1, 0,
    ],
  },

  // ── Midnight — Deep blue-black shadows, cool desaturation ──
  {
    id: "midnight",
    name: "Midnight",
    emoji: "🌙",
    iconName: "moon",
    iconColor: "#46607A",
    description: "Cool & Dark",
    accent: "#2C3E50",
    matrix: [
      0.78, 0.04, 0.06, 0, -0.06, 0.02, 0.8, 0.08, 0, -0.04, 0.04, 0.1, 0.92, 0,
      0.02, 0, 0, 0, 1, 0,
    ],
  },

  // ── Rust — Heavy warm desaturation, burnt film edges ──
  {
    id: "rust",
    name: "Rust",
    emoji: "🔨",
    iconName: "hammer",
    iconColor: "#B85C26",
    description: "Corroded Warm",
    accent: "#8B4513",
    matrix: [
      1.05, 0.18, -0.1, 0, -0.02, 0.06, 0.76, -0.02, 0, -0.04, -0.1, -0.06,
      0.58, 0, -0.08, 0, 0, 0, 1, 0,
    ],
  },
];
