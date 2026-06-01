import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { uploadVideo } from "../api/video.api";
import PageHeader from "../Components/page/PageHeader";
import Button from "../Components/ui/Button";
import { FieldError, Input, Label, TextArea } from "../Components/ui/FormField";
import { getErrorMessage } from "../lib/error";

const schema = z.object({
   title: z.string().min(3, "Title must be at least 3 characters"),
   description: z.string().min(10, "Description must be at least 10 characters"),
   videoFile: z
      .any()
      .refine(
         (files) => files instanceof FileList && files.length > 0,
         "Video file is required"
      ),
   thumbnail: z
      .any()
      .refine(
         (files) => files instanceof FileList && files.length > 0,
         "Thumbnail is required"
      ),
});

const UploadPage = () => {
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const [progress, setProgress] = useState(0);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(schema),
      defaultValues: {
         title: "",
         description: "",
      },
   });

   const uploadMutation = useMutation({
      mutationFn: (formData) =>
         uploadVideo(formData, (progressEvent) => {
            if (!progressEvent.total) return;
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentage);
         }),
      onSuccess: () => {
         toast.success("Video uploaded successfully");
         queryClient.invalidateQueries({ queryKey: ["dashboard", "videos"] });
         queryClient.invalidateQueries({ queryKey: ["videos"] });
         reset();
         setProgress(0);
         navigate("/my-content");
      },
      onError: (error) => {
         setProgress(0);
         toast.error(getErrorMessage(error, "Upload failed"));
      },
   });

   return (
      <section>
         <PageHeader
            title="Upload Video"
            subtitle="Share your next story with your audience."
         />

         <div className="max-w-2xl rounded-card border border-app-border bg-app-sidebar p-5">
            <form
               className="space-y-4"
               onSubmit={handleSubmit((values) => {
                  const formData = new FormData();
                  formData.append("title", values.title);
                  formData.append("description", values.description);
                  formData.append("videoFile", values.videoFile[0]);
                  formData.append("thumbnail", values.thumbnail[0]);
                  uploadMutation.mutate(formData);
               })}
            >
               <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Video title" {...register("title")} />
                  <FieldError message={errors.title?.message} />
               </div>

               <div>
                  <Label htmlFor="description">Description</Label>
                  <TextArea
                     id="description"
                     placeholder="Write a short description"
                     {...register("description")}
                  />
                  <FieldError message={errors.description?.message} />
               </div>

               <div>
                  <Label htmlFor="videoFile">Video File</Label>
                  <Input
                     id="videoFile"
                     type="file"
                     accept="video/*"
                     {...register("videoFile")}
                  />
                  <FieldError message={errors.videoFile?.message} />
               </div>

               <div>
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <Input
                     id="thumbnail"
                     type="file"
                     accept="image/*"
                     {...register("thumbnail")}
                  />
                  <FieldError message={errors.thumbnail?.message} />
               </div>

               {uploadMutation.isPending ? (
                  <div>
                     <div className="mb-1 flex justify-between text-xs text-app-text-secondary">
                        <span>Upload Progress</span>
                        <span>{progress}%</span>
                     </div>
                     <div className="h-2 w-full overflow-hidden rounded-full bg-app-card">
                        <div
                           className="h-full bg-app-accent transition-all"
                           style={{ width: `${progress}%` }}
                        />
                     </div>
                  </div>
               ) : null}

               <Button type="submit" loading={uploadMutation.isPending}>
                  Publish Video
               </Button>
            </form>
         </div>
      </section>
   );
};

export default UploadPage;

