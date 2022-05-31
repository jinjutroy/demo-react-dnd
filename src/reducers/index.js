import { combineReducers } from "redux";

import actionsUndo from "./actionsUndo";

const allReducers = combineReducers({
    actionsUndo,
  // add more reducers here
});

export default allReducers;