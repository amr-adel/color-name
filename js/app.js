import antPalette from "./antPalette.js";
import cssPalette from "./cssPalette.js";
import materializePalette from "./materializePalette.js";
import tailwindPalette from "./tailwindPalette.js";
import { elm, create } from "./helpers.js";

const palettes = [
  {
    name: "Ant Design",
    palette: antPalette,
  },
  {
    name: "Native CSS",
    palette: cssPalette,
  },
  {
    name: "Materialize",
    palette: materializePalette,
  },
  {
    name: "Tailwind",
    palette: tailwindPalette,
  },
];

// Convert from hexadecimal to RGB format (color is a hexadecimal color)
const hexToRGB = (color) =>
  color
    .replace("#", "")
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));

// Generate random hex color
const getRandomHexColor = () => {
  let colorCode = "#";

  while (colorCode.length < 7) {
    const newHex = Math.floor(Math.random() * 16).toString(16);
    colorCode += newHex;
  }

  return colorCode;
};

// Calculate distance between 2 colors (color1 & color2 are RGB arrays)
const getDistance = (color1, color2) => {
  return (
    // https://en.wikipedia.org/wiki/Color_difference
    Math.pow(Math.abs(color1[0] - color2[0]), 2) +
    Math.pow(Math.abs(color1[1] - color2[1]), 2) +
    Math.pow(Math.abs(color1[2] - color2[2]), 2)
  );
};

// Get nearest color (sample is a hexdecimal color, palette is an object of {colorName: hexValue})
const getNearest = (sample, palette) => {
  const sampleClean = sample.replace("#", "").toLowerCase();
  const sampleRGB = hexToRGB(sampleClean);

  let candidates = [];

  for (let color in palette) {
    const colorClean = palette[color].replace("#", "").toLowerCase();
    const colorRGB = hexToRGB(colorClean);

    if (sampleClean === colorClean)
      return [
        {
          name: color,
          hexValue: `#${colorClean}`,
          distance: 0,
          matchingPercentage: 100,
        },
      ];
    else {
      candidates.push({
        name: color,
        hexValue: `#${colorClean}`,
        distance: getDistance(sampleRGB, colorRGB),
      });
    }
  }

  const topCandidates = candidates
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((candidate) => {
      return {
        ...candidate,
        // 195075 is the distance between white (255, 255, 255) and balck (0, 0, 0)
        matchingPercentage: 100 - ((candidate.distance * 100) / 195075).toFixed(3),
      };
    });

  return topCandidates;
};

const toTest = getRandomHexColor();

console.time();

for (let palette of palettes) {
  console.log(palette.name, getNearest(toTest, palette.palette));
}

console.timeEnd();
