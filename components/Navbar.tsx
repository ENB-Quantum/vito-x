import { Button } from "./ui/button";

export default function Navbar() {
    return(
        <div className="h-20 w-full sticky top-0 border-b bg-white border-b-orange-200 ">
            <div className="sm:px-10 px-4 flex items-center justify-between h-20 ">
                <img src="#" alt="Logo" />
                <div className="flex gap-3 ">
                    <Button variant={"outline"}>Sign in</Button>
                    <Button >Sign up</Button>
                </div>
            </div>
        </div>
    )
}