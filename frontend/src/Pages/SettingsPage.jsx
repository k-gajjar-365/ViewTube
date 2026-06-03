import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
   changePassword,
   updateAvatar,
   updateCoverImage,
   updateProfile,
} from "../api/user.api";
import { useAuth } from "../Context/AuthContext";
import PageHeader from "../Components/page/PageHeader";
import Button from "../Components/ui/Button";
import { FieldError, Input, Label } from "../Components/ui/FormField";
import { getErrorMessage } from "../lib/error";

const profileSchema = z.object({
   fullName: z.string().min(2, "Full name is required"),
   email: z.string().email("Enter a valid email"),
});

const passwordSchema = z.object({
   oldPassword: z.string().min(6, "Current password is required"),
   newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

const SettingsPage = () => {
   const { user, refreshMe } = useAuth();

   const profileForm = useForm({
      resolver: zodResolver(profileSchema),
      values: {
         fullName: user?.fullName || "",
         email: user?.email || "",
      },
   });

   const passwordForm = useForm({
      resolver: zodResolver(passwordSchema),
      defaultValues: {
         oldPassword: "",
         newPassword: "",
      },
   });

   const profileMutation = useMutation({
      mutationFn: updateProfile,
      onSuccess: async () => {
         await refreshMe();
         toast.success("Profile updated");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const passwordMutation = useMutation({
      mutationFn: changePassword,
      onSuccess: () => {
         passwordForm.reset();
         toast.success("Password changed");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const avatarMutation = useMutation({
      mutationFn: (file) => {
         const formData = new FormData();
         formData.append("avatar", file);
         return updateAvatar(formData);
      },
      onSuccess: async () => {
         await refreshMe();
         toast.success("Avatar updated");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const coverMutation = useMutation({
      mutationFn: (file) => {
         const formData = new FormData();
         formData.append("coverImage", file);
         return updateCoverImage(formData);
      },
      onSuccess: async () => {
         await refreshMe();
         toast.success("Cover image updated");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   return (
      <section className="space-y-5">
         <PageHeader
            title="Settings"
            subtitle="Update account details, password, and profile visuals."
         />

         <div className="grid grid-cols-1 gap-4 desktop:grid-cols-2">
            <div className="rounded-card border border-app-border bg-app-sidebar p-4">
               <h2 className="text-base font-medium text-white">Profile Details</h2>
               <form
                  className="mt-3 space-y-3"
                  onSubmit={profileForm.handleSubmit((values) =>
                     profileMutation.mutate(values)
                  )}
               >
                  <div>
                     <Label htmlFor="fullName">Full Name</Label>
                     <Input id="fullName" {...profileForm.register("fullName")} />
                     <FieldError message={profileForm.formState.errors.fullName?.message} />
                  </div>
                  <div>
                     <Label htmlFor="email">Email</Label>
                     <Input id="email" type="email" {...profileForm.register("email")} />
                     <FieldError message={profileForm.formState.errors.email?.message} />
                  </div>
                  <Button type="submit" loading={profileMutation.isPending}>
                     Save Profile
                  </Button>
               </form>
            </div>

            <div className="rounded-card border border-app-border bg-app-sidebar p-4">
               <h2 className="text-base font-medium text-white">Change Password</h2>
               <form
                  className="mt-3 space-y-3"
                  onSubmit={passwordForm.handleSubmit((values) =>
                     passwordMutation.mutate(values)
                  )}
               >
                  <div>
                     <Label htmlFor="oldPassword">Current Password</Label>
                     <Input
                        id="oldPassword"
                        type="password"
                        {...passwordForm.register("oldPassword")}
                     />
                     <FieldError
                        message={passwordForm.formState.errors.oldPassword?.message}
                     />
                  </div>
                  <div>
                     <Label htmlFor="newPassword">New Password</Label>
                     <Input
                        id="newPassword"
                        type="password"
                        {...passwordForm.register("newPassword")}
                     />
                     <FieldError
                        message={passwordForm.formState.errors.newPassword?.message}
                     />
                  </div>
                  <Button type="submit" loading={passwordMutation.isPending}>
                     Update Password
                  </Button>
               </form>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4 desktop:grid-cols-2">
            <div className="rounded-card border border-app-border bg-app-sidebar p-4">
               <h2 className="text-base font-medium text-white">Avatar</h2>
               <input
                  type="file"
                  accept="image/*"
                  className="mt-3 min-h-11 w-full rounded-card border border-app-border bg-app-card px-3 py-2 text-sm text-white"
                  onChange={(event) => {
                     const file = event.target.files?.[0];
                     if (!file) return;
                     avatarMutation.mutate(file);
                  }}
               />
               <div className="mt-3">
                  <Button variant="ghost" loading={avatarMutation.isPending}>
                     Upload Avatar
                  </Button>
               </div>
            </div>

            <div className="rounded-card border border-app-border bg-app-sidebar p-4">
               <h2 className="text-base font-medium text-white">Cover Image</h2>
               <input
                  type="file"
                  accept="image/*"
                  className="mt-3 min-h-11 w-full rounded-card border border-app-border bg-app-card px-3 py-2 text-sm text-white"
                  onChange={(event) => {
                     const file = event.target.files?.[0];
                     if (!file) return;
                     coverMutation.mutate(file);
                  }}
               />
               <div className="mt-3">
                  <Button variant="ghost" loading={coverMutation.isPending}>
                     Upload Cover
                  </Button>
               </div>
            </div>
         </div>
      </section>
   );
};

export default SettingsPage;

