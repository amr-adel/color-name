// Create element
export const elm = (selector) => document.querySelector(selector);

// Get DOM element
export const create = (tag, props) => {
  const element = document.createElement(tag);

  if (props) {
    for (let prop in props) {
      element[prop] = props[prop];
    }
  }

  return element;
};

// Scroll to top
export const scrollToTop = (element, behavior) => {
  element = element ? elm(element) : window;

  element.scrollTo({
    top: 0,
    left: 0,
    behavior: behavior === "smooth" || element === window ? "smooth" : "auto",
  });
};
