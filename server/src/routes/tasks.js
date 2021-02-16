import express from "express";

import { getAllTasks } from "../controllers/tasks";

const route = express.Router();

route.get("/", getAllTasks);

export default route;
