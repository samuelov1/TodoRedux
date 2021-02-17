import { ObjectId } from "mongodb";

export default () => ({
  tasks: [
    {
      _id: ObjectId("601bae6c0eaac592041a693b"),
      content: "Clean the house",
      isCompleted: false,
      subtasks: [
        ObjectId("601baf200eaac592041a693d"),
        ObjectId("601bae6c0eaac592041a693b")
      ]
    },
    {
      _id: ObjectId("601baef70eaac592041a693c"),
      content: "Walk the dog",
      isCompleted: false,
      subtasks: []
    },
    {
      _id: ObjectId("601baf200eaac592041a693d"),
      content: "Clean bathroom",
      isCompleted: true,
      parentId: ObjectId("601bae6c0eaac592041a693b"),
      subtasks: []
    },
    {
      _id: ObjectId("601bafb50eaac592041a6940"),
      content: "Wash dishes",
      isCompleted: false,
      parentId: ObjectId("601bae6c0eaac592041a693b"),
      subtasks: [
        ObjectId("601bafb50eaac592041a6940"),
        ObjectId("601bafb50eaac592041a6940")
      ]
    },
    {
      _id: ObjectId("601bafb50eaac592041a6941"),
      content: "Wash the plates",
      isCompleted: true,
      parentId: ObjectId("601bafb50eaac592041a6940"),
      subtasks: []
    },
    {
      _id: ObjectId("601bafb50eaac592041a6942"),
      content: "Wash the cups",
      isCompleted: false,
      parentId: ObjectId("601bafb50eaac592041a6940"),
      subtasks: []
    }
  ]
});
