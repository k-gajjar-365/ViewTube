import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { register as registerRequest } from "../api/auth.api";
import { getErrorMessage } from "../lib/error";
import { FieldError, Input, Label } from "../Components/ui/FormField";
import Button from "../Components/ui/Button";
import AppLogo from "../Components/layout/AppLogo";

const schema = z
   .object({
      fullName: z.string().min(2, "Full name is required"),
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Enter a valid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(6, "Confirm your password"),
      avatar: z
         .any()
         .refine(
            (files) => files instanceof FileList && files.length > 0,
            "Avatar image is required"
         ),
      coverImage: z.any().optional(),
   })
   .refine((values) => values.password === values.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
   });

const SignupPage = () => {
   const navigate = useNavigate();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(schema),
      defaultValues: {
         fullName: "",
         username: "",
         email: "",
         password: "",
         confirmPassword: "",
      },
   });

   const signupMutation = useMutation({
      mutationFn: registerRequest,
      onSuccess: () => {
         toast.success("Account created. Please log in.");
         navigate("/login", { replace: true });
      },
      onError: (error) => toast.error(getErrorMessage(error, "Signup failed")),
   });

   return (
      <main className="flex min-h-screen items-center justify-center bg-app-bg px-4 py-8">
         <section className="w-full max-w-lg rounded-card border border-app-border bg-app-sidebar p-6">
            <div className="mb-6 flex justify-center">
               <AppLogo />
            </div>

            <h1 className="text-center text-2xl font-semibold text-white">Sign up</h1>
            <p className="mt-1 text-center text-sm text-app-text-secondary">
               Create your channel and start uploading.
            </p>

            <form
               className="mt-6 grid grid-cols-1 gap-4 tablet:grid-cols-2"
               onSubmit={handleSubmit((values) => {
                  const formData = new FormData();
                  formData.append("fullName", values.fullName);
                  formData.append("username", values.username);
                  formData.append("email", values.email);
                  formData.append("password", values.password);
                  formData.append("avatar", values.avatar[0]);

                  if (
                     values.coverImage instanceof FileList &&
                     values.coverImage.length > 0
                  ) {
                     formData.append("coverImage", values.coverImage[0]);
                  }

                  signupMutation.mutate(formData);
               })}
            >
               <div className="tablet:col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Your full name" {...register("fullName")} />
                  <FieldError message={errors.fullName?.message} />
               </div>

               <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="yourhandle" {...register("username")} />
                  <FieldError message={errors.username?.message} />
               </div>

               <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  <FieldError message={errors.email?.message} />
               </div>

               <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                     id="password"
                     type="password"
                     placeholder="Create password"
                     {...register("password")}
                  />
                  <FieldError message={errors.password?.message} />
               </div>

               <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                     id="confirmPassword"
                     type="password"
                     placeholder="Repeat password"
                     {...register("confirmPassword")}
                  />
                  <FieldError message={errors.confirmPassword?.message} />
               </div>

               <div>
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input id="avatar" type="file" accept="image/*" {...register("avatar")} />
                  <FieldError message={errors.avatar?.message} />
               </div>

               <div>
                  <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                  <Input
                     id="coverImage"
                     type="file"
                     accept="image/*"
                     {...register("coverImage")}
                  />
                  <FieldError message={errors.coverImage?.message} />
               </div>

               <div className="tablet:col-span-2">
                  <Button
                     type="submit"
                     className="w-full"
                     loading={signupMutation.isPending}
                  >
                     Sign up
                  </Button>
               </div>
            </form>

            <p className="mt-5 text-center text-sm text-app-text-secondary">
               Already have an account?{" "}
               <Link to="/login" className="text-app-accent hover:text-app-accent-hover">
                  Log in
               </Link>
            </p>
         </section>
      </main>
   );
};

export default SignupPage;

