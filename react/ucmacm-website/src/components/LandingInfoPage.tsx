import AboutUsImage from "../assets/images/about-us.png";

function LandingInfoPage() {
  return (
    <section>
      <h1 className="font-bold text-center text-4xl text-tertiary pb-16">About Us</h1>
      <div className="columns-2 gap-x-24">
        <div className="container-2xl">
      <p className="text-tertiary text-xl">
        Association for Computing Machinery (ACM) is the biggest computing
            organization at University of California, Merced. We build a
            community of students, developers, designers, and professionals. We
            host many events ranging from Coffee and Code, Koding Kata, and LAN
            Parties to SIG events including introduction to UI/UX,
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
        <div className="align-center"><img src={AboutUsImage}/></div>
      </div>
    </section>
  );
}

export default LandingInfoPage;
