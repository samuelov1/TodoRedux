import express from "express";

import { getAllTasks, setTaskCompleted } from "../controllers/tasks";

const route = express.Router();

route.get("/", getAllTasks);
route.patch("/:id/completed/:isCompleted", setTaskCompleted);

export default route;
