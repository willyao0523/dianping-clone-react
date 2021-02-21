import { combineReducers } from "redux";
import entities from "./entities";
import home from "./home";
import detail from "./detail";
import app from "./app";

/**
 * combine to root reducer with UI states and domain states
 * UI states like home, detail
 * domain states like entities
 */
const rootReducer = combineReducers({
  entities,
  home,
  detail,
  app
})

export default rootReducer;