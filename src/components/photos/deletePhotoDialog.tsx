import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import type { Photo } from "../../types/photo";
import { deletePhotoApi } from "@/services/api";
import { useState } from "react";
import { Trash } from "lucide-react";

interface DeletePhotoDialogProps {
  photo: Photo;
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  fetchPhotos: (page?: number, query?: string) => Promise<void>;
}
export default function DeletePhotoDialog({
  photo,
  setPhotos,
  fetchPhotos,
}: DeletePhotoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!photo?.id) {
      setError("Photo ID is required.");
      return;
    }

    setLoading(true);
    setError(null); // Reset previous errors before making the request
    try {
      const result = await deletePhotoApi(photo.id);

      if (!result.success) {
        setError(result.message); // Display the error message in the dialog
      } else {
        // Successfully deleted, update state
        setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        // Refresh the list to show new photo (reset to page 1)
        await fetchPhotos(1, "");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(
          error.message || "An error occurred while deleting the photo.",
        );
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {" "}
          <Trash color="#f35353" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. It will permanently delete the photo
            from the list.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-red-500 mt-4">
            {/* Display error message */}
            <strong>{error}</strong>
          </div>
        )}

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <span>Loading...</span> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
