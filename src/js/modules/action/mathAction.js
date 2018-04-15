export function SET_USERDATA(value) {
  return {
    type: "SET_USERDATA",
    payload: value
  };
}
export function REQUEST_USERDATA(value) {
  return {
    type: "REQUEST_USERDATA",
    payload: value
  };
}