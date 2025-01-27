import {
	SiDiscord,
	SiGithub,
	SiInstagram,
} from "@icons-pack/react-simple-icons";
import { Link } from "@nextui-org/react";

function GlobalFooter() {
	return (
		<>
			<div>
				<svg
					className="z-0 w-full h-full"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1440 320"
					role="img"
					aria-label="title"
				>
					<path
						width="100"
						height="100"
						fill="#00e1bfcc"
						fillOpacity="1"
						d="M0,96L80,80C160,64,320,32,480,53.3C640,75,800,149,960,154.7C1120,160,1280,96,1360,64L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
					/>
				</svg>

				<div className="top-4 gap-16 py-8 w-full text-center opacity-80 bg-landing max-h-max">
					<div className="flex flex-row gap-x-12 justify-center">
						<div>
							<Link href="https://www.instagram.com/ucmacm/" color="foreground">
								{/*
                // @ts-ignore */}
								<SiInstagram size={32} />
							</Link>
						</div>
						<div>
							<Link href="https://github.com/UCMercedACM" color="foreground">
								{/*
                // @ts-ignore */}
								<SiGithub size={32} />
							</Link>
						</div>
						<div>
							<Link href="https://bit.ly/acm_ucm-discord" color="foreground">
								{/*
                // @ts-ignore */}
								<SiDiscord size={32} />
							</Link>
						</div>
					</div>
					<p className="pt-8">Copyright 2024</p>
					<p className="py-2">Written and programmed by ACM @ UCM</p>
				</div>
			</div>
		</>
	);
}

export default GlobalFooter;
