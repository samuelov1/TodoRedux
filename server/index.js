import dotenv from "dotenv";
import DB from "./src/DB";
import server from "./src/server";

dotenv.config();

DB.connect(
  { uri: process.env.MONGO_URI, db: process.env.DB_NAME },
  { useUnifiedTopology: true }
).then(() => {
  console.log(`MongoDB connected to ${process.env.MONGO_URI}`);

  server.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`)
  );
});
