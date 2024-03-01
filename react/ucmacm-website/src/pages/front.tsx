import GlobalNavbar from "../components/GlobalNavbar";
import GlobalFooter from "../components/GlobalFooter";
import WaveHeader from "../components/WaveHeader";
import AboutUsImage from "../assets/images/about-us.png";
import SocialResponsibility from "../assets/images/social-responsibility.png";
import ProjectManagement from "../assets/images/project-management.png";
import OnlineCourses from "../assets/images/online-course.png";
import Communities from "../assets/images/communities.png";

import "../index.css";
function Front() {
  return (
    <>
      <GlobalNavbar />
      <WaveHeader />

      <section className="mx-24">
        <h1 className="font-bold text-center text-4xl text-tertiary pb-16">
          About Us
        </h1>
        <div className="columns-2 items-center">
          <div className="container-2xl">
            <p className="text-tertiary text-xl">
              Association for Computing Machinery (ACM) is the biggest computing
              organization at University of California, Merced. We build a
              community of students, developers, designers, and professionals.
              We host many events ranging from Coffee and Code, Koding Kata, and
              LAN Parties to SIG events including introduction to UI/UX,
              Cybersecurity, IOT, Artificial Intelligence, and Software
              Engineering.
              <br />
              <br />
              We aim to provide a strong sense of community to all engineering
              students with a particular focus on students studying computer
              science. We also host activities such as tech talks, capture the
              flag, movie nights, game nights, and Friday socials. Join our
              organization and get involved in our general meetings!
            </p>
          </div>
          <div className="align-center">
            <img src={AboutUsImage} />
          </div>
        </div>
      </section>
      <section className="mx-24">
        <h1 className="font-bold text-center text-4xl text-tertiary pt-16 pb-16">
          Goals
        </h1>

        {/*TEST THIS AGAINST MOBILE UI - Noelle*/}
        <div className="grid-rows-2 grid-cols-2 md:columns-1 gap-y-8 justify-center flex flex-row gap-x-24 text-tertiary">
          <div className="flex flex-col items-center text-center text-wrap max-w-md">
            <img
              className="py-2"
              src={ProjectManagement}
              width="100"
              height="100"
            />
            <p className="font-semibold text-xl pb-4">Technical Excellence</p>
            <p className="text-md">
              Preparing the club and its members for work in the industry, at
              the highest quality of efficiency and scalability.
            </p>
          </div>
          <div className="flex flex-col items-center text-center text-wrap max-w-md">
            <img
              className="py-2"
              src={OnlineCourses}
              width="100"
              height="100"
            />
            <p className="font-semibold text-xl pb-4">
              Educational Transparency
            </p>
            <p className="text-md">
              Allowing ease of access for all academic topics related to
              computer science and in our course materials.
            </p>
          </div>
          <div className="flex flex-col items-center text-center text-wrap max-w-md">
            <img className="py-2" src={Communities} width="100" height="100" />
            <p className="font-semibold text-xl pb-4">Community</p>
            <p className="text-md">
              Providing a welcoming environment for computer scientists from all
              areas of technical knowledge and tying that back to a sense of
              campus culture.
            </p>
          </div>
          <div className="flex flex-col items-center text-center text-wrap max-w-md">
            <img
              className="py-2"
              src={SocialResponsibility}
              width="100"
              height="100"
            />
            <p className="font-semibold text-xl pb-4">Social Responsibility</p>
            <p className="text-md">
              Ensuring that our members are involved in social and corporate
              environments that uphold high standards of ethical and moral
              responsibility.
            </p>
          </div>
        </div>
      </section>
      <GlobalFooter />
    </>
  );
}

export default Front;
