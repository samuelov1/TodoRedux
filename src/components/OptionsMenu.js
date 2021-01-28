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

  handleMenuItemClick() {
    this.setState({ anchorEl: null });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    const { anchorEl } = this.state;

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
          <MenuItem onClick={this.handleMenuItemClick}>
            <ListItemIcon>
              <CheckCircleOutline/>
            </ListItemIcon>
            <ListItemText>Show completed tasks</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }
}

export default OptionsMenu;
