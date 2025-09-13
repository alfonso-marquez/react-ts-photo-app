
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function EditPhotoDialog() {

    return (<Dialog>
        <DialogTrigger asChild><Button variant="secondary">Edit</Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Form</DialogTitle>
                <DialogDescription>
                    Update and edit the photo details and information.
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>);
}