export const createElement = (obj) => {
    return {
        type: "CREATE",
        payload: obj,
    };
};
export const updateElement = (obj) => { 
    return {
        type: "UPDATE",
        payload: obj,
    };
}
export const deleteElementR = (obj) => {
    return {
        type: "DELETE",
        payload: obj,
    };
};