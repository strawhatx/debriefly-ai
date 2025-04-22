import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {FileWarning} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NoDataModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export const NoDataModal = ({
    open,
    onClose,
    title = "No Trades Available",
    description = "Please try a different date, expand your range, or import your trades to get started.",
}: NoDataModalProps) => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        // Handle navigation logic here
        onClose();
        navigate("/app/trade-import");
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full flex flex-col justify-center items-center gap-6">

                <DialogHeader className="text-center space-y-2">
                    <DialogTitle className="flex text-md gap-2">
                        <FileWarning />{title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-400">{description}</DialogDescription>
                </DialogHeader>
                <div className="flex w-full flex-row justify-end gap-2">
                    <Button variant="default" onClick={handleNavigate}>
                        Import Trades
                    </Button>
                    <Button variant="destructive" onClick={onClose}>
                        Return to page
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
