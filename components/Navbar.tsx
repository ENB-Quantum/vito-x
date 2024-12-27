
import Image from "next/legacy/image";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/theme-switch";


export default function Navbar() {
    return(
        
        <div className="h-20 w-full sticky top-0 border-b bg-white dark:bg-black dark:border-b-black border-b-primary z-50">
            <div className="sm:px-10 px-4 flex items-center justify-between h-20 ">
                <Image
                    src="/LOGO-dark.png"
                    alt="LOGO"
                    width={100}
                    height={30}
                    className="object-contain hidden dark:block"
                />
                <Image
                    src="/LOGO-light.png"
                    alt="LOGO"
                    width={100}
                    height={30}
                    className="object-contain dark:hidden"
                />
                <div className="flex gap-3 ">
                    <Button variant={"outline"}>Sign in</Button>
                    <Button >Sign up</Button>
                    <ModeToggle />
                </div>
            </div>
        </div>
    )
}