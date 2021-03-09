import React, { useState } from "react";
import { Box, TextField, Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  form: {
    flex: 1
  },
  textField: {
    width: "100%"
  },
  formBottomSection: {
    marginTop: "10px"
  }
});

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const classes = useStyles();
  const editMode = task !== undefined;
  const initialTempTask = { content: "" };
  const [tempTask, setTempTask] = useState(() =>
    editMode ? task : initialTempTask
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tempTask.content !== "") {
      onSubmit(tempTask);
      setTempTask(initialTempTask);
    }
  };

  const handleChange = (e) => {
    setTempTask((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        id="content"
        onChange={handleChange}
        placeholder="What do you want to do?"
        className={classes.textField}
        variant="outlined"
        size="small"
        value={tempTask.content}
        autoFocus
      />
      <Box className={classes.formBottomSection} display="flex">
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="secondary">
          {editMode ? "Edit" : "Add"}
        </Button>
      </Box>
    </form>
  );
};

export default TaskForm;
