import React, {Component} from "react";

class Header extends Component{
    render(){
        return(
            <header id="first">
            <div className="header-content">
              <div className="inner">
                <h1>Association for Computing Machinery</h1>
                <h4>University of California, Merced</h4>
                <hr />
                <a
                  href="https://ucm-acm.slack.com"
                  className="btn btn-primary btn-xl page-scroll"
                >
                  24/7 Coding Help
                </a>
              </div>
            </div>
          </header>
        )
    }
}

export default Header;