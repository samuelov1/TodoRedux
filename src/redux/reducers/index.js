import { combineReducers } from "redux";
import filters from "./filters";
import tasks from "./tasks";
import theme from "./theme";

export default combineReducers({ tasks, filters, theme });
