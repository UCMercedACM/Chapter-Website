import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import { Aperture } from "lucide-react";

import { Link } from "react-router";

import { cn } from "@/lib/utils";

function Navbar() {
	return (
		<header className="w-full bg-opacity-80 shadow-[0px_10px_30px_0px_rgba(112,144,176,0.20)]">
			<section className="flex flex-row items-center m-auto max-w-6xl">
				<section className="py-3">
					<Aperture />
				</section>
				<NavigationMenu className="justify-end py-3 max-w-6xl">
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
		</header>
	);
}

export { Navbar };
