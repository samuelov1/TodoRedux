import express from "express";

import taskRoutes from "./routes/tasks";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/tasks", taskRoutes);

export default app;
