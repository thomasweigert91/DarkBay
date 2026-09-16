"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/services/auctionsAuth";



export default function LoginPage() {
	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Sign in to your account
						</h1>
						<form action={loginAction} className="space-y-4 md:space-y-6">
							<FieldGroup>
								<Field>
									<Label htmlFor="email" className="mb-2">Your email</Label>
									<Input type="email" name="email" id="email" placeholder="name@company.com" />
								</Field>
								<Field>
									<Label htmlFor="password" className="mb-2">Password</Label>
									<Input type="password" name="password" id="password" placeholder="••••••••" />
								</Field>
								<Button type="submit" className="w-full">
									Sign in
								</Button>
							</FieldGroup>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}