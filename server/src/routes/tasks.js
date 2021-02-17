import express from "express";

import { getAllTasks, getById } from "../controllers/tasks";

const route = express.Router();

route.get("/", getAllTasks);
route.get("/:id", getById);

export default route;
