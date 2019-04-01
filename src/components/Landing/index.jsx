import React from "react";

const Landing = () => (
  <div>
    <nav id="topNav" className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-navbar"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <a className="navbar-brand page-scroll" href="#first">
            <i className="ion-ios-analytics-outline" /> UCM ACM
          </a>
        </div>
        <div className="navbar-collapse collapse" id="bs-navbar">
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a
                className="page-scroll"
                data-toggle="modal"
                title="A free Bootstrap video landing theme"
                href="#aboutModal"
              >
                About
              </a>
            </li>
            <li>
              <a className="page-scroll" href="#two">
                Highlights
              </a>
            </li>
            {/*<li>
                        <a className="page-scroll" href="#three">Showcase</a>
                    </li>*/}
            <li>
              <a className="page-scroll" href="#last">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <header id="first">
      <div className="header-content">
        <div className="inner">
          <h1>Association for Computing Machinery</h1>
          <h4>University of California, Merced</h4>
          <hr />
          <a href="#one" className="btn btn-primary btn-xl page-scroll">
            Get Started
          </a>
        </div>
      </div>
    </header>
    <section id="two">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 className="margin-top-0 text-primary">What We Do</h1>
            <hr className="primary" />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-4 text-center">
            <div className="feature">
              <i
                className="far fa-handshake fa-5x wow fadeInLeft"
                data-wow-delay=".3s"
              />
              <h3>General Meeting</h3>
              <p className="text-muted">
                Every Second Tuesday of the month come on out and learn about
                what events and opportunities are coming up
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 text-center">
            <div className="feature">
              <i
                className="fas fa-mug-hot fa-5x wow fadeInUp"
                data-wow-delay=".2s"
              />
              <h3>Coffee and Code</h3>
              <p className="text-muted">
                Every Tuesday and Thursday in KL 397 from 12pm - 4pm, come get
                help with anything Computer Science related
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 text-center">
            <div className="feature">
              <i
                className="fas fa-server fa-5x wow fadeInRight"
                data-wow-delay=".3s"
              />
              <h3>LAN Party</h3>
              <p className="text-muted">
                Come hangout and mingle with like minded individuals and play
                some games
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-4 text-center">
            <div className="feature">
              <i
                className="fas fa-project-diagram fa-5x wow fadeInLeft"
                data-wow-delay=".3s"
              />
              <h3>Projects</h3>
              <p className="text-muted">
                Tackle a hands on project for any field within the Computer
                Science universe
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 text-center">
            <div className="feature">
              <i
                className="fas fa-laptop-code fa-5x wow fadeIn"
                data-wow-delay=".2s"
              />
              <h3>Workshops</h3>
              <p className="text-muted">
                A great way to learn something new or refresh your knowledge on
                something old
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 text-center">
            <div className="feature">
              <i
                className="fas fa-book fa-5x wow fadeInRight"
                data-wow-delay=".3s"
              />
              <h3>Interview Prep</h3>
              <p className="text-muted">
                Whether you have an internship or job lined up, everyone should
                practice
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-4 text-center">{/* nothing */}</div>
          <div className="col-lg-4 col-md-4 text-center">
            <div className="feature">
              <i
                className="far fa-building fa-5x wow fadeInDown"
                data-wow-delay=".2s"
              />
              <h3>Company Tours</h3>
              <p className="text-muted">
                Come tour with us and check out the inside of a company and
                learn from professionals
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 text-center">{/* nothing */}</div>
        </div>
      </div>
    </section>
    {/*<section id="three" className="no-padding">
        <div className="container-fluid">
            <div className="row no-gutter">
                <div className="col-lg-4 col-sm-6">
                    <a href="#galleryModal" className="gallery-box" data-toggle="modal" data-src="../../assets/images/GitHub_Workshop.JPG">
                        <img src="../../assets/images/GitHub_Workshop.JPG" className="img-responsive" alt="GitHub Workshop" />
                        <div className="gallery-box-caption">
                            <div className="gallery-box-content">
                                <div>
                                    <i className="icon-lg ion-ios-search"></i>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <a href="#galleryModal" className="gallery-box" data-toggle="modal" data-src="../../assets/images/LAN_Party.JPG">
                        <img src="../../assets/images/LAN_Party.JPG" className="img-responsive" alt="LAN Party" />
                        <div className="gallery-box-caption">
                            <div className="gallery-box-content">
                                <div>
                                    <i className="icon-lg ion-ios-search"></i>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <a href="#galleryModal" className="gallery-box" data-toggle="modal" data-src="../../assets/images/Conferences.jpg">
                        <img src="../../assets/images/Conferences.jpg" className="img-responsive" alt="Conference" />
                        <div className="gallery-box-caption">
                            <div className="gallery-box-content">
                                <div>
                                    <i className="icon-lg ion-ios-search"></i>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </section>*/}
    <section id="last">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-lg-offset-2 text-center">
            <h2 className="margin-top-0 wow fadeIn">Get in Touch</h2>
            <hr className="primary" />
            <p>
              We love feedback. Fill out the form below and we'll get back to
              you as soon as possible.
            </p>
          </div>
          <div className="col-lg-10 col-lg-offset-1 text-center">
            <form className="contact-form row">
              <div className="col-md-4">
                <label />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="col-md-4">
                <label />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                />
              </div>
              <div className="col-md-4">
                <label />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                />
              </div>
              <div className="col-md-12">
                <label />
                <textarea
                  className="form-control"
                  rows="9"
                  placeholder="Your message here.."
                />
              </div>
              <div className="col-md-4 col-md-offset-4">
                <label />
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg"
                >
                  Send <i className="ion-android-arrow-forward" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
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
                  <i class="fab fa-twitter fa-3x" />
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
                <a rel="nofollow" href="ucm-acm.slack.com" title="Slack">
                  <i class="fab fa-slack fa-3x" />
                </a>
              </li>
              <li>
                <a
                  rel="nofollow"
                  href="https://github.com/UCMercedACM"
                  title="GitHub"
                >
                  <i class="fab fa-github fa-3x" />
                </a>
              </li>
              <li>
                <a
                  rel="nofollow"
                  href="https://discord.gg/by5Gq48"
                  title="Discord"
                >
                  <i class="fab fa-discord fa-3x"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <br />
        <span className="pull-right text-muted small">
          <a href="http://www.bootstrapzero.com">UCM ACM Chapter</a> ©2019
        </span>
      </div>
    </footer>
    {/*<div id="galleryModal" className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-lg">
        <div className="modal-content">
        	<div className="modal-body">
        		<img src="http://placehold.it/1200x700/222?text=..." id="galleryImage" className="img-responsive" />
        		<p>
        		    <br/>
        		    <button className="btn btn-primary btn-lg center-block" data-dismiss="modal" aria-hidden="true">Close <i className="ion-android-close"></i></button>
        		</p>
        	</div>
        </div>
        </div>
    </div>*/}
    <div
      id="aboutModal"
      className="modal fade"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <h2 className="text-center">Association for Computing Machinery</h2>
            <h5 className="text-center">University of California, Merced</h5>
            <p className="text-justify">
              The Chapter is organized and will be operated exclusively for
              educational and scientific purposes to promote the following: An
              increased knowledge of and greater interest in the science,
              design, development, construction, languages, management and
              applications of modern computing. Greater interest in computing
              and its applications. A means of communication between persons
              having an interest in computing.
            </p>
            <p className="text-center">
              <a href="https://catlife.ucmerced.edu/organization/acm/documents/view/580190">
                Download our Bylaws
              </a>
            </p>
            <br />
            <button
              className="btn btn-primary btn-lg center-block"
              data-dismiss="modal"
              aria-hidden="true"
            >
              {" "}
              OK{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Landing;
