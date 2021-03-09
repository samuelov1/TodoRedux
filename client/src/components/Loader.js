import { Box, makeStyles } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles({
  loadingContainer: {
    justifyContent: "center",
    padding: "30px",
  },
});

const Loader = () => {
  const classes = useStyles();

  return (
    <Box className={classes.loadingContainer} display="flex">
      <CircularProgress />
    </Box>
  );
};

export default Loader;
