import { elm, scrollToTop } from "./helpers";

const handleMenu = (currentState) => {
  const toState = currentState === "hidden" ? "visible" : "hidden";
  elm("body").dataset.menuState = toState;

  // Scroll history to top
  if (toState === "hidden") {
    setTimeout(() => {
      scrollToTop("#menu-body .container");
      scrollToTop("#history-list");
    }, 300);
  }
};

export default handleMenu;
