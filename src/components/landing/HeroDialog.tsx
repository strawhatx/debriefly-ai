

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";



export const HeroDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm/6 font-semibold border-emerald-400">
          🔍 See How It Works
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 border-0 max-w-md sm:max-w-xl md:max-w-2xl w-full h-[14rem] sm:h-[22rem] md:h-[30rem]">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/yHDvCGNjIqk?si=6_rKq2Ziidem8_Vn"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen></iframe>
      
      </DialogContent>
    </Dialog>
  );
};
