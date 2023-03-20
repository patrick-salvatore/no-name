import { render, For, signal, memo } from '@lnl/framework';

const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

const randomIdxs = (array) => {
  const idxs = new Set([]);

  while (idxs.size !==  Math.floor(array.length / 2)) {
    idxs.add(Math.floor(Math.random() * array.length))
  }
  return Array.from(idxs.values())
}

const ItemList = () => {
  const initialState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [items, setItems] = signal(initialState)
  const [color, setColor] = signal(randomColor())
  const selected = memo(() => randomIdxs(items()));
  let indexes = []

  const swapItems = (idxs) => {
    const newItems = [...items()];

    let prev = indexes
    indexes = idxs

    if (prev.length) {
      indexes.forEach((_, i) => {
        let temp =  newItems[prev[i]]
        newItems[prev[i]] = newItems[indexes[i]];
        newItems[indexes[i]] = temp;
      })
    }

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

    setItems((indexes = Array.from({ length: amount }, (_, i) => i + 1)));
  };

  setInterval(() => {
    const idxs = randomIdxs(items())
    swapItems(idxs)
    setColor(randomColor())
  }, 300)

  return (
    <>
      <h1 class="title">Item List</h1>
      <div class="container">
        <div class="item-container">
          <For each={items}>
            {(item, i) => (
              <div key={item} class="item" style={{ 'background-color': selected().includes(i()) ? color() : null }}>
                Item {i() + 1}
              </div>
            )}
          </For>
        </div>
        <div class="button-container">
          <button class="button" onClick={() => swapItems(randomIdxs(items()))}>
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
