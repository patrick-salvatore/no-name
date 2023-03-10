import { store } from "../store";

const FilterButton = ({ children, filter }) => {
  const setVisibilityFilter = () => {};

  return (
    <a
      class={{ selected: filter === store[0].visibilityFilter }}
      style={{ cursor: "pointer" }}
      onClick={() => setVisibilityFilter(filter)}
    >
      {children}
    </a>
  );
};

export default FilterButton;
