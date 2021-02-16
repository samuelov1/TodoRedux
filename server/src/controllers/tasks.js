import Task from "../models/Task";

export const getAllTasks = (req, res) => {
  Task.findAllTasks()
    .then(results => res.send(results))
    .catch(error => {
      res.status(500).send(error);
    });
};
