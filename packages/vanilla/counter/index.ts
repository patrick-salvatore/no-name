export function setupCounter(element) {
  let counter = 0;
  let interval = 1000;
  let timerId;

  const createInterval = () => {
    return setInterval(() => {
      setCounter((counter += 1));
    }, interval);
  };

  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };

  element.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else timerId = createInterval();
  });

  setCounter(0);
  timerId = createInterval();
}

setupCounter(document.querySelector("#counter"));
