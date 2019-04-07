import React, {Component} from "react";

class Footer extends Component{
    render(){
        return(
            <footer id="footer">
            <div className="container-fluid">
              <div className="row">
                <div className="col-xs-6 col-sm-3 column">
                  {/*<h4>Information</h4>
                          <ul className="list-unstyled">
                              <li><a href="#">Products</a></li>
                              <li><a href="#">Services</a></li>
                              <li><a href="#">Benefits</a></li>
                              <li><a href="#">Developers</a></li>
                          </ul>*/}
                </div>
                <div className="col-xs-6 col-sm-3 column">
                  {/*<h4>About</h4>
                          <ul className="list-unstyled">
                              <li><a href="#">Contact Us</a></li>
                              <li><a href="#">Delivery Information</a></li>
                              <li><a href="#">Privacy Policy</a></li>
                              <li><a href="#">Terms &amp; Conditions</a></li>
                          </ul>*/}
                </div>
                <div className="col-xs-12 col-sm-3 column">
                  {/*<h4>Stay Posted</h4>
                          <form>
                              <div className="form-group">
                                <input type="text" className="form-control" title="No spam, we promise!" placeholder="Tell us your email" />
                              </div>
                              <div className="form-group">
                                <button className="btn btn-primary" data-toggle="modal" data-target="#alertModal" type="button">Subscribe for updates</button>
                              </div>
                          </form>*/}
                </div>
                <div className="col-xs-12 col-sm-3 text-right">
                  <ul className="list-inline">
                    <li>
                      <a
                        rel="nofollow"
                        href="https://twitter.com/ucmercedacm"
                        title="Twitter"
                      >
                        <i className="fab fa-twitter fa-3x" />
                      </a>
                      &nbsp;
                    </li>
                    <li>
                      <a
                        rel="nofollow"
                        href="https://www.facebook.com/groups/ucmercedacm/"
                        title="Facebook"
                      >
                        <i className="fab fa-facebook fa-3x" />
                      </a>
                      &nbsp;
                    </li>
                    <li>
                      <a
                        rel="nofollow"
                        href="https://ucm-acm.slack.com"
                        title="Slack"
                      >
                        <i className="fab fa-slack fa-3x" />
                      </a>
                    </li>
                    <li>
                      <a
                        rel="nofollow"
                        href="https://github.com/UCMercedACM"
                        title="GitHub"
                      >
                        <i className="fab fa-github fa-3x" />
                      </a>
                    </li>
                    <li>
                      <a
                        rel="nofollow"
                        href="https://discord.gg/by5Gq48"
                        title="Discord"
                      >
                        <i className="fab fa-discord fa-3x" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <br />
              <span className="pull-right text-muted small">
                <a href="http://ucm.acm.org">UCM ACM Chapter</a> ©2019
              </span>
            </div>
          </footer>
        );
    }
}

export default Footer;