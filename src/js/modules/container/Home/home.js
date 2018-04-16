import React from 'react';
const JSON5 = require('json5')
import { connect } from "react-redux";
// import { User } from "../../component/user";
import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://localhost:9000');
import { Main } from "./main";
import { SET_USERDATA } from "../../action/mathAction";
import { LOADER } from "../../action/LoaderAction";
import JSON from '../../JSON/index';
import JSONPretty from 'react-json-pretty';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'white',
      time: new Date(),
      console: []
    };
    this.onChange = this.onChange.bind(this);
  }
  // componentWillMount() {
  //   //  console.log(this)
  //   this.setState({
  //     SO: {}
  //   })
  // }
  componentWillMount() {
    var that = this;
    socket.on('so_creation', function(data) {
      that.setState({
        time: data.toString()
      })
      console.log(that.state.console)
      that.state.console = that.state.time.toString();
      that.setState(
        that.state
      )
    });
  }
  componentDidMount() {
    // if (Object.keys(this.props.SO_Creation.soUserdata).length > 0) {
    //   const soUserdata = this.props.SO_Creation.soUserdata;
    //   this.props.req_userData(soUserdata);
    // }

  }

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
  // // const soUserdata = nextProps.props.SO_Creation.soUserdata;
  // // this.props.req_userData(soUserdata);
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
  onChange(field, value) {
    this.setState({
      [field]: value
    });

    if (this.state[field].loader == true) {
      this.props.setName(this.state);
      this.props.loadingState(true);

    }
  }


  render() {
    return (
    this.props.loader ?
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8 gradient-1 height100 greyout">
              <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              <Main loader={this.props.loader} onChange={this.onChange.bind(this)} />
          </div>
          <div className="col-lg-4 gradient-2 height100">
              <div className="vertical-split-50">
                <h1>Console</h1>
                <code>
                  {this.state.console}
                </code>
              </div>
              <div className="vertical-split-50">
                <JSONPretty id="json-pretty" json={this.props.SO_Creation}></JSONPretty>
              </div>
          </div>
        </div>
      </div>
      :
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8 gradient-1 height100">
              <Main loader={false} onChange={this.onChange.bind(this)} />
          </div>
          <div className="col-lg-4 gradient-2 height100">
              <div className="vertical-split-50">
                <h1>Console</h1>
                <code>
                  {this.state.console}
                </code>
              </div>
              <div className="vertical-split-50">
                <JSONPretty id="json-pretty" json={this.props.SO_Creation}></JSONPretty>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    // user: state.user,
    SO_Creation: state.SO_Creation,
    loader: state.loader
  };
};

// const mapStateToProps = ({ MyReducer }, { myProp }) => ({
//   myProp: myProp || MyReducer.myProp,
// })

const mapDispatchToProps = (dispatch) => {
  return {
    setName: (name) => {
      dispatch(SET_USERDATA(name));
    },
    loadingState: (value) => {
      dispatch(LOADER(value));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
