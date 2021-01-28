import React, { Component } from "react";
import {
  IconButton,
  Icon,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { MoreHoriz, CheckCircleOutline } from "@material-ui/icons";
import { connect } from "react-redux";

import { toggleShowCompleted } from "../redux/actions";
import { getShowCompletedTasks } from "../redux/selectors";

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

  handleMenuItemClick(actionName) {
    const action = this.props[actionName];
    action();
    this.setState({ anchorEl: null });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    const { anchorEl } = this.state;
    const { showCompletedTasks } = this.props;

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
          <MenuItem
            onClick={() => this.handleMenuItemClick("toggleShowCompleted")}
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
  return { showCompletedTasks };
};

export default connect(
  mapStateToProps,
  { toggleShowCompleted }
)(OptionsMenu);
