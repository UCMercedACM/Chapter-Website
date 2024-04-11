import { useEffect } from "react";
import GlobalFooter from "../components/GlobalFooter";
import GlobalNavbar from "../components/GlobalNavbar";
import SigTopic from "../components/SigTopic";
import { fetchEvents } from "../hooks/events";

const placeholderEvents = [
  {
    title: "Introduction to React",
    date: "2021-10-01",
    time: "5:00 PM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel faucibus non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel non.",
    location: "COB 267"
  },
  {
    title: "Introduction to SQL",
    date: "2021-10-01",
    time: "6:45 PM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel faucibus non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel non.",
    location: "KL 128"
  },
  {
    title: "Introduction to NextUI",
    date: "2021-10-01",
    time: "7:00 PM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel faucibus non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea maecenas consequat congue elit lectus tristique eget sapien a. Tortor ullamcorper nibh sed orci eget vel non.",
    location: "SE 100"
  }
]

const Sigs = () => {

  return (
    <>
      <GlobalNavbar />
      <div className="sigs">
        <section className="h-full pt-36 lg:pb-24 bg-landing-secondary">
          <div className="flex flex-col content-end">
            <h1 className="text-[72px] text-center font-normal tracking-wider text-tertiary font-bebas">Special Interest Groups</h1>
            <p className="px-80 text-white font-montserrat tracking-wider text-left text-[21px] leading-10">
              ACM&apos;s Special Interest Groups (SIGs) represent major areas of
              computing, addressing the interests of technical communities that
              drive innovation. SIGs offer a wealth of conferences, publications
              and activities focused on specific computing sub-disciplines. They
              enable members to share expertise, discovery and best practices.
            </p>
          </div>
        </section>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 280"
          className="home__wave"
        >
          <path
            fill="#00e1bfcc"
            fillOpacity="1"
            d="M0,256L80,224C160,192,320,128,480,122.7C640,117,800,171,960,192C1120,213,1280,203,1360,197.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
        <section>
          <ul className="mx-28 font-montseratt tracking-wider text-[20px]">
            <li className="mx-60">
              <SigTopic
                title="Software Engineering (SWE)"
                description="The ACM Special Interest Group on Software Engineering seeks to improve our ability to engineer software by stimulating interaction among practitioners, researchers, and educators; by fostering the professional development of software engineers; and by representing software engineers to professional, legal, and political entities."
                events={placeholderEvents}
              />
            </li>
          </ul>
        </section>
      </div>
      <GlobalFooter />
    </>

  );
};

export default Sigs;