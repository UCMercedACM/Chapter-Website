import {
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from "@heroui/react";
import React from "react";
import ACMLogo from "../../assets/logo.png";
function GlobalNavbar() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const UCMACMLogo = () => (
		<img src={ACMLogo} width={76} height={76} alt="ACM Logo" />
	);
	// Come back later for the others
	const menuItems = [
		{
			title: "SIGs",
			path: "/sigs",
		},
		{
			title: "Events",
			path: "/events",
		},
	];
	return (
		<>
			<Navbar
				onMenuOpenChange={setIsMenuOpen}
				className="opacity-80 bg-landing"
				position="static"
			>
				<NavbarContent>
					<NavbarMenuToggle
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						className="lg:hidden"
					/>
					<NavbarBrand>
						<Link href="/">
							<UCMACMLogo />
						</Link>
					</NavbarBrand>
				</NavbarContent>

				<NavbarContent className="hidden gap-6 sm:flex" justify="center">
					{menuItems.map((item) => (
						<NavbarItem key={`${item}-${item.title}`}>
							<Link
								color="foreground"
								className="w-full"
								href={item.path}
								size="lg"
							>
								{item.title}
							</Link>
						</NavbarItem>
					))}
				</NavbarContent>
				<NavbarMenu>
					{menuItems.map((item) => (
						<NavbarMenuItem key={`${item}-${item.title}`}>
							<Link
								color="foreground"
								className="w-full"
								href={item.path}
								size="lg"
							>
								{item.title}
							</Link>
						</NavbarMenuItem>
					))}
				</NavbarMenu>
			</Navbar>
		</>
	);
}

export default GlobalNavbar;
