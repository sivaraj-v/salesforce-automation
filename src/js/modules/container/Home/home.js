import React from 'react';
import { connect } from "react-redux";
// import { User } from "../../component/user";
import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://localhost:9000');
import { Main } from "./main";
import { SET_USERDATA } from "../../action/mathAction";
import { LOADER } from "../../action/LoaderAction";
import JSON from '../../JSON/index';
import JSONPretty from 'react-json-pretty';
import sf_gif from "../../../../img/tb_astro.png";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'white',
      time: new Date(),
      console: ''
    };
    this.onChange = this.onChange.bind(this);
    this.loaderState = this.loaderState.bind(this);

  // this.props.loadingState(true);
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
        time: data.toString(),
        console: that.state.time.toString()
      })

      that.setState(
        that.state
      )
    });
    socket.on('so_creation_org_details', function(data) {
      that.setState({
        ...that.state,
        'soDetails': data
      })
      that.props.setName(that.state)
    });
  }
  componentDidMount() {
    // console.log(this)
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
    if (Object.keys(value).length > 0) {
      //  alert(1)
      this.setState((prevState, props) => {
        return {
          ...prevState,
          [field]: value
        }
      });
      this.props.setName(this.state)
    }
  }
  loaderState(loader) {
    if (loader == true) {
      this.props.loadingState(true);
    } else {
      this.props.loadingState(false);
    }
  }
  render() {
    var that = this;
    var userInformationEnabled = 0;
    if (that.props.SO_Creation.soUserdata.soDetails instanceof Object) {
      if (Object.keys(that.props.SO_Creation.soUserdata.soDetails).length > 0) {
        userInformationEnabled = 1;
        var userRequiredInformation = {
          username: that.props.SO_Creation.soUserdata.soDetails.result.username,
          password: that.props.SO_Creation.soUserdata.soDetails.result.password,
          instanceUrl: that.props.SO_Creation.soUserdata.soDetails.result.instanceUrl
        }
      }
    }
    return (
    this.props.loader ?
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8 gradient-1 height100 greyout">
          <div id="overlay">
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
            <Main loader={this.props.loader} loaderState={this.loaderState.bind(this)} onChange={this.onChange.bind(this)} />
          </div>
          <div className="col-lg-4 gradient-2 height100">
              <div className="vertical-split-50">
                <h1>Console</h1>
                <code>
                  {this.state.console}
                </code>
              </div>
              <div className="vertical-split-50">
                { /* <JSONPretty id="json-pretty" json={this.props.SO_Creation}></JSONPretty> */ }
                <h4 className="shine">We are processing your data, please wait..</h4>
              </div>
          </div>
        </div>
      </div>
      :
      <div className="container-fluid">
        <div className="row">
            <div className="col-lg-8 gradient-1 height100">
            {userInformationEnabled <= 0 &&
      <Main loader={false} loaderState={this.loaderState.bind(this)} onChange={this.onChange.bind(this)} />
      }
            {userInformationEnabled > 0 &&
      <div>
      <h4 className="shine">Installing packages is under process...!</h4>
      <img src={sf_gif} alt="boohoo" className="img-responsive img-center"/>
      </div>
      }
            </div>
          <div className="col-lg-4 gradient-2 height100">
              <div className="vertical-split-50">
                <h1>Console</h1>
                <code>
                  {this.state.console}
                </code>
              </div>
              {userInformationEnabled > 0 &&
      <div className="vertical-split-50">
                            <p><span>URL :</span> {userRequiredInformation.instanceUrl}</p>
                            <p><span>Username :</span> {userRequiredInformation.username}</p>
                            <p><span>Password :</span> {userRequiredInformation.password}</p>
                          </div>
      }
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
