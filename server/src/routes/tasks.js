import express from "express";

import {
  getAllTasks,
  getById,
  setCompletedById,
  deleteById,
  addTask,
  update
} from "../controllers/tasks";
import { validate } from "../middleware/validate";
import {
  idSchema,
  setCompletedSchema,
  taskSchema,
  updateTaskSchema
} from "../middleware/requestSchemas";

const route = express.Router();

route.get("/", getAllTasks);
route.get("/:id", validate(idSchema), getById);
route.patch("/:id/completed", validate(setCompletedSchema), setCompletedById);
route.delete("/:id", validate(idSchema), deleteById);
route.post("/", validate(taskSchema), addTask);
route.put("/", validate(updateTaskSchema), update);

export default route;
