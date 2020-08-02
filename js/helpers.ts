// Create element
export const elm = (selector: string): HTMLElement =>
  document.querySelector(selector);

// Get DOM element
export const create = (
  tag: string,
  props: Record<string, string | number>
): HTMLElement => {
  const element = document.createElement(tag);

  if (props) {
    for (const prop in props) {
      element[prop] = props[prop];
    }
  }

  return element;
};

// Scroll to top
export const scrollToTop = (elmSelector?: string, behavior?: string): void => {
  const element = elmSelector ? elm(elmSelector) : window;

  element.scrollTo({
    top: 0,
    left: 0,
    behavior: behavior === "smooth" || element === window ? "smooth" : "auto",
  });
};
