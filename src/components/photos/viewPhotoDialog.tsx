import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

import { format } from "date-fns";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { getPhotoUrl } from "@/helper/getPhotoUrl";
import type { Photo } from "../../types/photo";
import { useState } from "react";

interface ViewPhotoDialogProps {
  photo: Photo;
}

export default function ViewPhotoDialog({ photo }: ViewPhotoDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {" "}
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>View Photo Details</DialogTitle>
          <DialogDescription>
            View the details and information of the selected photo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {photo.photo_path && (
            <div className="relative w-full h-60 sm:h-80">
              <img
                src={
                  photo.photo_path
                    ? getPhotoUrl(photo.photo_path)
                    : "https://placehold.co/600x400.png"
                }
                alt={`Photo titled ${photo.title}`}
                className="w-full h-full object-cover rounded-md shadow-md"
                onError={(e) =>
                  (e.currentTarget.src = "https://placehold.co/600x400.png")
                }
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <Input
              value={photo.title}
              readOnly
              className="bg-gray-100 text-gray-600 pointer-events-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              value={photo.description ?? ""}
              readOnly
              className="bg-gray-100 text-gray-600 pointer-events-none"
            />
          </div>

          {/* Photo Info: Category, Camera Brand */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <Input
                value={photo.photo_category}
                readOnly
                className="bg-gray-100 text-gray-600 pointer-events-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Camera Brand</label>
              <Input
                value={photo.camera_brand}
                readOnly
                className="bg-gray-100 text-gray-600 pointer-events-none"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium">
              Gears & Acessories
            </label>
            <Textarea
              value={photo.gear_used ?? ""}
              readOnly
              className="bg-gray-100 text-gray-600 pointer-events-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <Input
              value={photo.location ?? ""}
              readOnly
              className="bg-gray-100 text-gray-600 pointer-events-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Photo Date Taken
            </label>
            <Input
              value={
                photo.photo_taken
                  ? format(new Date(photo.photo_taken), "yyyy-MM-dd")
                  : ""
              }
              readOnly
              className="bg-gray-100 text-gray-600 pointer-events-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
