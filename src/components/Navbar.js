import React from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Switch
} from "@material-ui/core";
import { connect } from "react-redux";
import { toggleDarkMode } from "../redux/actions";
import { getDarkMode } from "../redux/selectors";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  spacer: {
    flex: 1
  }
});

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Todo
          </Typography>
          <div className={classes.spacer} />
          <Switch checked={darkMode} onChange={toggleDarkMode} />
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = store => {
  const darkMode = getDarkMode(store);
  return { darkMode };
};

export default connect(
  mapStateToProps,
  { toggleDarkMode }
)(Navbar);
