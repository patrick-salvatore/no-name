export function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);

  return element;
}

export function setupInput(element: HTMLInputElement) {
  const setInput = (name) => {
    document.querySelector("#name")!.innerHTML = `My name is ${name}`;
  };

  element.addEventListener("keyup", (e) => {
    setInput((e.target as HTMLInputElement).value);
  });

  setInput("");

  return element;
}

document.querySelector("#app")!.innerHTML = `
  <div>
    <h1>Hello World!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <div class="card">
      <h1 id='name'></h1>
      <input id='name-input' />
    </div>
  </div>
`;

setupCounter(document.querySelector("#counter"));
setupInput(document.querySelector("#name-input")!);
