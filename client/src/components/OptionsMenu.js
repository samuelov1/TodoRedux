import React, { Component } from "react";
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
import { connect } from "react-redux";

import {
  toggleShowCompleted,
  setSelectedSortingOption
} from "../redux/actions/filters";

import {
  getShowCompletedTasks,
  getSortingOptions,
  getSelectedSortingOption
} from "../redux/selectors/filters";

class OptionsMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(e) {
    const button = e.target;
    this.setState({ anchorEl: button });
  }

  handleMenuItemClick(actionName, arg) {
    const action = this.props[actionName];
    action(arg);
    this.setState({ anchorEl: null });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    const { anchorEl } = this.state;
    const {
      showCompletedTasks,
      sortingOptions,
      selectedSortingOption
    } = this.props;

    const sortingOptionsMenuItems = sortingOptions.map(option => {
      const isSelected =
        selectedSortingOption && option.id === selectedSortingOption.id;

      return (
        <MenuItem
          key={option.id}
          onClick={() =>
            this.handleMenuItemClick("setSelectedSortingOption", option.id)
          }
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
        <IconButton onClick={this.handleClick} aria-controls="options-menu">
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
          onClose={this.handleClose}
        >
          {sortingOptionsMenuItems}
          <Divider />
          <MenuItem
            onClick={() => this.handleMenuItemClick("toggleShowCompleted")}
            dense
          >
            <ListItemIcon>
              <CheckCircleOutline />
            </ListItemIcon>
            <ListItemText>
              {showCompletedTasks ? "Hide" : "Show"} completed tasks
            </ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }
}

const mapStateToProps = state => {
  const showCompletedTasks = getShowCompletedTasks(state);
  const sortingOptions = getSortingOptions(state);
  const selectedSortingOption = getSelectedSortingOption(state);
  return { showCompletedTasks, sortingOptions, selectedSortingOption };
};

export default connect(
  mapStateToProps,
  { toggleShowCompleted, setSelectedSortingOption }
)(OptionsMenu);
