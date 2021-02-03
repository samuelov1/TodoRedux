import React, { Component } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core";

class DeleteDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  open() {
    this.setState({ isOpen: true });
  }

  close() {
    this.setState({ isOpen: false });
  }

  handleConfirm() {
    this.close();
    this.props.onConfirm();
  }

  render() {
    const { isOpen } = this.state;

    return (
      <Dialog
        open={isOpen}
        onClose={this.close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this task?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={this.close} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.handleConfirm}
            variant="contained"
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DeleteDialog;
