import { AudioLines, MicVocal } from "lucide-react";
import { Button } from "./ui/button";
import MusicCard from "./music-card";


export default function Hero(){
    return(
        <div className="w-full flex items-center justify-center my-40">
            <div className="flex items-center flex-col">
                <h1 className="sm:text-6xl text-center font-bold text-4xl">Make your Music</h1>
                <h3 className="sm:text-2xl text-md text-gray-500/80 text-center sm:w-96 w-64 mx-auto sm:my-5 my-2">Create any song. just give your voice or upload your lyrics</h3>
                <div className="flex gap-3 my-20">
                    <Button variant={"outline"}>
                        <AudioLines /> Upload your voice
                    </Button>
                    <Button >
                        <MicVocal /> Upload your lyrics
                    </Button>
                </div>
                <MusicCard />
            </div>
        </div>
    )
}