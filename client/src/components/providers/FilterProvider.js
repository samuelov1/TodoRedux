import { createContext, useReducer, useContext } from "react";

const FilterStateContext = createContext();
const FilterDispatchContext = createContext();

const filterReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SHOW_COMPLETED": {
      return {
        ...state,
        showCompleted: !state.showCompleted
      };
    }
    case "SET_SELECTED_SORTING_OPTION": {
      const selectedSortingOption = state.sortingOptions.find(
        (option) => option.id === action.payload
      );
      return {
        ...state,
        selectedSortingOption,
        isReversed: false
      };
    }
    case "TOGGLE_SORT_REVERSED": {
      return {
        ...state,
        isReversed: !state.isReversed
      };
    }
    default:
      return state;
  }
};

const initialFilterState = {
  showCompleted: true,
  sortingOptions: [
    {
      id: 1,
      name: "name",
      sortFunction: (a, b) => a.content.localeCompare(b.content)
    }
  ],
  selectedSortingOption: null,
  isReversed: false
};

const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  return (
    <FilterStateContext.Provider value={state}>
      <FilterDispatchContext.Provider value={dispatch}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterStateContext.Provider>
  );
};

export const useFilterState = () => {
  const context = useContext(FilterStateContext);
  if (context === undefined) {
    throw new Error("useFilterState must be used within a FilterStateProvider");
  }
  return context;
};

export const useFilterDispatch = () => {
  const context = useContext(FilterDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useFilterDispatch must be used within a FilterDispatchProvider"
    );
  }
  return context;
};

export default FilterProvider;
