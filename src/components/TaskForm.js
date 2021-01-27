import React, { Component } from "react";
import { Box, TextField, Button, withStyles } from "@material-ui/core";

const styles = {
  form: {
    flex: 1
  },
  textField: {
    width: "100%"
  },
  formBottomSection: {
    marginTop: "10px"
  }
};

class TaskForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempTask: {
        content: ""
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.tempTask);
    this.setState({ tempTask: { content: "" } });
  }

  handleChange(e) {
    const updatedTask = {
      ...this.statetempTask,
      [e.target.id]: e.target.value
    };
    this.setState({ tempTask: updatedTask });
  }

  render() {
    const { classes, onCancel } = this.props;
    const { content } = this.state.tempTask;

    return (
      <form className={classes.form} onSubmit={this.handleSubmit}>
        <TextField
          id="content"
          onChange={this.handleChange}
          placeholder="What do you want to do?"
          className={classes.textField}
          variant="outlined"
          size="small"
          value={content}
          autoFocus
        />
        <Box className={classes.formBottomSection} display="flex">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            onClick={this.handleSubmit}
            variant="contained"
            color="secondary"
          >
            Add
          </Button>
        </Box>
      </form>
    );
  }
}

export default withStyles(styles)(TaskForm);
