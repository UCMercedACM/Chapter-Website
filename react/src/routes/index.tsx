import { Link } from "react-router";

import { Navbar } from "@/components/app/navbar";
import { Button } from "@/components/ui/button";

function Index() {
  return (
    <>
      <Navbar />

      <section className="container py-16 mx-auto md:py-28 px-18">
        <div className="flex flex-col items-center md:flex-row">
          <div className="mb-12 font-bold leading-8 text-center md:mb-0 md:w-1/2 lg:w-2/5">
            <h2 className="mb-6 text-5xl">Where Theory and Practice Fuse</h2>
            <p className="mb-6 text-lg">
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

          <div className="md:pl-12 md:w-1/2 lg:pl-20 lg:w-3/5">
            <img
              src="https://placehold.co/500x250/6366f1/ffffff?text=placeholder"
              alt="placeholder"
              className="w-full rounded-md shadow-2xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export { Index };
