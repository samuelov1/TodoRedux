import React from "react";
import { connect } from "react-redux";
import { makeStyles, Box, Chip, Button } from "@material-ui/core";
import { Sort, ArrowUpward, ArrowDownward } from "@material-ui/icons";

import { setSelectedSortingOption, toggleSortReversed } from "../redux/actions";
import {
  getSelectedSortingOption,
  getIsSortingReversed
} from "../redux/selectors";

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

const ListSortingPanel = ({
  selectedSortingOption,
  isSortingReversed,
  setSelectedSortingOption,
  toggleSortReversed
}) => {
  const classes = useStyle();

  if (selectedSortingOption === null) return null;

  const handleDelete = () => {
    setSelectedSortingOption(null);
  };

  const label = `Sorted by ${selectedSortingOption.name}`;

  return (
    <Box className={classes.root} display="flex">
      <Chip
        className={classes.chip}
        icon={<Sort />}
        label={label}
        onDelete={handleDelete}
      />
      <Button
        onClick={toggleSortReversed}
        className={classes.chip}
        size="small"
        color="default"
        variant="contained"
        disableElevation
      >
        {isSortingReversed ? <ArrowUpward /> : <ArrowDownward />}
      </Button>
    </Box>
  );
};

const mapStateToProps = state => {
  const selectedSortingOption = getSelectedSortingOption(state);
  const isSortingReversed = getIsSortingReversed(state);
  return {
    selectedSortingOption,
    isSortingReversed
  };
};

export default connect(
  mapStateToProps,
  { setSelectedSortingOption, toggleSortReversed }
)(ListSortingPanel);
