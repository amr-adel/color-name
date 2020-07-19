import { elm, create } from "./helpers.js";

const handleMenu = (toState) => {
  console.log(toState);
  elm("#menu-toggle").dataset.state = toState;
  elm("#menu-body").dataset.state = toState;

  elm("body").style.overflow = toState === "visible" ? "hidden" : "auto";
};

export default handleMenu;
