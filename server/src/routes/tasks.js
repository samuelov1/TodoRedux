import express from "express";

import {
  getAllTasks,
  getById,
  setCompletedById,
  deleteById,
  addTask
} from "../controllers/tasks";
import { validate } from "../middleware/validate";
import {
  idSchema,
  setCompletedSchema,
  taskSchema
} from "../middleware/requestSchemas";

const route = express.Router();

route.get("/", getAllTasks);
route.get("/:id", validate(idSchema), getById);
route.patch("/:id/completed", validate(setCompletedSchema), setCompletedById);
route.delete("/:id", validate(idSchema), deleteById);
route.post("/", validate(taskSchema), addTask);

export default route;
