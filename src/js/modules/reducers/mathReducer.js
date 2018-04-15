
const mathReducer = (state = {
    soBasicInfo: {},
    soUserdata: {}
  }, action) => {
  switch (action.type) {
    case "SET_USERDATA":
      state = {
        ...state,
        soUserdata: action.payload
      };
      break;
      case "REQUEST_USERDATA":
      console.log(state);
      console.log(action);
      break;
  }
  return state;
};

export default mathReducer;