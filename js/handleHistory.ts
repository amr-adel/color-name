import { elm, create } from "./helpers";

export const handleHistory = (action?: string, color?: string): void => {
  const history = JSON.parse(localStorage.getItem("history")) || [];

  if (action === "add") {
    const colorIndex = history.indexOf(color);
    if (colorIndex > -1) history.splice(colorIndex, 1);

    if (history.length === 10) {
      history.pop();
    }

    history.unshift(color);
  }

  // Render history
  const menuHistory = elm("#history-list");
  while (menuHistory.firstChild) menuHistory.removeChild(menuHistory.lastChild);

  const historyList = new DocumentFragment();

  history.forEach((color: string): void => {
    const colorLi = create("li", {
      style: `--bg-color: #${color}`,
    });
    const colorButton = create("button", {
      id: color,
      innerText: color,
    });
    colorLi.appendChild(colorButton);
    historyList.appendChild(colorLi);
  });

  menuHistory.appendChild(historyList);

  localStorage.setItem("history", JSON.stringify(history));
};
