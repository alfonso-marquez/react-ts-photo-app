
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import type { Photo } from "../types/photo";
import { PHOTO_API } from "@/services/api";
import { set } from "zod";
import { useState } from "react";


interface DeletePhotoDialogProps {
    photo: Photo;
    setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}
export default function DeletePhotoDialog({ photo, setPhotos }: DeletePhotoDialogProps) {

    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {

        setLoading(true);
        try {
            const res = await fetch(`${PHOTO_API.list}/${photo.id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (res.ok) {
                // remove from local state
                setPhotos(prev => prev.filter(p => p.id !== photo.id));
                setLoading(false);
            } else {
                alert(data.message || "Failed to delete photo");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };

    return (<Dialog>
        <DialogTrigger asChild><Button variant="destructive" >Delete</Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you sure you want to delete?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete photo from the list.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete}>{loading ? <span>Loading...</span> : <span>Delete</span>}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>);
}