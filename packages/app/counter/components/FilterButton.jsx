import { useStore } from '../store'


const FilterButton = ({ children, filter }) => {
  const { visibilityFilter } = useStore();

  const setVisibilityFilter = () => { }


  return (
    <a
      class={{ selected: filter === visibilityFilter }}
      style={{ cursor: "pointer" }}
      onClick={() => setVisibilityFilter(filter)}
    >
      {children}
    </a>
  );
};


export default FilterButton;
