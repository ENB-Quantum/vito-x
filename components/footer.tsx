import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer(){
    return(
        <div className="relative bottom-0 border-t border-orange-600/30 h-20 w-full">
            <div className="flex items-center justify-between sm:px-10 px-4 h-20">
                <div className="sm:px-10 ">
                    <img src="#" alt="Logo" />
                </div>
                <div className="flex gap-4 sm:px-10">
                    <Instagram />
                    <Youtube />
                </div>
            </div>
        </div>
    )
}