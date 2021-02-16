import mongoUnit from "mongo-unit";
import DB from "../src/DB";

(async () => {
  const uri = await mongoUnit.start();
  const parsedUri = uri.substring(0, uri.lastIndexOf("/"));
  await DB.connect(
    { uri: parsedUri, db: "test" },
    { useUnifiedTopology: true }
  );
  console.log(`Fake mongoDB is started ${parsedUri}`);

  run();
})();

after(async () => {
  await mongoUnit.stop();
  await DB.disconnect();
});
