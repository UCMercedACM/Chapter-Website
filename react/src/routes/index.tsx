import { ChevronDown } from "lucide-react";
import { Link } from "react-router";

import { Navbar } from "@/components/app/navbar";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface MenuAnchorProps {
  targetId: string;
  className?: string;
}

function MenuAnchorButton({ targetId, className }: Readonly<MenuAnchorProps>) {
  const handleClick = () => {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView();
    }
  };
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className={cn(
        "group size-24 bg-transparent hover:bg-transparent opacity-10 hover:opacity-75 text-gray-300 hover:text-gray-500 transition-colors duration-200 ease-in-out",
        className,
      )}
      onClick={handleClick}
      aria-label="Scroll to next section"
    >
      <Link to={`#${targetId}`} aria-label="Scroll to next section">
        <ChevronDown className="size-24 animate-in fade-in" />
      </Link>
    </Button>
  );
}
function Index() {
  return (
    <>
      <Navbar />

      {/* Hero section */}
      <section className="container py-8 mx-auto px-18 md:py-18">
        <div className="flex flex-col items-center md:flex-row">
          <div className="mb-12 font-bold leading-8 text-center md:mb-0 md:w-1/2 lg:w-2/5">
            <h2 className="px-8 mb-6 text-3xl md:px-0 md:text-5xl">
              Where Theory and Practice Fuse
            </h2>
            <p className="px-12 mb-6 text-lg md:px-0">
              Central Valley's Flagship Computer Science Community at UC Merced
            </p>
            <Button
              variant="default"
              size="xl"
              className="text-lg outline-black bg-primary-alt hover:bg-primary-alt/90 hover:outline-solid"
              asChild
            >
              <Link to="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                Join Today!
              </Link>
            </Button>
          </div>

          <div className="invisible md:visible md:pl-12 md:w-1/2 lg:pl-20 lg:w-3/5">
            <img
              src="https://placehold.co/500x250/6366f1/ffffff?text=placeholder"
              alt="placeholder"
              className="w-full rounded-md shadow-2xl"
            />
          </div>
        </div>

        <div className="flex flex-col items-center md:pt-7">
          <MenuAnchorButton targetId="about-section" />
        </div>
      </section>

      {/* Introduction section */}
      <section
        id="about-section"
        className="container py-8 mx-auto md:py-12 px-18"
      >
        <div className="flex flex-col items-center md:flex-row">
          <div className="mb-12 md:mb-0 md:w-1/2 lg:w-2/5">
            <img
              src="https://placehold.co/600x350/6366f1/ffffff?text=placeholder"
              alt="placeholder"
              className="w-full rounded-md shadow-2xl"
            />
          </div>

          <div className="md:w-1/2 lg:pl-28 lg:w-3/5 md:pl-22">
            <div className="leading-8 text-left">
              <h2 className="mb-6 text-3xl font-bold">
                Providing professional and community expertise in Computer
                Science to you
              </h2>
              <p className="mb-6 font-medium text-md">
                ACM at UC Merced is an student-run computing organization that
                fosters an community environment where individuals interested in
                Computer Science can discuss, educate, and collaborate. We
                strive to create and maintain and community where students are
                prepared for practical CS skills and knowledge through
                collaboration, workshops, seminars, and passion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIGs Intro */}
      <section className="container py-16 px-1 mx-auto md:py-28">
        <div className="flex flex-col items-center">
          <h2 className="mb-6 text-3xl font-bold">Student Interest Groups</h2>
          <p className="mb-8 font-medium text-center text-md">
            ACM @ UC Merced has 6 groups, which all independently host workshops
            and other events to support the goal.
          </p>
          <Button
            variant="default"
            size="xl"
            className="text-lg outline-black bg-primary-alt hover:bg-primary-alt/90 hover:outline-solid"
            asChild
          >
            <Link to="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              Discover More
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ section */}
      <section className="container py-16 px-1 mx-auto md:py-28">
        <div className="flex flex-col gap-y-12 items-center">
          <h2 className="mb-6 text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            className="w-1/3 md:w-1/2 scale-130"
            collapsible
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}

export { Index };
