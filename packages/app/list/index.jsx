import { render, For, signal } from '@lnl/framework';


const randomColor = () => {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`
}

const randomIdxs = (length) => {
  const randomIndex1 = Math.floor(Math.random() * length);
  let randomIndex2 = Math.floor(Math.random() * length);

  while (randomIndex2 === randomIndex1) {
    randomIndex2 = Math.floor(Math.random() * length);
  }
  return [randomIndex1, randomIndex2]
}

const ItemList = () => {
  const initialState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [items, setItems] = signal(initialState)
  const [selected, setSelect] = signal(randomIdxs(initialState.length))
  const [color, setColor] = signal(randomColor())

  const swapItems = (randomIndex1, randomIndex2) => {
    const newItems = [...items()];
    const temp = newItems[randomIndex1];
    newItems[randomIndex1] = newItems[randomIndex2];
    newItems[randomIndex2] = temp;
    setItems(newItems);
  };

  const addNewItem = () => {
    const newItems = [...items()];
    newItems.push(newItems.length + 1);
    setItems(newItems);
  };

  const resetItems = () => {
    setItems(initialState);
  };

  const setInitialAmount = (amount) => {
    setItems(Array.from({ length: amount }, (_, i) => i + 1));
  };

  console.log('rendering?')

  setInterval(() => {
    const idxs = randomIdxs(items().length)
    swapItems(idxs)
    setColor(randomColor())
    setSelect(idxs)
  }, 300)

  return (
    <>
      <h1 class="title">Item List</h1>
      <div class="container">
        <div class="item-container">
          <For each={items}>
            {(item, i) => {
              return (
                <div key={item} class="item" style={{ 'background-color': selected().includes(i())  ? color() : null }}>
                  Item {item}
                </div>
              )
            }}
          </For>
        </div>
        <div class="button-container">
          <button class="button" onClick={swapItems}>
            Swap Items
          </button>
          <button class="button" onClick={addNewItem}>
            Add New Item
          </button>
          <button class="button" onClick={resetItems}>
            Reset
          </button>
          <button class="button" onClick={() => setInitialAmount(10)}>
            Set Initial Amount to 10
          </button>
          <button class="button" onClick={() => setInitialAmount(100)}>
            Set Initial Amount to 100
          </button>
          <button class="button" onClick={() => setInitialAmount(1000)}>
            Set Initial Amount to 1000
          </button>
        </div>
      </div>
    </>
  )
};


render(<ItemList />, document.getElementById("app"));
