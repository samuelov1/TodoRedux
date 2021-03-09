import React, { useState } from "react";
import {
  IconButton,
  Icon,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import { MoreHoriz, CheckCircleOutline, Sort } from "@material-ui/icons";
import { useFilterDispatch, useFilterState } from "./providers/FilterProvider";

const OptionsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useFilterDispatch();
  const {
    sortingOptions,
    selectedSortingOption,
    showCompleted
  } = useFilterState();

  const sortingOptionsMenuItems = sortingOptions.map((option) => {
    const isSelected =
      selectedSortingOption && option.id === selectedSortingOption.id;

    return (
      <MenuItem
        key={option.id}
        onClick={() => {
          setAnchorEl(null);
          dispatch({ type: "SET_SELECTED_SORTING_OPTION", payload: option.id });
        }}
        dense
        selected={isSelected}
      >
        <ListItemIcon>
          <Sort />
        </ListItemIcon>
        <ListItemText>Sort By {option.name}</ListItemText>
      </MenuItem>
    );
  });

  return (
    <>
      <IconButton
        onClick={({ target }) => setAnchorEl(target)}
        aria-controls="options-menu"
      >
        <Icon>
          <MoreHoriz />
        </Icon>
      </IconButton>
      <Menu
        id="options-menu"
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {sortingOptionsMenuItems}
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            dispatch({ type: "TOGGLE_SHOW_COMPLETED" });
          }}
          dense
        >
          <ListItemIcon>
            <CheckCircleOutline />
          </ListItemIcon>
          <ListItemText>
            {showCompleted ? "Hide" : "Show"} completed tasks
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default OptionsMenu;
