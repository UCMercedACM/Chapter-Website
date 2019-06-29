import React, {Component} from "react";
import Header from "../Header";
import Footer from "../Footer";

const sendEmail = (name, email, category, message) => {
  console.log(name + "\n" + email + "\n" + category + "\n" + message);

  return fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, category, message })
  }).then(response => response.json());
};

class Home extends Component {
  state = {
    name: "",
    email: "",
    category: "",
    message: ""
  }

  

  render() {
    return (
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
                UCM ACM
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
        <Header/>
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
                      required
                      onChange={ev => {
                        this.setState({ name: ev.target.value });
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      required
                      onChange={ev => {
                        this.setState({ email: ev.target.value });
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label />
                    <select
                      className="form-control"
                      placeholder="Phone"
                      required
                      onChange={ev => {
                        this.setState({ category: ev.target.value });
                      }}
                    >
                      <option value="Workshops">Workshops</option>
                      <option value="Projects">Projects</option>
                      <option value="Newsletter">Newsletter</option>
                      <option value="Company Tours">Company Tours</option>
                      <option value="Conferences">Conferences</option>
                      <option value="Coffee and Code">Coffee and Code</option>
                      <option value="LAN Party">LAN Party</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label />
                    <textarea
                      className="form-control"
                      rows="9"
                      placeholder="Your message here.."
                      required
                      onChange={ev => {
                        this.setState({ message: ev.target.value });
                      }}
                    />
                  </div>
                  <div className="col-md-4 col-md-offset-4">
                    <label />
                    <button
                      type="button"
                      className="btn btn-primary btn-block btn-lg"
                      onClick={() => {
                        const { name, email, category, message } = this.state;

                        if (name && email && category && message) {
                          sendEmail(name, email, category, message);
                        }
                      }}
                    >
                      Send <i className="ion-android-arrow-forward" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <Footer/>
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
    )
  }
}

export default Home;
