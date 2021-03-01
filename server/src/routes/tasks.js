import express from "express";

import {
  getAllTasks,
  getById,
  setCompletedById,
  deleteById
} from "../controllers/tasks";
import { validate } from "../middleware/validate";
import { idSchema, setCompletedSchema } from "../middleware/requestSchemas";
const route = express.Router();

route.get("/", getAllTasks);
route.get("/:id", validate(idSchema), getById);
route.patch("/:id/completed", validate(setCompletedSchema), setCompletedById);
route.delete("/:id", validate(idSchema), deleteById);

export default route;
