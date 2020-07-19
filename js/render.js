import { elm, create } from "./helpers.js";

const render = (color, result) => {
  elm("body").classList = "result";
  elm("body").style.setProperty("--sample", `#${color}`);

  if (!elm("#sample")) {
    const sampleDiv = create("div", {
      id: "sample",
    });

    elm(".top").appendChild(sampleDiv);
  }

  // Create palette boxes
  if (!elm(".palette-box")) {
    for (let palette of result) {
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
          innerText: color.name,
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
    for (let palette of result) {
      const prefix = palette.name.toLowerCase().replace(" ", "-");

      palette.colors.forEach((color, i) => {
        const main = elm(`#${prefix}-${i}-main`);
        main.innerText = color.name;
        main.style = `color: var(--${
          color.darkText ? "dark" : "light"
        }); background-color: ${color.hexValue}`;

        const hex = elm(`#${prefix}-${i}-hex`);
        hex.innerText = color.hexValue.replace("#", "");

        const percentage = elm(`#${prefix}-${i}-percentage`);
        percentage.innerText = color.matchingPercentage;
      });
    }
  }

  console.log(`Render: #${color}`, result);
};

export default render;
