import joi from "joi";

import Task from "../models/Task";

export const getAllTasks = (req, res) => {
  Task.findAllTasks()
    .then((results) => res.send(results))
    .catch((error) => {
      res.status(500).send(error);
    });
};

export const setTaskCompleted = async (req, res) => {
  const schema = joi.object().keys({
    id: joi.string().alphanum().required(),
    isCompleted: joi.string().valid("true", "false"),
  });

  const error = schema.validate(req.params).error;
  if (error) {
    return res.status(400).send(error);
  }

  const id = req.params.id;
  const isCompleted = req.params.isCompleted === "true";

  try {
    const updatedAncestor = await Task.setCompletedAndUpdateAncestor(
      id,
      isCompleted
    );
    res.status(201).send(updatedAncestor);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
