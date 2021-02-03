import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import OptionsMenu from "./OptionsMenu";

const useStyle = makeStyles({
  header: {
    alignItems: "center",
    marginTop: 60,
    padding: "10px 10px"
  },
  headerTitle: {
    fontWeight: "bold"
  },
  flexSpacer: {
    flex: 1
  }
});

const ListHeader = () => {
  const classes = useStyle();
  return (
    <Box className={classes.header} display="flex">
      <Typography className={classes.headerTitle} variant="h5">
        Tasks
      </Typography>
      <Box className={classes.flexSpacer} />
      <OptionsMenu />
    </Box>
  );
};

export default ListHeader;
