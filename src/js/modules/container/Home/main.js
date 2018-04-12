import React from "react";
import { connect } from "react-redux";
export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SO: {},
      Loading: this.props.Loading
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmits = this.handleSubmits.bind(this);
  }
  componentDidMount() {
    //console.log(this);
  }
  handleSubmits(value) {
    // this.setState((prevState, props) => {
    //   return {
    //     Loading: true
    //   }
    // });
    this.props.Loading = true;
    this.props.soUserInput(value);
  }
  handleSubmit(e) {
    e.preventDefault();
    const formData = {};
    formData['alias'] = this.refs['alias'].value;
    formData['projectName'] = this.refs['projectName'].value;

    this.props.Loading = true;
    this.props.soUserInput(formData);
    this.setState((prevState, props) => {
      return {
        Loading: this.props.Loading
      }
    });
    //this.handleSubmits(formData);
    console.log(this);
  }
  render() {

    return (
      <form className="form-horizontal vertical-center" autocomplete="off"  onSubmit={this.handleSubmit}>
      {console.log(this)}
      <fieldset disabled={this.state.Loading == undefined ? true : false}>
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