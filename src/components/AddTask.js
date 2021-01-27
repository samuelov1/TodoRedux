import React, { Component } from "react";
import { Icon, Box, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";

import TaskForm from "./TaskForm";
import { addTask } from "../redux/actions";

const styles = {
  root: {
    padding: "3px 0px",
    display: "flex"
  },
  addIcon: {
    margin: "0px 23px 0 9px"
  },
  placeholder: {
    lineHeight: "25px"
  }
};

class AddTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEnabled: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.closeForm = this.closeForm.bind(this);
  }

  handleClick() {
    this.setState({ isEnabled: true });
  }

  closeForm(e) {
    e.stopPropagation();
    this.setState({ isEnabled: false });
  }

  render() {
    const { classes, addTask } = this.props;
    const { isEnabled } = this.state;

    const placeholder = (
      <Typography className={classes.placeholder} color="textSecondary">
        Add Task...
      </Typography>
    );

    return (
      <Box display="flex" className={classes.root} onClick={this.handleClick}>
        <Icon color="secondary" className={classes.addIcon}>
          <Add />
        </Icon>
        {isEnabled ? (
          <TaskForm onSubmit={addTask} onCancel={this.closeForm} />
        ) : (
          placeholder
        )}
      </Box>
    );
  }
}

export default withStyles(styles)(
  connect(
    null,
    { addTask }
  )(AddTask)
);
