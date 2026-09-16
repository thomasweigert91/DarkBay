"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  UserIcon,
  Mail01Icon,
  LockPasswordIcon,
  ViewIcon,
  ViewOffSlashIcon,
  Loading01Icon,
  AlertCircleIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    setErrorMessage(null);
    startTransition(async () => {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        setErrorMessage(error.message || "Sign up failed. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Top brand header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25">
            <HugeiconsIcon icon={ShoppingBag01Icon} className="size-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Join Dark<span className="text-indigo-400">Bay</span> to start
            bidding and selling
          </p>
        </div>

        {/* Registration Card */}
        <Card className="border-gray-800 bg-gray-900/90 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-6">
              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-sm text-red-300">
                  <HugeiconsIcon
                    icon={AlertCircleIcon}
                    className="size-5 shrink-0 text-red-400"
                  />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name field */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-sm font-medium text-gray-200">
                      Full Name
                    </FieldLabel>
                    <FieldContent className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <HugeiconsIcon icon={UserIcon} className="size-4" />
                      </div>
                      <Input
                        {...field}
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        disabled={isPending}
                        className="pl-10 text-white border-gray-700 bg-gray-800/60 placeholder:text-gray-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/30"
                      />
                    </FieldContent>
                    {errors.name && (
                      <FieldError className="mt-1 text-red-400 text-xs">
                        {errors.name.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Email field */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-sm font-medium text-gray-200">
                      Email Address
                    </FieldLabel>
                    <FieldContent className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                      </div>
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        disabled={isPending}
                        className="pl-10 text-white border-gray-700 bg-gray-800/60 placeholder:text-gray-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/30"
                      />
                    </FieldContent>
                    {errors.email && (
                      <FieldError className="mt-1 text-red-400 text-xs">
                        {errors.email.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Password field */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-sm font-medium text-gray-200">
                      Password
                    </FieldLabel>
                    <FieldContent className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <HugeiconsIcon
                          icon={LockPasswordIcon}
                          className="size-4"
                        />
                      </div>
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        disabled={isPending}
                        className="pl-10 pr-10 text-white border-gray-700 bg-gray-800/60 placeholder:text-gray-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                          className="size-4"
                        />
                      </button>
                    </FieldContent>
                    {errors.password && (
                      <FieldError className="mt-1 text-red-400 text-xs">
                        {errors.password.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Confirm Password field */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-sm font-medium text-gray-200">
                      Confirm Password
                    </FieldLabel>
                    <FieldContent className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <HugeiconsIcon
                          icon={LockPasswordIcon}
                          className="size-4"
                        />
                      </div>
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        disabled={isPending}
                        className="pl-10 pr-10 text-white border-gray-700 bg-gray-800/60 placeholder:text-gray-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/30"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={
                            showConfirmPassword ? ViewOffSlashIcon : ViewIcon
                          }
                          className="size-4"
                        />
                      </button>
                    </FieldContent>
                    {errors.confirmPassword && (
                      <FieldError className="mt-1 text-red-400 text-xs">
                        {errors.confirmPassword.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 transition-all cursor-pointer h-10"
              >
                {isPending ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading01Icon}
                      className="size-4 animate-spin"
                    />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 border-t border-gray-800/80 bg-gray-900/40 px-6 py-4 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3" />
                <span>Back to marketplace</span>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
