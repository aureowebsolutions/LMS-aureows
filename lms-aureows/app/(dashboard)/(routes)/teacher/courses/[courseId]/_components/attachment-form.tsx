"use client"
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import Image from 'next/image'
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from '@/components/file-upload';



interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[]};
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
});

export const AttachmentForm =({
    initialData,
    courseId
}: AttachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    const toogleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course Updated");
            toogleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }finally{
            setDeletingId(null);
        }
    }

    return(
        <div className="p-4 mt-6 border rounded-md bg-slate-100">
            <div className="flex items-center justify-between font-medium">
                Course attachment
                <Button onClick={toogleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )} 
                    {!isEditing && (
                        <>
                        <PlusCircle className="w-4 h-4 mr-2"/>
                            Add a file
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                <>
                   {initialData.attachments.length === 0 &&(
                    <p className="mt-2 text-sm italic text-slate-500">
                        No attanchments yet
                    </p>
                   )} 
                   {initialData.attachments.length > 0 && (
                    <div className="space-y-2">
                        {initialData.attachments.map((attachment) => (
                            <div key={attachment.id}
                            className="flex items-center w-full p-3 border rounded-md bg-sky-100 border-sky-200 text-sky-700">
                                <File className="flex-shrink-0 w-4 h-4 mr-2"/>
                                <p className="text-xs line-clamp-1">
                                    {attachment.name}
                                </p>
                                {deletingId === attachment.id && (
                                    <div>
                                       <Loader2 className="w-4 h-4 animate-spin"/> 
                                    </div>
                                )}
                                {deletingId !== attachment.id && (
                                    <button className="ml-auto hover:opacity-75">
                                       <X onClick= {() => onDelete(attachment.id)} className="w-4 h-4"/> 
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                   )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endpoint ="courseAttachment"
                        onChange={(url) => {
                            if(url){
                                onSubmit({url: url});
                            }
                        }}
                    />
                    <div className="mt-4 text-xs text-muted-foreground">
                        Add anything your students might need to complete the course.
                    </div>
                </div>
            )}
        </div>
    )
}