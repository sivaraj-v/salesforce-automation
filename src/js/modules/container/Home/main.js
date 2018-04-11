import React from "react";
import { connect } from "react-redux";
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
    for (const field in this.refs) {
      formData[field] = this.refs[field].value;
    }
    this.setState({
      SO: formData
    }, this.props.soUserInput(formData));

  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
            <input ref="phone" className="phone" type='tel' name="phone"/>
            <input ref="email" className="email" type='tel' name="email"/>
            <input type="submit" value="Submit"/>
            <button className="btn btn-primary" onClick={() => this.props.soUserInput('Anna')}>Change the Username </button>
      </form>
      );
  }
}