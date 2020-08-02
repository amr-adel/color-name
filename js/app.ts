import { antPalette } from "./antPalette";
import { cssPalette } from "./cssPalette";
import { materializePalette } from "./materializePalette";
import { tailwindPalette } from "./tailwindPalette";
import { elm, scrollToTop } from "./helpers";
import { render } from "./render";
import { handleMenu } from "./handelMenu";
import { handleHistory } from "./handleHistory";

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
  const lum1 = getRelativeLuminanace(color1);
  const lum2 = getRelativeLuminanace(color2);

  if (lum1 === lum2) return 0;
  else {
    const lightest = lum1 > lum2 ? lum1 : lum2;
    const darkest = lum1 < lum2 ? lum1 : lum2;

    const contrast = (lightest + 0.05) / (darkest + 0.05);
    return contrast;
  }
};

// Calculate Euclidean distance between 2 colors (color1 & color2 are RGB arrays)
const getDistance = (color1: number[], color2: number[]) => {
  return (
    // https://en.wikipedia.org/wiki/Color_difference
    Math.pow(Math.abs(color1[0] - color2[0]), 2) +
    Math.pow(Math.abs(color1[1] - color2[1]), 2) +
    Math.pow(Math.abs(color1[2] - color2[2]), 2)
  );
};

// Get nearest color (sample is a hexdecimal color, palette is an object of {colorName: hexValue})
interface candidate {
  name: string;
  hexValue: string;
  distance: number;
}

interface topCandidate extends candidate {
  darkText: boolean;
  matchingPercentage: number;
}

const getNearest = (
  sample: string,
  palette: Record<string, string>
): topCandidate[] => {
  const sampleRGB = hexToRGB(sample);

  const candidates: candidate[] = [];

  for (const color in palette) {
    const colorClean = palette[color].replace("#", "").toLowerCase();
    const colorRGB = hexToRGB(colorClean);

    candidates.push({
      name: color,
      hexValue: `#${colorClean}`,
      distance: getDistance(sampleRGB, colorRGB),
    });
  }

  const topCandidates: topCandidate[] = candidates
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
          100 - parseFloat(((candidate.distance * 100) / 195075).toFixed(3)),
      };
    });

  return topCandidates;
};

// RUN APP ==========================================================================
export interface singleResult {
  name: string;
  colors: topCandidate[];
}

const run = (sample: string): void => {
  const result: singleResult[] = [];

  for (const palette of palettes) {
    result.push({
      name: palette.name,
      colors: getNearest(sample, palette.palette),
    });
  }

  colorInput.value = sample;
  lastColor = sample;

  const darkTextOnSample =
    getContrast(hexToRGB("484e4a"), hexToRGB(sample)) >
    getContrast(hexToRGB("eff0ea"), hexToRGB(sample));

  render(sample, result, darkTextOnSample);
  handleHistory("add", sample);
};

// EVENT LISTENERS ==========================================================================
let cleanInput;
let lastColor = "";
const colorInput = elm("#color-input") as HTMLInputElement;

// On input focus, clean value and run app when it's a valid hex color
colorInput.addEventListener("focus", (event) => {
  cleanInput = setInterval(() => {
    const validHex = /\b[\da-f]{6}\b/g;
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^\da-fA-F]/g, "").toLowerCase();

    if (input.value !== lastColor && validHex.test(input.value)) {
      input.blur();
      run(input.value);
    }
  }, 50);
});

// Remove input clean on blur
colorInput.addEventListener("blur", () => {
  clearInterval(cleanInput);
});

// Get random hex color and run app
elm("#random").addEventListener("click", () => {
  const color = getRandomHexColor();
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
  scrollToTop();
});

// Rerun a history color
elm("#history-list").addEventListener("click", (e) => {
  const element = e.target as HTMLLIElement;
  if (element.tagName === "BUTTON") {
    run(element.id);
    elm("#menu-toggle").click();
    scrollToTop();
  }
});

// To add history colors to menu
handleHistory();
