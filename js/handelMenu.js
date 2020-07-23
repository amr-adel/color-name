import { elm } from "./helpers.js";

const handleMenu = (currentState) => {
  const toState = currentState === "hidden" ? "visible" : "hidden";
  elm("body").dataset.menuState = toState;

  // Scroll history to top
  if (toState === "hidden") {
    setTimeout(() => {
      elm("#history-list").scrollTo(0, 0);
      elm("#menu-body .container").scrollTo(0, 0);
    }, 300);
  }
};

export default handleMenu;
