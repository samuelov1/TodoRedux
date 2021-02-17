import express from "express";

import { getAllTasks, getById, setCompletedById } from "../controllers/tasks";

const route = express.Router();

route.get("/", getAllTasks);
route.get("/:id", getById);
route.patch("/:id/completed/:isCompleted", setCompletedById);

export default route;
