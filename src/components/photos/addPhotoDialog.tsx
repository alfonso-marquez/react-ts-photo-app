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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Upload } from 'lucide-react';


import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { createPhotoApi } from "@/services/api";

import { useState } from "react";

import type { Photo } from "../../types/photo";

// Zod Schema for Validation
const noFutureDateString = z.string().refine(
    (val) => new Date(val) <= new Date(),
    { message: "Date cannot be in the future" }
);

const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters" }),
    description: z.string().optional(),
    camera_brand: z.string().optional(),
    photo_category: z.string().optional(),
    gear_used: z.string().optional(),
    location: z.string().optional(),
    photo_taken: noFutureDateString.optional(),
    photo_path: z.instanceof(File, { message: "An image file is required" })
        .refine((file) => file.type.startsWith("image/"), {
            message: "Only image files are allowed (jpg, png)",
        })
        .refine((file) => file.size <= 20 * 1024 * 1024, { // for better readability (20MB)
            message: "File size must be less than or equal to 20MB",
        })
})


interface AddPhotoDialogProps {
    setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
    fetchPhotos: (page?: number, query?: string) => Promise<void>;
    categories: string[];
    cameraBrands: string[];
}


export default function AddPhotoDialog({ setPhotos, fetchPhotos, categories, cameraBrands }: AddPhotoDialogProps) { //research this!
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null); // For general API errors

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            camera_brand: "",
            gear_used: "",
            location: "",
            photo_taken: undefined,
            photo_path: undefined,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setApiError(null); // Reset any previous API errors

        try {
            // Build FormData for file + text fields
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description ?? "");
            formData.append("photo_category", values.photo_category ?? "");
            formData.append("camera_brand", values.camera_brand ?? "");
            formData.append("gear_used", values.gear_used ?? "");
            formData.append("location", values.location ?? "");
            formData.append("photo_taken", values.photo_taken ?? "");

            if (values.photo_path) {
                formData.append("photo_path", values.photo_path);
            }

            // Call API with error checking
            const result = await createPhotoApi(formData);

            if (!result.success) {
                setApiError(result.message); // Show API error
            } else if (result.data && result.data.id) {
                setPhotos((prevPhotos: Photo[]) => [...prevPhotos, result.data]);
            }
            // Refresh the list to show new photo (reset to page 1)
            await fetchPhotos(1, "");

            form.reset();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setApiError(error.message || "An error occurred while creating the photo");
            } else {
                setApiError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button className="bg-green-500 hover:bg-green-600 p-5"><Upload />Photo</Button></DialogTrigger>
        <DialogContent className="overflow-y-auto max-h-screen">
            <DialogHeader>
                <DialogTitle>Create Photo</DialogTitle>
                <DialogDescription>
                    Create and upload a new photo and add it to the list.
                </DialogDescription>
            </DialogHeader>

            {/* Display API Error (if any) */}
            {apiError && (
                <div className="text-red-500 font-semibold text-sm mb-4">{apiError}</div>
            )}

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
                                <FormDescription>Title of uploaded photo (must be at least 5 characters).</FormDescription>
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
                                    <Textarea  {...field} />
                                </FormControl>
                                <FormDescription>
                                    Description of uploaded photo.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <FormField
                                control={form.control}
                                name="photo_category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Event" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Select a category
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="camera_brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Camera Brand</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Canon" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cameraBrands.map((brand) => (
                                                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Select a brand or 'Other'
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="gear_used"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gears & Accessories Used</FormLabel>
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
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
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
                                <FormDescription>Select a valid date</FormDescription>
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
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file); // store the file in form state
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>Upload a photo (max 20MB)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={loading} className="mt-4">
                        {loading ? <span>Loading...</span> : <span>Submit</span>}
                    </Button>
                </form>
            </Form>

        </DialogContent>
    </Dialog>);
}
