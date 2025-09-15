import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Photo } from "../../types/photo";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { getPhotoUrl } from "@/helper/getPhotoUrl";

interface ViewPhotoDialogProps {
    photo: Photo;
}

export default function ViewPhotoDialog({ photo }: ViewPhotoDialogProps) {
    const [open, setOpen] = useState(false);

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button variant="outline">View</Button></DialogTrigger>
        <DialogContent className={"overflow-y-auto max-h-screen"}>
            <DialogHeader>
                <DialogTitle>View Photo Details</DialogTitle>
                <DialogDescription>
                    View the details and information of the photo.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">

                {photo.photo_path && (
                    <div>
                        <img
                            src={getPhotoUrl(photo.photo_path)}
                            alt={photo.title}
                            className="mt-2 w-full max-h-100 object-cover rounded-md"
                        />
                    </div>
                )}
                <div>
                    <label className="block font-medium text-sm">Title</label>
                    <Input value={photo.title} readOnly />
                </div>

                <div>
                    <label className="block font-medium text-sm">Description</label>
                    <Textarea value={photo.description ?? ""} readOnly />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block font-medium text-sm">Category</label>
                        <Select disabled>
                            <SelectTrigger>
                                <SelectValue placeholder={photo.photo_category} />
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
                    </div>
                    <div>
                        <label className="block font-medium text-sm">Camera Brand</label>
                        <Select disabled>
                            <SelectTrigger>
                                <SelectValue placeholder={photo.camera_brand} />
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
                    </div>
                </div>
                <div>
                    <label className="block font-medium text-sm">Gear Used</label>
                    <Input value={photo.gear_used ?? ""} readOnly />
                </div>

                <div>
                    <label className="block font-medium text-sm">Location</label>
                    <Input value={photo.location ?? ""} readOnly />
                </div>

                <div>
                    <label className="block font-medium text-sm">Photo Date Taken</label>
                    <Input value={photo.photo_taken ? format(new Date(photo.photo_taken), "yyyy-MM-dd") : ""} readOnly />
                </div>


            </div>

        </DialogContent>
    </Dialog>);
}