const loaderInit = false;
const loader = (state = loaderInit, action) => {
switch (action.type) {
  case "LOADER":
    state = action.payload;
    break;
}
return state;
};

export default loader;
