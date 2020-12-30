import { elm, scrollToTop } from "./helpers.js";

const handleMenu = (currentState) => {
  const toState = currentState === "hidden" ? "visible" : "hidden";
  elm("body").dataset.menuState = toState;

  // Scroll history to top
  if (toState === "hidden") {
    setTimeout(() => {
      scrollToTop("#menu-body");
      scrollToTop("#menu-body .container");
    }, 300);
  }
};

export default handleMenu;
