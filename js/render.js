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

  console.log(`Render: #${color}`, result);
};

export default render;
