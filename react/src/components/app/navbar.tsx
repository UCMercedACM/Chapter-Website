import Logo from "@/assets/logo-48x-48x.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		// <nav className="flex justify-between items-center px-4 w-full h-16 border-b md:px-6">
		<nav className="flex justify-between items-center px-6 w-full bg-opacity-80 md:px-8 h-18 shadow-[0px_10px_30px_0px_rgba(112,144,176,0.20)]">
			{/* Logo */}
			<div className="flex items-center">
				<NavLink to="/" className="flex gap-2 items-center">
					<div className="flex justify-center items-center w-14 h-14">
						<img src={Logo} alt="ACM @ UC Merced Logo" loading="lazy" />
					</div>
					{/* <span className="font-semibold">Logo</span> */}
				</NavLink>
			</div>

			{/* Desktop Navigation */}
			<div className="hidden items-center space-x-6 md:flex">
				<NavLink
					to="/features"
					className="text-sm font-medium transition-colors hover:text-primary"
				>
					Features
				</NavLink>
				<NavLink
					to="/pricing"
					className="text-sm font-medium transition-colors hover:text-primary"
				>
					Pricing
				</NavLink>
				<NavLink
					to="/about"
					className="text-sm font-medium transition-colors hover:text-primary"
				>
					About
				</NavLink>
				<NavLink
					to="/contact"
					className="text-sm font-medium transition-colors hover:text-primary"
				>
					Contact
				</NavLink>
			</div>

			{/* Mobile Navigation */}
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild className="md:hidden">
					<Button variant="outline" size="icon">
						<Menu className="w-5 h-5" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="right">
					<div className="flex flex-col pt-6 space-y-4">
						<NavLink
							to="/features"
							className="text-sm font-medium transition-colors hover:text-primary"
							onClick={() => setIsOpen(false)}
						>
							Features
						</NavLink>
						<NavLink
							to="/pricing"
							className="text-sm font-medium transition-colors hover:text-primary"
							onClick={() => setIsOpen(false)}
						>
							Pricing
						</NavLink>
						<NavLink
							to="/about"
							className="text-sm font-medium transition-colors hover:text-primary"
							onClick={() => setIsOpen(false)}
						>
							About
						</NavLink>
						<NavLink
							to="/contact"
							className="text-sm font-medium transition-colors hover:text-primary"
							onClick={() => setIsOpen(false)}
						>
							Contact
						</NavLink>
					</div>
				</SheetContent>
			</Sheet>
		</nav>
	);
}
