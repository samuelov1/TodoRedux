import dotenv from "dotenv";
import BaseModel from "./src/models/BaseModel";
import server from "./src/server";

dotenv.config();

const run = async () => {
  await BaseModel.connect(
    { uri: process.env.MONGO_URI, db: process.env.DB_NAME },
    { useUnifiedTopology: true }
  );
  console.log(`MongoDB connected to ${process.env.MONGO_URI}`);

  server.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`)
  );
};

run();
