import { render, signal, For, selector } from "@lnl/framework";


const rand = (max) => {
  return Math.round(Math.random() * 1000) % max;
};

const buildData = (() => {
  const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
  const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
  const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
  let uuid = 1;
  return (length) => {
    const data = new Array(length);
    for (let i = 0; i < length; i++) {
      const id = uuid++;
      const adjective = adjectives[rand(adjectives.length)];
      const color = colors[rand(colors.length)];
      const noun = nouns[rand(nouns.length)];
      const label = signal(`${adjective} ${color} ${noun}`);
      const datum = { id, label };
      data[i] = datum;
    };
    return data;
  };
})();

const Model = new class {
  data = signal([]);
  selected = signal(-1);

  runWith = (length) => {
    this.data[1](buildData(length));
  };

  run0 = () => {
    this.runWith(0);
  };

  run100 = () => {
    this.runWith(100);
  };

  run1000 = () => {
    this.runWith(1000);
  };

  run10000 = () => {
    this.runWith(10000);
  };

  add = () => {
    this.data[1](data => [...data, ...buildData(1000)]);
  };

  update = () => {
    const data = this.data[0]();
    for (let i = 0, l = data.length; i < l; i += 10) {
      data[i].label[1](label => label + ' !!!');
    }
  };

  swapRows = () => {
    const data = this.data[0]().slice();
    if (!data.length) return;

    const datum1 = data[1];
    const datumMin2 = data[data.length - 2];
    data[1] = datumMin2;
    data[data.length - 2] = datum1;
    this.data[1](data);
  };

  remove = (id) => {
    this.data[1](data => {
      const idx = data.findIndex(datum => datum.id === id);
      return [...data.slice(0, idx), ...data.slice(idx + 1)];
    });
  };

  select = (id) => {
    this.selected[1](() => id);
  };

};

const Button = ({ id, text, onClick }) => (
  <div class="col-sm-6 smallpad">
    <button id={id} class="btn btn-primary btn-block" type="button" onClick={onClick}>
      {text}
    </button>
  </div>
);

const Row = ({ index, label, className, onSelect, onRemove }) => (
  <tr class={className}>
    <td class="col-md-1">
      {index() + 1}
    </td>
    <td class="col-md-4">
      <a onClick={onSelect}>
        {label[0]()}
      </a>
    </td>
    <td class="col-md-1">
      <a onClick={onRemove}>
        <span class="glyphicon glyphicon-remove" ariaHidden={true} />
      </a>
    </td>
    <td class="col-md-6" />
  </tr>
)

const Rows = ({ data, isSelected }) => (
  <For each={data}>
    {({ id, label }, index) => {
      const selected = isSelected(id);
      const className = { danger: selected };
      const onSelect = () => Model.select(id);
      const onRemove = () => Model.remove(id);
      const props = {index, id, label, className, onSelect, onRemove};
      return Row ( props );
    }}
  </For>
);

const App = () => (
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>No Name</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <Button id="runsmall" text="Create 100 rows" onClick={Model.run100} />
            <Button id="run" text="Create 1,000 rows" onClick={Model.run1000} />
            <Button id="runlots" text="Create 10,000 rows" onClick={Model.run10000} />
            <Button id="add" text="Append 1,000 rows" onClick={Model.add} />
            <Button id="update" text="Update every 10th row" onClick={Model.update} />
            <Button id="clear" text="Clear" onClick={Model.run0} />
            <Button id="swaprows" text="Swap Rows" onClick={Model.swapRows} />
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-data">
      <tbody>
        <Rows data={Model.data[0]} isSelected={selector(Model.selected[0])} />
      </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" ariaHidden={true} />
  </div>
);

render(<App />, document.getElementById('app'));
