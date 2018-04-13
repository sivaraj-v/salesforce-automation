const userReducer = (state = {
    name: "Working",
    age: 27
  }, action) => {
  switch (action.type) {

    case "SET_AGE":
      state = {
        ...state,
        age: action.payload
      };
      break;
  }
  return state;
};

export default userReducer;