import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useErrors } from "./providers/ErrorProvider";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const ErrorSnackbar = () => {
  const classes = useStyles();
  const { error, removeError } = useErrors();

  return (
    <div className={classes.root}>
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => removeError()}
      >
        <Alert onClose={() => removeError()} severity="error">
          {error?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ErrorSnackbar;
