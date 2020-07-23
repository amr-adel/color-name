import antPalette from "./antPalette.js";
import cssPalette from "./cssPalette.js";
import materializePalette from "./materializePalette.js";
import tailwindPalette from "./tailwindPalette.js";
import { elm } from "./helpers.js";
import render from "./render.js";
import handleMenu from "./handelMenu.js";
import handleHistory from "./handleHistory.js";

const palettes = [
  {
    name: "Native CSS",
    palette: cssPalette,
  },
  {
    name: "Ant Design",
    palette: antPalette,
  },
  {
    name: "Tailwind",
    palette: tailwindPalette,
  },
  {
    name: "Materialize",
    palette: materializePalette,
  },
];

// Convert from hexadecimal to RGB format (color is a hexadecimal color)
const hexToRGB = (color) => color.match(/.{2}/g).map((x) => parseInt(x, 16));

// Generate random hex color
const getRandomHexColor = () => {
  let colorCode = "";

  while (colorCode.length < 6) {
    const newHex = Math.floor(Math.random() * 16).toString(16);
    colorCode += newHex;
  }

  return colorCode;
};

// Calculate relative luminance of a color (color is an RGB arrays)
// https://stackoverflow.com/a/9733420
const getRelativeLuminanace = (color) => {
  const rgb = color.map((value) => {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  const [R, G, B] = rgb;

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

// Calculate contast between 2 colors (color1 & color2 are RGB arrays)
const getContrast = (color1, color2) => {
  var lum1 = getRelativeLuminanace(color1);
  var lum2 = getRelativeLuminanace(color2);

  if (lum1 === lum2) return 0;
  else {
    var lightest = lum1 > lum2 ? lum1 : lum2;
    var darkest = lum1 < lum2 ? lum1 : lum2;

    const contrast = (lightest + 0.05) / (darkest + 0.05);
    return contrast;
  }
};

// Calculate Euclidean distance between 2 colors (color1 & color2 are RGB arrays)
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
  const sampleRGB = hexToRGB(sample);

  let candidates = [];

  for (let color in palette) {
    const colorClean = palette[color].replace("#", "").toLowerCase();
    const colorRGB = hexToRGB(colorClean);

    candidates.push({
      name: color,
      hexValue: `#${colorClean}`,
      distance: getDistance(sampleRGB, colorRGB),
    });
  }

  const topCandidates = candidates
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((candidate) => {
      const candidateRGB = hexToRGB(candidate.hexValue.replace("#", ""));
      // For best contrast against hexValue (background color)
      const darkText =
        getContrast(hexToRGB("484e4a"), candidateRGB) >
        getContrast(hexToRGB("eff0ea"), candidateRGB);

      return {
        ...candidate,
        darkText,
        // 195075 is the distance between white (255, 255, 255) and balck (0, 0, 0)
        matchingPercentage:
          100 - ((candidate.distance * 100) / 195075).toFixed(3),
      };
    });

  return topCandidates;
};

// RUN APP ==========================================================================
const run = (sample) => {
  console.clear();
  console.time();

  let result = [];

  for (let palette of palettes) {
    result.push({
      name: palette.name,
      colors: getNearest(sample, palette.palette),
    });
  }

  const darkTextOnSample =
    getContrast(hexToRGB("484e4a"), hexToRGB(sample)) >
    getContrast(hexToRGB("eff0ea"), hexToRGB(sample));

  render(sample, result, darkTextOnSample);
  handleHistory("add", sample);
  console.timeEnd();
};

// EVENT LISTENERS ==========================================================================
let cleanInput;
let lastColor = "";
const colorInput = elm("#color-input");

// On input focus, clean value and run app when it's a valid hex color
colorInput.addEventListener("focus", (event) => {
  cleanInput = setInterval(() => {
    const validHex = /\b[\da-f]{6}\b/g;
    const input = event.target;
    input.value = input.value.replace(/[^\da-fA-F]/g, "").toLowerCase();

    if (input.value !== lastColor && validHex.test(input.value)) {
      lastColor = input.value;
      input.blur();
      run(input.value);
    } else {
      console.log("Cleaned!");
    }
  }, 50);
});

// Remove input clean on blur
colorInput.addEventListener("blur", () => {
  clearInterval(cleanInput);
});

// Get random hex color and run app
elm("#random").addEventListener("click", (e) => {
  const color = getRandomHexColor();
  colorInput.value = color;
  lastColor = color;
  run(color);
  setTimeout(() => {
    elm("#random").blur();
  }, 100);
});

// Toggle menu
elm("#menu-toggle").addEventListener("click", () => {
  const currentState = elm("body").dataset.menuState;
  return handleMenu(currentState);
});

// Scroll to top
const toTop = elm("#to-top");
toTop.addEventListener("click", () => {
  toTop.classList.add("fixed");
  setTimeout(() => {
    toTop.classList.remove("fixed");
  }, 1000);

  return window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

// Rerun a history color
elm("#history-list").addEventListener("click", (e) => {
  elm("#menu-toggle").click();
  if (e.target.tagName === "BUTTON") run(e.target.id);
});

// To add history colors to menu
handleHistory();
