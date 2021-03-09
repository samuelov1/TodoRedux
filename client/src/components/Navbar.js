import React, { useContext } from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Switch
} from "@material-ui/core";
import { CustomThemeContext } from "./providers/CustomThemeProvider";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  spacer: {
    flex: 1
  }
});

const Navbar = () => {
  const classes = useStyles();
  const { darkMode, toggleDarkMode } = useContext(CustomThemeContext);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Todo
          </Typography>
          <div className={classes.spacer} />
          <Switch checked={darkMode} onChange={() => toggleDarkMode()} />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
