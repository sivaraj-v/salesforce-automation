
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
  }
  return state;
};

export default mathReducer;