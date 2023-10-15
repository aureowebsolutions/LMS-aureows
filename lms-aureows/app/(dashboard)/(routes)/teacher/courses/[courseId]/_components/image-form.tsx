"use client"
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import Image from 'next/image'
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import { FileUpload } from '@/components/file-upload';



interface ImageFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
});

export const ImageForm =({
    initialData,
    courseId
}: ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toogleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course Updated");
            toogleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return(
        <div className="p-4 mt-6 border rounded-md bg-slate-100">
            <div className="flex items-center justify-between font-medium">
                Course image
                <Button onClick={toogleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )} 
                    {!isEditing && !initialData.imageUrl && (
                        <>
                        <PlusCircle className="w-4 h-4 mr-2"/>
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                        <Pencil className="w-4 h-4 mr-2"/>
                            Edit image
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center rounded-md h-60 bg-slate-200">
                        <ImageIcon className="w-10 h-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative mt-2 aspect-video ">
                        <Image 
                            alt = "Upload"
                            fill
                            className = "object-cover rounded-md"
                            src = { initialData.imageUrl }
                        />
                        current image
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endpoint ="courseImage"
                        onChange={(url) => {
                            if(url){
                                onSubmit({imageUrl: url});
                            }
                        }}
                    />
                    <div className="mt-4 text-xs text-muted-foreground">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )
}