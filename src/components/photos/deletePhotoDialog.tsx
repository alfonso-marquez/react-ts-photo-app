
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import type { Photo } from "../../types/photo";
import { deletePhotoApi, PHOTO_API } from "@/services/api";
import { useState } from "react";


interface DeletePhotoDialogProps {
    photo: Photo;
    setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}
export default function DeletePhotoDialog({ photo, setPhotos }: DeletePhotoDialogProps) {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!photo?.id) {
            alert("Photo ID is required");
            return;
        }

        setLoading(true);
        try {
            const result = await deletePhotoApi(photo.id);

            if (!result.success) {
                alert(result.message);

            } else {
                // Remove from local state
                setPhotos(prev => prev.filter(p => p.id !== photo.id));
            }

        } catch (error: any) {
            console.error("Delete error:", error);
            alert(error.message || "An error occurred");
        } finally {
            setLoading(false);
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