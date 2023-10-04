"use client"

import * as z from "zod";
import axios from  "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import router, { useRouter } from "next/router";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";


const formSchema = z.object({
    title: z.string().min(1,{
        message: "Title required",
    }),
});

const CreatePage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });

    const { isSubmitting , isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/course", values);
            router.push(`/teacher/courses/${response.data.id}`)
        } catch  {
            toast.error("Something went wrong");
        }
    }
    
    return ( 
        <div className="flex max-w-5xl p-6 mx-auto md:items-center md:justify-center">
            <div>
                <h1 className="text-2xl">Name your Courses</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your course? Don&apos;t worry,
                    you can change this later.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-8 space-y-8">
                        <FormField control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Course Title
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="text" disabled={isSubmitting}
                                                placeholder="e.g. 'Advance Web Development'"
                                                {...field}/>
                                            </FormControl>
                                            <FormDescription>
                                                What will you teach in this course?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Link href="/">
                                    <Button type="button" variant="ghost">
                                            Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={!isValid || isSubmitting}>
                                    Continue
                                </Button>
                            </div>
                    </form>
                </Form>
            </div>
            
        </div>
     );
}
 
export default CreatePage;