import { combineReducers } from "redux";
import filters from "./filters";
import tasks from "./tasks";

export default combineReducers({ tasks, filters });
