import {
  findAllTasks,
  findById,
  setCompletedAndUpdateAncestor
} from "../utils/taskUtils";

export const getAllTasks = (req, res) => {
  findAllTasks()
    .then((results) => res.send(results))
    .catch((error) => {
      res.status(500).send(error);
    });
};

export const getById = (req, res) => {
  const id = req.params.id;

  findById(id)
    .then((result) => res.send(result))
    .catch((error) => {
      res.status(404).send(error);
    });
};

export const setCompletedById = (req, res) => {
  const id = req.params.id;
  const isCompleted = req.body.isCompleted;

  setCompletedAndUpdateAncestor(id, isCompleted)
    .then((result) => res.send(result))
    .catch((error) => {
      res.status(404).send(error);
    });
};
