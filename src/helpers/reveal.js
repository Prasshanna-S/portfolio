export function reveal() {
  const startHiddenAttributeName = "start-hidden";
  const elements = document.querySelectorAll(`[${startHiddenAttributeName}]`);

  elements.forEach((element) => {
    element.removeAttribute(startHiddenAttributeName);
  });
}
