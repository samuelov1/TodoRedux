import React from "react";
import { makeStyles, Box, Chip, Button } from "@material-ui/core";
import { Sort, ArrowUpward, ArrowDownward } from "@material-ui/icons";
import { useFilterDispatch, useFilterState } from "./providers/FilterProvider";

const useStyle = makeStyles({
  root: {
    flexDirection: "row-reverse",
    borderBottom: "1px solid rgba(50, 50, 50, 0.1)",
    padding: "10px",
    "& > *": {
      marginLeft: "5px"
    }
  },
  chip: {
    borderRadius: "4px",
    minWidth: 0,
    padding: "2px 5px"
  }
});

const ListSortingPanel = () => {
  const classes = useStyle();
  const dispatch = useFilterDispatch();
  const { selectedSortingOption, isReversed } = useFilterState();

  if (!selectedSortingOption) return null;

  const label = `Sorted by ${selectedSortingOption.name}`;

  return (
    <Box className={classes.root} display="flex">
      <Chip
        className={classes.chip}
        icon={<Sort />}
        label={label}
        onDelete={() =>
          dispatch({ type: "SET_SELECTED_SORTING_OPTION", payload: null })
        }
      />
      <Button
        onClick={() =>
          dispatch({ type: "TOGGLE_SORT_REVERSED", payload: null })
        }
        className={classes.chip}
        size="small"
        color="default"
        variant="contained"
        disableElevation
      >
        {isReversed ? <ArrowUpward /> : <ArrowDownward />}
      </Button>
    </Box>
  );
};

export default ListSortingPanel;
