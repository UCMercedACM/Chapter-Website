import Logo from "@/assets/logo-48x-48x.png";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router";

function Navbar() {
	return (
		<header className="w-full bg-opacity-80 shadow-[0px_10px_30px_0px_rgba(112,144,176,0.20)]">
			<section className="flex flex-row justify-between items-center py-3 px-16">
				<section>
					<NavLink to="/">
						<img src={Logo} alt="ACM @ UC Merced Logo" loading="lazy" />
					</NavLink>
				</section>
				<section>
					<NavigationMenu>
						<NavigationMenuList className="gap-4">
							<NavigationMenuItem>
								<NavLink to="/events">
									<NavigationMenuLink>Events</NavigationMenuLink>
								</NavLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavLink to="/projects">
									<NavigationMenuLink>Projects</NavigationMenuLink>
								</NavLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavLink to="/sigs">
									<NavigationMenuLink>SIGs</NavigationMenuLink>
								</NavLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavLink to="/register">
									<NavigationMenuLink>Register</NavigationMenuLink>
								</NavLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</section>
			</section>
		</header>
	);
}

export { Navbar };
