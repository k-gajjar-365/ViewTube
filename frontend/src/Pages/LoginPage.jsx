import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { login } from "../api/auth.api";
import { useAuth } from "../Context/AuthContext";
import { getErrorMessage } from "../lib/error";
import { FieldError, Input, Label } from "../Components/ui/FormField";
import Button from "../Components/ui/Button";
import AppLogo from "../Components/layout/AppLogo";

const schema = z.object({
   email: z.string().email("Enter a valid email address"),
   password: z.string().min(2, "Password must be at least 6 characters"),
});

const LoginPage = () => {
   const { saveSession } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();
   const fromPath = location.state?.from?.pathname || "/";

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(schema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const loginMutation = useMutation({
      mutationFn: login,
      onSuccess: (sessionPayload) => {
         saveSession(sessionPayload);
         toast.success("Welcome back");
         navigate(fromPath, { replace: true });
      },
      onError: (error) => toast.error(getErrorMessage(error, "Login failed")),
   });

   return (
      <main className="flex min-h-screen items-center justify-center bg-app-bg px-4">
         <section className="w-full max-w-md rounded-card border border-app-border bg-app-sidebar p-6">
            <div className="mb-6 flex justify-center">
               <AppLogo />
            </div>

            <h1 className="text-center text-2xl font-semibold text-white">Log in</h1>
            <p className="mt-1 text-center text-sm text-app-text-secondary">
               Access your channel and videos.
            </p>

            <form
               className="mt-6 space-y-4"
               onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
            >
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
                     placeholder="Enter your password"
                     {...register("password")}
                  />
                  <FieldError message={errors.password?.message} />
               </div>

               <Button type="submit" className="w-full" loading={loginMutation.isPending}>
                  Log in
               </Button>
            </form>

            <p className="mt-5 text-center text-sm text-app-text-secondary">
               New to PLAY?{" "}
               <Link to="/signup" className="text-app-accent hover:text-app-accent-hover">
                  Sign up
               </Link>
            </p>
         </section>
      </main>
   );
};

export default LoginPage;

