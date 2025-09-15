
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import type { Photo } from "@/types/photo";
import { useState } from "react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { updatePhotoApi } from "@/services/api";
import { getPhotoUrl } from "@/helper/getPhotoUrl";
import { useEffect } from "react";

interface EditPhotoDialogProps {
    photo: Photo;
    setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}

export default function EditPhotoDialog({ photo, setPhotos }: EditPhotoDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(photo.photo_path ? getPhotoUrl(photo.photo_path) : undefined);

    const noFutureDateString = z.string().refine(
        (val) => new Date(val) <= new Date(),
        { message: "Date cannot be in the future" }
    );

    const formSchema = z.object({
        title: z.string().min(5, { message: "Title must be at least 5 characters" }),
        description: z.any().optional(),
        camera_brand: z.string().optional(),
        photo_category: z.string().optional(),
        gear_used: z.any().optional(),
        location: z.any().optional(),
        photo_taken: noFutureDateString.optional(),
        photo_path: z
            .instanceof(File)
            .optional() // Optional since this is an edit form
            .refine((file) => !file || file.type.startsWith("image/"), {
                message: "Only image files are allowed (jpg, png)",
            })
            .refine((file) => !file || file.size <= 20 * 1024 * 1024, {
                message: "File size must be less than or equal to 20MB",
            })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: photo.title || "",
            description: photo.description || "",
            camera_brand: photo.camera_brand || "",
            photo_category: photo.photo_category || "",
            gear_used: photo.gear_used || "",
            location: photo.location || "",
            photo_taken: photo.photo_taken || "",
            photo_path: undefined, // file input starts empty
        },
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {

        if (!photo?.id) {
            alert("Photo ID is required");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description ?? "");
            formData.append("camera_brand", values.camera_brand ?? "");
            formData.append("photo_category", values.photo_category ?? "");
            formData.append("gear_used", values.gear_used ?? "");
            formData.append("location", values.location ?? "");
            formData.append("photo_taken", values.photo_taken ?? "");

            if (values.photo_path) {
                formData.append("photo_path", values.photo_path);
            }

            // **Important** for Laravel PUT route with FormData
            formData.append("_method", "PUT");

            const result = await updatePhotoApi(photo.id, formData);

            if (!result.success) {
                alert(result.message);
                return;
            }

            if (result.data && result.data.id) {
                // Immutable update to photos
                setPhotos(prev =>
                    prev.map(p =>
                        p.id === result.data.id ? { ...result.data } : p
                    )
                );
                // filteredPhotos will sync automatically via your useEffect\
                setPreview(result.data.photo_path); // must be the path returned by Laravel
            }
            form.reset();
            setOpen(false);
        } catch (error: any) {
            alert(error.message || "An error occurred while updating the photo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (photo) {
            form.reset({
                title: photo.title,
                description: photo.description,
                photo_category: photo.photo_category,
                camera_brand: photo.camera_brand,
                gear_used: photo.gear_used,
                location: photo.location,
                photo_taken: photo.photo_taken,
            });
        }
    }, [photo]);

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button variant="outline">Edit</Button></DialogTrigger>
        <DialogContent className={"overflow-y-auto max-h-screen"}>
            <DialogHeader>
                <DialogTitle>Update Photo Details</DialogTitle>
                <DialogDescription>
                    Edit and reupload a new photo to the list.
                </DialogDescription>
            </DialogHeader>
            {preview && (
                <img
                    src={preview.startsWith("blob:") ? preview : getPhotoUrl(preview)}
                    alt={photo.title}
                    className="mt-2 w-full max-h-100 object-cover rounded-md"
                />
            )}
            <Form {...form}>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                                                    <SelectItem value="Event">Event</SelectItem>
                                                    <SelectItem value="Landscape">Landscape</SelectItem>
                                                    <SelectItem value="Portrait">Portrait</SelectItem>
                                                    <SelectItem value="Street">Street</SelectItem>
                                                    <SelectItem value="Toy">Toy</SelectItem>
                                                    <SelectItem value="Travel">Travel</SelectItem>
                                                    <SelectItem value="Wildlife">Wildlife</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Select 'Wildlife' if pets rawr
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
                                                    <SelectItem value="Canon">Canon</SelectItem>
                                                    <SelectItem value="Fujifilm">Fujifilm</SelectItem>
                                                    <SelectItem value="Leica">Leica</SelectItem>
                                                    <SelectItem value="Nikon">Nikon</SelectItem>
                                                    <SelectItem value="Olympus">Olympus</SelectItem>
                                                    <SelectItem value="Panasonic">Panasonic</SelectItem>
                                                    <SelectItem value="Sony">Sony</SelectItem>
                                                    <SelectItem value="Mobile">Mobile</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Select 'Other' if not listed.
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
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Location photo was taken.
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
                                <FormLabel>Upload New Photo</FormLabel>
                                <FormControl>
                                    <Input
                                        id="picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                field.onChange(file); // store File object in form state
                                                const objectUrl = URL.createObjectURL(file);
                                                setPreview(objectUrl); // set blob URL directly
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>Upload a new photo (max 20MB)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">{loading ? <span>Updating...</span> : <span>Update</span>}</Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>);
}

function setLoading(arg0: boolean) {
    throw new Error("Function not implemented.");
}
