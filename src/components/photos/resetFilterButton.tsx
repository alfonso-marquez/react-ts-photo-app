import { Button } from "@/components/ui/button";


export default function ResetFilterButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            type="button"
            variant="outline"
            onClick={onClick}
        >
            Reset
        </Button>
    );
}