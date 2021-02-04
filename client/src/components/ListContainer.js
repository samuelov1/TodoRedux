import React, { useEffect } from "react";
import { CircularProgress, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";

import { fetchTasks } from "../redux/actions/tasks";
import {
  getFilteredTasks,
  getIsLoading,
  getIsError,
} from "../redux/selectors/tasks";
import ListHeader from "./ListHeader";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import ListSortingPanel from "./ListSortingPanel";

const useStyle = makeStyles({
  container: {
    marginTop: 60,
  },
});

const ListContainer = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const isError = useSelector(getIsError);
  const tasks = useSelector(getFilteredTasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const classes = useStyle();

  const renderContent = () => {
    if (isError) {
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Tasks Could not be loaded. <strong>Refresh to try again</strong>
        </Alert>
      );
    }

    if (isLoading) {
      return <CircularProgress />;
    }

    return (
      <>
        <ListHeader />
        <ListSortingPanel />
        <TaskList tasks={tasks} />
        <AddTask />
      </>
    );
  };

  return (
    <Container className={classes.container} maxWidth="md">
      {renderContent()}
    </Container>
  );
};

export default ListContainer;
