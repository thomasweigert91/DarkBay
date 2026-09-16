"use client";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { buttonVariants } from "@/components/ui/button";
import { logoutAction } from "../services/auctionsAuth";

interface HeaderProps {
	isAuthenticated: boolean
}
export const Header = ({ isAuthenticated }: HeaderProps) => {

	return (
		<header className="flex items-center justify-between p-4 bg-gray-800 text-white">
			<h1 className="font-bold text-2xl uppercase">Dark Bay</h1>
			<nav className="flex gap-4">
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem className="m-1">
							<NavigationMenuLink
								href="/"
								className={buttonVariants({ variant: "secondary" })}
							>
								Home
							</NavigationMenuLink>
						</NavigationMenuItem>
						{isAuthenticated ? (
							<form action={logoutAction}>
								<button type="submit" className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Log Out</button>
							</form>

						) : (
							<NavigationMenuItem className="m-1">
								<NavigationMenuTrigger
									className={buttonVariants({ variant: "secondary" })}
								>
									Account
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<NavigationMenuLink href="/login">Log In</NavigationMenuLink>
									<NavigationMenuLink href="/register">Sign Up</NavigationMenuLink>
								</NavigationMenuContent>
							</NavigationMenuItem>
						)}

					</NavigationMenuList>
				</NavigationMenu>
			</nav>
		</header>
	);
};
