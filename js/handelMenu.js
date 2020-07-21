import { elm, create } from "./helpers.js";

const handleMenu = (currentState) => {
  const toState = currentState === "hidden" ? "visible" : "hidden";
  elm("body").dataset.menuState = toState;
  console.log(toState);
};

export default handleMenu;
