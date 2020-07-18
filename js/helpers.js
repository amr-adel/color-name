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
