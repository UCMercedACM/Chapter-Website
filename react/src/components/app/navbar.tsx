import Logo from "@/assets/logo-48x-48x.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router";
import {
	doesSessionExist,
	useSessionContext,
} from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/session";
import Session from "supertokens-auth-react/recipe/session";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemProps {
	href: string;
	label: string;
}

interface AboutMenuProps {
	items: ItemProps[];
}

const navItems: ItemProps[] = [
	{ href: "/events", label: "Events" },
	{ href: "/projects", label: "Projects" },
	{ href: "/resources", label: "Resources" },
	{ href: "/auth/login", label: "Member Login" }, // separate button
];

const aboutItems: ItemProps[] = [
	{ href: "/about-us/overview", label: "Overview" },
	{ href: "/about-us/sigs", label: "SIGs" },
	{ href: "/about-us/leadership", label: "Leadership" },
	{ href: "/about-us/contact", label: "Contact" },
];

const LINK_STYLES = "text-sm font-medium transition-colors hover:text-primary";

function AboutMenu({ items }: AboutMenuProps) {
	const [openDropdown, setOpenDropdown] = useState(false);

	return (
		<DropdownMenu
			open={openDropdown}
			onOpenChange={() => setOpenDropdown(false)}
		>
			<DropdownMenuTrigger
				onMouseEnter={() => setOpenDropdown(true)}
				className={LINK_STYLES}
			>
				About
			</DropdownMenuTrigger>
			<DropdownMenuContent onMouseLeave={() => setOpenDropdown(false)}>
				{items.map((item) => (
					<DropdownMenuItem key={item.label}>
						<NavLink to={item.href} className={LINK_STYLES}>
							{item.label}
						</NavLink>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLogged, setIsLogged] = useState(false); // pls optimize state?

	useEffect(() => {
		const checkLogged = async () => {
			if (await doesSessionExist()) {
				return setIsLogged(true);
			}
		};
		checkLogged();
	});

	return (
		<nav className="flex justify-between items-center px-14 w-full bg-opacity-80 md:px-16 h-18 shadow-[0px_10px_30px_0px_rgba(112,144,176,0.20)]">
			<section className="justify-center items-center">
				<NavLink to="/" className="">
					<img src={Logo} alt="ACM @ UC Merced Logo" loading="lazy" />
				</NavLink>
			</section>

			{/* Desktop Navigation */}
			<section className="hidden items-center space-x-7 md:flex">
				{/* <AboutMenu props={aboutItems}/> */}
				<AboutMenu items={aboutItems} />
				{navItems.map((item) => (
					<NavLink key={item.label} to={item.href} className={LINK_STYLES}>
						{item.label}
					</NavLink>
				))}
				<Button asChild>
					<NavLink to="/auth">{isLogged ? "Dashboard" : "Login"}</NavLink>
				</Button>
			</section>

			{/* Mobile Navigation */}
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild className="md:hidden">
					<Button variant="outline" size="icon">
						<Menu className="w-6 h-6" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="top">
					<section className="flex flex-col pt-6 space-y-4">
						<AboutMenu items={aboutItems} />
						{navItems.map((item) => (
							<NavLink
								key={item.label}
								to={item.href}
								className={LINK_STYLES}
								onClick={() => setIsOpen(false)}
							>
								{item.label}
							</NavLink>
						))}
					</section>
				</SheetContent>
			</Sheet>
		</nav>
	);
}
