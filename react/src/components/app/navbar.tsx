import Logo from "@/assets/logo-48x-48x.png";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";

function Navbar() {
	return (
		<header className="w-full bg-opacity-80 shadow-[0px_10px_30px_0px_rgba(112,144,176,0.20)]">
			<section className="flex flex-row justify-between items-center py-3 px-16">
				<section>
					<Link to="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
						<img src={Logo} alt="ACM @ UC Merced Logo" loading="lazy" />
					</Link>
				</section>
				<section>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link to="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
									<NavigationMenuLink>Documentation 2</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link to="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
									<NavigationMenuLink>Documentation</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</section>
			</section>
		</header>
	);
}

export { Navbar };
