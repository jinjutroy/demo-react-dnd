const actionsUndoReducer = (state = [], action) => {
    switch (action.type) {
        case "CREATE": 
        case "DELETE": 
        case "UPDATE":
            state.push({ data: action.payload, action: action.type});
            return state;
        default:
            return state;
    }
};
  
export default actionsUndoReducer;