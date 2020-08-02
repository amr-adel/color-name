import { elm, create } from "./helpers";
import { singleResult } from "./app";

const handleAliases = (colorName) => {
  if (colorName === "cyan") return "cyan, aqua";
  else if (colorName === "magenta") return "magenta, fuchsia";
  else if (colorName.includes("gray")) return `${colorName}(grey)`;

  return colorName;
};

export const render = (
  color: string,
  result: singleResult[],
  darkTextOnSample: boolean
): void => {
  const body = elm("body");

  body.classList.add("result");
  body.style.setProperty("--sample", `#${color}`);
  body.style.setProperty(
    "--text-on-sample",
    darkTextOnSample ? "var(--dark)" : "var(--light)"
  );

  if (!elm("#sample")) {
    const sampleDiv = create("div", {
      id: "sample",
    });

    elm(".top").appendChild(sampleDiv);
  }

  // Create palette boxes
  if (!elm(".palette-box")) {
    for (const palette of result) {
      const prefix = palette.name.toLowerCase().replace(" ", "-");

      const paletteBox = create("div", {
        id: prefix,
        className: "palette-box",
      });

      const paletteName = create("h3", {
        innerText: palette.name,
        className: "palette-name",
      });
      paletteBox.appendChild(paletteName);

      // Create every single result
      palette.colors.forEach((color, i) => {
        const singleResult = create("div", {
          className: "single-result",
        });

        const main = create("div", {
          className: "single-result-main",
          id: `${prefix}-${i}-main`,
          innerText: prefix.includes("css")
            ? handleAliases(color.name)
            : color.name,
          style: `color: var(--${
            color.darkText ? "dark" : "light"
          }); background-color: ${color.hexValue}`,
        });
        singleResult.appendChild(main);

        const hex = create("div", {
          className: "single-result-hex",
          id: `${prefix}-${i}-hex`,
          innerText: color.hexValue.replace("#", ""),
        });
        singleResult.appendChild(hex);

        const percentage = create("div", {
          className: "single-result-percentage",
          id: `${prefix}-${i}-percentage`,
          innerText: color.matchingPercentage,
        });
        singleResult.appendChild(percentage);

        paletteBox.appendChild(singleResult);
      });

      elm("#results").appendChild(paletteBox);
    }
  } else {
    // Modifay values only
    for (const palette of result) {
      const prefix = palette.name.toLowerCase().replace(" ", "-");

      palette.colors.forEach((color, i) => {
        const main = elm(`#${prefix}-${i}-main`);

        main.innerText = prefix.includes("css")
          ? handleAliases(color.name)
          : color.name;

        main.style.color = `var(--${color.darkText ? "dark" : "light"})`;
        main.style.backgroundColor = color.hexValue;

        const hex = elm(`#${prefix}-${i}-hex`);
        hex.innerText = color.hexValue.replace("#", "");

        const percentage = elm(`#${prefix}-${i}-percentage`);
        percentage.innerText = String(color.matchingPercentage);
      });
    }
  }
};
