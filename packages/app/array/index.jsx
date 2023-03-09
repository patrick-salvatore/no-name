import { render, signal, For } from '@lnl/framework'

const ItemList = () => {
  const [items, setItems] = signal([
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5"
  ]);

  const shuffleItems = () => {
    const shuffledItems = [...items()].sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
    console.log(items())
  };

  return (
    <div className="item-list-container">
      <h2 className="item-list-heading">Items</h2>
      <ul className="item-list">
        <For each={items}>
          {((item, index) => (
            <li key={index} className="item">
              {item}
            </li>
          ))}
        </For>
      </ul>
      <button className="shuffle-button" onClick={shuffleItems}>
        Shuffle Items
      </button>
    </div>
  );
};

render(<ItemList />, document.getElementById('app'))
