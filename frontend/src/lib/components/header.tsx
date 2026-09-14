"use client"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";


export const Header = () => {
	return (
		<header className="flex items-center justify-between p-4 bg-gray-800 text-white">
			<h1>Dark Bay</h1>
			<nav className="flex gap-4">
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink
								render={<Link href="/" />}
								className={buttonVariants({ variant: "secondary" })}
							>
								Home
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuTrigger className={buttonVariants({ variant: "secondary" })}>Account</NavigationMenuTrigger>
							<NavigationMenuContent>
								<NavigationMenuLink>Sign In</NavigationMenuLink>
								<NavigationMenuLink>Sign Up</NavigationMenuLink>
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</nav>
		</header>
	)
}