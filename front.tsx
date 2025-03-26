import AboutUsImage from "../assets/images/about-us.png";
import GlobalFooter from "./react/components/GlobalFooter";
import GlobalNavbar from "./react/components/GlobalNavbar";
function Front() {
	return (
		<>
			<GlobalNavbar />
			<div className="flex top-16 flex-col gap-16 py-8 w-full opacity-80 bg-landing max-h-max">
				<p>hi</p>
				{/* <Button onPress={onLogout}>logout for testing</Button> */}
			</div>
			<div className="flex z-0 gap-16">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1440 320"
					role="img"
					aria-label="title"
				>
					<path
						fill="#00e1bf"
						fillOpacity="0.8"
						d="M0,256L80,224C160,192,320,128,480,122.7C640,117,800,171,960,192C1120,213,1280,203,1360,197.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
					/>
				</svg>
			</div>

			<section className="mx-24">
				<h1 className="pb-16 text-4xl font-bold text-center text-tertiary">
					About Us
				</h1>
				<div className="gap-x-24 columns-2">
					<div className="container-2xl">
						<p className="text-xl text-tertiary">
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
						<img src={AboutUsImage} aria-label="title" />
					</div>
				</div>
			</section>
			<section className="mx-24">
				<h1 className="pt-16 pb-16 text-4xl font-bold text-center text-tertiary">
					Goals
				</h1>
				<div className="grid-rows-2 gap-x-24 columns-2">
					<div className="container-2xl">
						<div>
							<p className="text-xl text-tertiary">yes</p>
						</div>
						<div>
							<p className="text-xl text-tertiary">yes</p>
						</div>

						<div>
							<p className="text-xl text-tertiary">yes</p>
						</div>
						<div>
							<p className="text-xl text-tertiary">yes</p>
						</div>
					</div>
				</div>
			</section>
			<GlobalFooter />
		</>
	);
}

export default Front;
