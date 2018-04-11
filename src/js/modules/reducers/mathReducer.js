const mathReducer = (state = {
    soBasicInfo: {},
    soUserdata: {}
  }, action) => {
  switch (action.type) {
    case "SET_NAME":
      state = {
        ...state,
        name: "Changed",
        soUserdata: action.payload
      };
      break;
  }
  return state;
};

export default mathReducer;