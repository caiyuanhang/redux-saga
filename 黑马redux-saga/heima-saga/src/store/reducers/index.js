export const defReducer = (state = {}, action) => {
    if(action.type === "takeEvery") return Object.assign({}, state, action);

    return state;
}