import { Play } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function About(){
    return(
        <div className="sm:flex gap-2 items-start justify-evenly w-full sm:p-20 p-6">
            <div className="sm:w-96 sm:mr-10">
                <h3 className="text-xs text-primary font-semibold">What we do</h3>
                <h1 className="text-3xl font-semibold mt-4 mb-4 sm:w-64">Create your life's soundtrack</h1>
                <p className="sm:font-semibold text-gray-700 dark:text-white dark:font-normal mb-8 sm:text-lg text-md">Imagine creating personalized music for your life: 
                    a ballad for a romantic date, a banger for a night 
                    out with friends, a lo-fi track for meditation, or an 
                    upbeat song for your child’s birthday. If you can describe 
                    it in text, you can now express it in music.
                </p>
                <Button variant={"outline"} className="text-md"> Create your first song</Button>
            </div>
            <div className="my-10 sm:my-0">
                <div className="flex justify-between bg-transparent gap-3 border rounded-md p-2 my-2 shadow-secondary-glow">
                    <div className="flex gap-3 items-center">
                        <div className="sm:w-[60px] w-16">
                            <Image 
                                src="/Image/sub-img-1.png"
                                alt="sub Img"
                                width={60}
                                height={60}
                                className="rounded-sm"
                                layout="responsive"
                            />
                        </div>
                        
                        <div className="max-w-64 sm:leading-4 leading-5 mr-8">
                            <h1 className="font-semibold w-full">Dreaming Rogue - The ride of Dreams</h1>
                            <h3 className="sm:mt-1 text-sm">Dream House</h3>
                        </div>
                    </div>
                    <div className="flex items-center sm:gap-10 sm:mx-6 mx-2 gap-2">
                        <h1 className="hidden md:flex">4:21</h1>
                        <div className="flex items-center justify-center w-12 h-12 border rounded-full bg-white dark:bg-gray-500/40">
                            <Play />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-transparent gap-3 border rounded-md p-2 my-2 shadow-secondary-glow">
                    <div className="flex items-center gap-3">
                        <div className="sm:w-[60px] w-16">
                            <Image 
                                src="/Image/sub-img-2.png"
                                alt="sub Img-2"
                                width={60}
                                height={60}
                                className="rounded-sm"
                                layout="responsive"
                            />
                        </div>
                        <div className="max-w-64 sm:leading-4 leading-5 mr-8">
                            <h1 className="font-semibold w-full ">Tidal Resonance</h1>
                            <h3 className="mt-1 text-sm">Nu Jazz</h3>
                        </div>
                    </div>
                    <div className="flex items-center sm:gap-10 sm:mx-6 mx-2 gap-2">
                        <h1 className="hidden sm:flex">4:21</h1>
                        <div className="flex items-center justify-center w-12 h-12 border rounded-full bg-white dark:bg-gray-500/40">
                            <Play />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between bg-transparent gap-3 border rounded-md p-2 my-2 shadow-secondary-glow">
                    <div className="flex items-center gap-3">
                        <div className="sm:w-[60px] w-16">
                            <Image 
                                src="/Image/sub-img-3.png"
                                alt="sub Img-3"
                                width={60}
                                height={60}
                                className="rounded-sm"
                                layout="responsive"
                            />
                        </div>
                        
                        <div className="max-w-64 sm:leading-4 leading-5 mr-8">
                            <h1 className="font-semibold w-full">March of the Humanity</h1>
                            <h3 className="mt-1 text-sm">Orchestral</h3>
                        </div>
                    </div>
                    <div className="flex items-center sm:gap-10 sm:mx-6 mx-2 gap-2">
                        <h1 className="hidden sm:flex">4:21</h1>
                        <div className="flex items-center justify-center w-12 h-12 border rounded-full bg-white dark:bg-gray-500/40">
                            <Play />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between bg-transparent gap-3 border rounded-md p-2 my-2 shadow-secondary-glow">
                    <div className="flex items-center gap-3">
                        <Image 
                            src="/Image/sub-img-4.png"
                            alt="sub Img-4"
                            width={60}
                            height={60}
                            className="rounded-sm"
                        />
                        <div className="max-w-64 sm:leading-4 leading-5 mr-8">
                            <h1 className="font-semibold w-full">Mission complete </h1>
                            <h3 className="mt-1 text-sm">french House</h3>
                        </div>
                    </div>
                    <div className="flex items-center sm:gap-10 sm:mx-6 mx-2 gap-2">
                        <h1 className="hidden sm:flex">4:21</h1>
                        <div className="flex items-center justify-center w-12 h-12 border rounded-full bg-white dark:bg-gray-500/40">
                            <Play />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between bg-transparent gap-3 border rounded-md p-2 my-2 shadow-secondary-glow">
                    <div className="flex items-center gap-3">
                        <Image 
                            src="/Image/sub-img-5.png"
                            alt="sub Img-5"
                            width={60}
                            height={60}
                            className="rounded-sm"
                        />
                        <div className="max-w-64 sm:leading-4 leading-5 mr-8">
                            <h1 className="font-semibold w-full">Shades of Gold</h1>
                            <h3 className="mt-1 text-sm">Synthpop</h3>
                        </div>
                    </div>
                    <div className="flex items-center sm:gap-10 sm:mx-6 mx-2 gap-2">
                        <h1 className="hidden sm:flex">4:21</h1>
                        <div className="flex items-center justify-center w-12 h-12 border rounded-full bg-white dark:bg-gray-500/40">
                            <Play />
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}