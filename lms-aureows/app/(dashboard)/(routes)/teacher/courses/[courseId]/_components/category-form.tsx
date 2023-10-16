"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";



interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: {label: string, value: string}[];
}

const formSchema = z.object({
    categoryId: z.string().min(1),
});

export const CategoryForm =({
    initialData,
    courseId,
    options,
}: CategoryFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toogleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        }
    });

    const { isSubmitting, isValid} = form.formState;

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

    const selectedOption = options.find((option) => option.value === initialData.categoryId);

    return(
        <div className="p-4 mt-6 border rounded-md bg-slate-100">
            <div className="flex items-center justify-between font-medium">
                Course category
                <Button onClick={toogleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="w-4 h-4 mr-2"/>
                            Edit category
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.categoryId && "text-slate-500 italic"
                )}>
                    {selectedOption?.label || "No category"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-4 space-y-4">
                        <FormField 
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Combobox 
                                    options={...options}
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting}
                            type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}