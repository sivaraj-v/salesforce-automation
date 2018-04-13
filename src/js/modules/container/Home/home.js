import React from 'react';
const JSON5 = require('json5')
import { connect } from "react-redux";
import { User } from "../../component/user";
import { Main } from "./main";
import { SET_NAME } from "../../action/mathAction";
import { LOADER } from "../../action/LoaderAction";
import JSON from '../../JSON/index';
import JSONPretty from 'react-json-pretty';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SO: {}
    }
    this.updateProps = this.updateProps.bind(this);
  }
  componentWillMount() {
    //  console.log(this)
    this.setState({
      SO: {}
    })
  }
  // componentDidMount() {
  //   console.log("DID")

  //   // dispatch(LOADER(true))
  // }

  // this.setState((prevState, props) => {
  //   return {
  //     Loading: true
  //   }
  // });

  // componentDidMount() {
  //     console.log("Component did mount!");
  // }

  // componentWillReceiveProps(nextProps) {
  //   console.log("Component will receive props", nextProps);

  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //     console.log("Should Component update", nextProps, nextState);
  //     // if (nextState.status === 1) {
  //     //     return false;
  //     // }
  //     return true;
  // }

  // componentWillUpdate(nextProps, nextState) {
  //     console.log("Component will update", nextProps, nextState);
  // }

  // componentDidUpdate(prevProps, prevState) {
  //     console.log("Component did update", prevProps, prevState);
  // }
  // componentWillUnmount() {
  //     console.log("Component will unmount");
  // }
  updateProps(value) {
    this.props.setName(value);
    this.props.loadingState(true);
  }
  render() {
    // console.log(this);
    return (
    this.props.loader ?
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8 gradient-1 height100 greyout">
              <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              <Main soUserInput={this.updateProps}/>
              { /* <User username={this.props.user.name}/> */ }
          </div>
          <div className="col-lg-4 gradient-2 height100">
            <JSONPretty id="json-pretty" json={this.props.SO_Creation}></JSONPretty>
          </div>
        </div>
      </div>
      :
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8 gradient-1 height100">
              <Main soUserInput={this.updateProps}/>
              { /* <User username={this.props.user.name}/> */ }
          </div>
          <div className="col-lg-4 gradient-2 height100">
            <JSONPretty id="json-pretty" json={this.props.SO_Creation}></JSONPretty>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    SO_Creation: state.SO_Creation,
    loader: state.loader
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setName: (name) => {
      dispatch(SET_NAME(name));
    },
    loadingState: (value) => {
      dispatch(LOADER(value));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
