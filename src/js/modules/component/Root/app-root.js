import React, { Component } from "react";
import Link from "react-router-dom/Link";
import Route from "react-router-dom/Route";
import { renderRoutes } from "react-router-config";
const https = require("https");
class AppRoot extends Component {
  render() {
    return (
      <div>
        { /* <Link to="/home"> Home </Link>
        <Link to="/list"> Redirect </Link>
        <Link to="/users"> Users </Link>
        <Link to="/404"> 404 </Link>
        <Link to="/about"> About </Link>
        <Link to="/product"> Products </Link> */ }
          {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="mainNav">
            <div className="container">
              <a className="navbar-brand js-scroll-trigger" href="#page-top">Salesforce</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarResponsive">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <a className="nav-link js-scroll-trigger" href="#about">SO Creation</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link js-scroll-trigger" href="#services">Deployment</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav> */}
        <main>
          {renderRoutes(this.props.route.routes)}
        </main>
      </div>
      );
  }
}
// var appConfig = require('./sample.json5')
// https.get(menu, res => {
//   res.setEncoding("utf8");
//   let body = "";
//   res.on("data", data => {
//     body += data;
//   });
//   res.on("end", () => {
//     body = JSON.parse(body);
//     console.log(
//       `City: ${body.results[0].formatted_address} -`,
//       `Latitude: ${body.results[0].geometry.location.lat} -`,
//       `Longitude: ${body.results[0].geometry.location.lng}`
//     );
//   });
// });

export default AppRoot;
