import mongoUnit from "mongo-unit";
import BaseModel from "../src/models/BaseModel";

(async () => {
  const uri = await mongoUnit.start();
  const parsedUri = uri.substring(0, uri.lastIndexOf("/"));
  await BaseModel.connect(
    { uri: parsedUri, db: "test" },
    { useUnifiedTopology: true }
  );
  console.log(`Fake mongoDB is started ${parsedUri}`);

  run();
})();

after(async () => {
  await mongoUnit.stop();
  await BaseModel.disconnect();
});
