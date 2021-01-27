import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import ListHeader from "./ListHeader";
import TaskList from "./TaskList";

const useStyle = makeStyles({
  container: {
    marginTop: 60
  }
});

const ListContainer = () => {
  const classes = useStyle();
  return (
    <Container className={classes.container} maxWidth="md">
      <ListHeader />
      <TaskList />
    </Container>
  );
};

export default ListContainer;
