
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { PHOTO_API } from "@/services/api";



import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod"

import type { Photo } from "../types/photo";


const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters" }),
    description: z.any().optional(),
    cameraBrand: z.string().optional(),
    gearUsed: z.any().optional(),
    location: z.any().optional(),
    photo_taken: z.string().optional(),
    photo_path: z.file().optional(),
})


interface AddPhotoDialogProps {
    setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
    fetchPhotos: (page?: number, query?: string) => Promise<void>;
}


export default function AddPhotoDialog({ setPhotos, fetchPhotos }: AddPhotoDialogProps) { //research this!

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            cameraBrand: "",
            gearUsed: "",
            location: "",
            photo_taken: undefined,
            photo_path: undefined,
        },
    })

    // const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //     // Do something with the form values.
    //     // ✅ This will be type-safe and validated.
    //     setLoading(true)
    //     try {
    //         const payload = {
    //             ...values
    //         }
    //         const res = await fetch(PHOTO_API.create, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(payload)
    //         })
    //         const data = await res.json()
    //         console.log(res.status, data)
    //         if (res.ok) {
    //             setPhotos((prevPhotos: Photo[]) => [...prevPhotos, data.data]);

    //         } else {
    //             alert(data.message || 'Failed to create project')
    //         }
    //     } catch (error) {
    //         console.error('Error creating photo:', error)
    //         alert('An error occurred while creating the photo')
    //     } finally {
    //         setLoading(false);
    //         setOpen(false);
    //     }

    //     console.log(values)
    // }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            // Create FormData to handle file upload
            const formData = new FormData();


            formData.append("title", values.title);
            formData.append("description", values.description ?? "");
            formData.append("camera_brand", values.cameraBrand ?? "");
            formData.append("gear_used", values.gearUsed ?? "");
            formData.append("location", values.location ?? "");
            formData.append("photo_taken", values.photo_taken ?? "");

            // Append the file
            if (values.photo_path) {
                formData.append("photo_path", values.photo_path);
            }

            const res = await fetch(PHOTO_API.create, {
                method: "POST",
                body: formData, // use FormData instead of JSON
                // Do NOT set Content-Type header; browser handles it
            });

            const data = await res.json();
            console.log(res.status, data);

            if (res.ok) {
                // Add new photo to state
                setPhotos((prevPhotos: Photo[]) => [...prevPhotos, data.data]);
                await fetchPhotos(1);
                form.reset();
            } else {
                alert(data.message || "Failed to create photo");
            }
        } catch (error) {
            console.error("Error creating photo:", error);
            alert("An error occurred while creating the photo");
        } finally {
            setLoading(false);
            setOpen(false);
        }

        console.log(values);
    };

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button variant="default">Add</Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Upload Photo</DialogTitle>
                <DialogDescription>
                    Create and upload a new photo and add to the list.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Title of uploaded photo (must be at least 5 characters).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                    Description of uploaded photo.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cameraBrand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Camera Brand</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Camera brand. Dropdown! Field selection
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gearUsed"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gear Used</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Gears/Accessories used.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="photo_taken"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Photo Date Taken</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                                            >
                                                <CalendarIcon />
                                                {field.value ? format(new Date(field.value), "yyyy-MM-dd") : "Select date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormDescription>Select valid date</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="photo_path"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Upload Photo</FormLabel>
                                <FormControl>
                                    <Input
                                        id="picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file); // store the file in form state
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>Upload a photo (max 10MB)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">{loading ? <span>Loading...</span> : <span>Submit</span>}</Button>
                </form>
            </Form>

        </DialogContent>
    </Dialog>);
}
