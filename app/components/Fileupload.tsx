"use client";

import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Divide, Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
   onSucess: (res: IKUploadResponse) => void
   onProgress?: (progress: number) => void
   fileType?: "image" | "video"
}

export default function FileUpload({
   onSucess,
   onProgress,
   fileType = "image"
}: FileUploadProps) {


   const [uploading, setUploading] = useState(false);
   const [error, setError] = useState<String | null>(null)

   const onError = (err: { message: String }) => {
      console.log("Error", err);
      setError(err.message)
      setUploading(false)
   };

   const handleSucess = (response: IKUploadResponse) => {
      console.log("Success", response);
      setUploading(false)
      setError(null)
      onSucess(response)
   };

   const handleProgress = (evt: ProgressEvent) => {
      if (evt.lengthComputable && onProgress) {
         const percentComplete = (evt.loaded / evt.total) * 100;
         onProgress(Math.round(percentComplete))
      }
   };

   const handleStartUpload = () => {
      setUploading(true)
      setError(null)
   };

   const validateFile = (file: File) => {
      if (fileType === "video") {
         if (!file.type.startsWith("video/")) {
            setError("Invalid file type. Please upload a video file")
            return false;
         }
         if (file.size > 100 * 1024 * 1024) {
            setError("Video size must be lessthan 100MB");
            return false;
         }
      } else {
         const validTypes = ["image/jpeg", "image/png", "image/webp"];

         if (!validTypes.includes(file.type)) {
            setError("Invalid file type. Please upload a image file")
            return false;
         }
         if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be lessthan 5mb");
            return false;
         }
      }

      return false;
   }

   return (
      <div className="space-y-2">
         <IKUpload
            fileName={fileType === "video" ? "video.mp4" : "image.jpg"}
            useUniqueFileName={true}
            validateFile={validateFile}
            folder={fileType === "video" ? "/videos" : "/images"}
            accept={fileType === "video" ? "video/*" : "image/*"}
            onError={onError}
            onSuccess={handleSucess}
            onUploadProgress={handleProgress}
            onUploadStart={handleStartUpload}
            className="bg-blue-500 text-white p-2 rounded-md"
         />

         {
            uploading && (
               <div className="flex items-center gap-2">
                  <Loader2 size={24} />
                  <span>uploading...</span>
               </div>
            )
         }
         {error && <div className="text-red-500">{error}</div>}
      </div>
   );
}
