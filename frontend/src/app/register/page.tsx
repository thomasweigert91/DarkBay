import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/lib/services/auctionsAuth";

export default function RegisterPage() {
	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Create an account
						</h1>
						<form action={registerAction} className="w-full max-w-sm">
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="name">Your Name</FieldLabel>
									<Input type="text" name="name" id="name" placeholder="name@company.com" />
								</Field>
								<Field>
									<FieldLabel htmlFor="email">Your email</FieldLabel>
									<Input type="email" name="email" id="email" placeholder="name@company.com" />
								</Field>
								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input type="password" name="password" id="password" placeholder="••••••••" />
								</Field>
								<Button type="submit" className="w-full">Submit</Button>
							</FieldGroup>
						</form>
					</div>
				</div>
			</div>
		</section >
	);
}