import React from "react";
import { connect } from "react-redux";
import { LOADER } from "../../action/LoaderAction";
export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SO: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleSubmit(e) {
    e.preventDefault();
    const formData = {};
    formData['alias'] = this.refs['alias'].value;
    formData['projectName'] = this.refs['projectName'].value;
    this.props.soUserInput(formData);

    // this.setState((prevState, props) => {
    //   return {
    //     Loading: this.props.Loading
    //   }
    // });
  }
  render() {
    return (
      <form className="form-horizontal vertical-center" autocomplete="off"  onSubmit={this.handleSubmit}>
      {console.log(this)}
      <fieldset disabled={this.props.loader ? true : false}>
        <div className="col-sm-12">
          <h1> Scratch Org</h1>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-4" htmlFor="alias">Enter Alias Name for Scratch ORG:</label>
          <div className="col-sm-5">
            <input ref="alias" type="text" className="form-control" id="alias" placeholder="Enter Alias" />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="projectName">Enter Project Name:</label>
          <div className="col-sm-5">
            <input ref="projectName" type="text" className="form-control" id="projectName" placeholder="Enter Project" />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button type="submit" className="btn btn-default">Submit</button>
          </div>
        </div>
      </fieldset>
      </form>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    loader: state.loader
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadingState: (value) => {
      dispatch(LOADER(value));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Main);