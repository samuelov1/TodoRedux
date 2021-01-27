import React, { Component } from "react";
import {
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText
} from "@material-ui/core";
import { RadioButtonChecked, RadioButtonUnchecked } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";

const styles = {
  listItem: {
    padding: "3px 0px",
    borderBottom: "1px solid rgba(50, 50, 50, 0.1)"
  }
};

class Task extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, content } = this.props.task;
    const { classes } = this.props;

    return (
      <ListItem className={classes.listItem} button disableRipple>
        <ListItemIcon>
          <Checkbox
            icon={<RadioButtonUnchecked />}
            checkedIcon={<RadioButtonChecked />}
            tabIndex={2}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText id={`text-label-${id}`} primary={content} />
      </ListItem>
    );
  }
}

export default withStyles(styles)(Task);
