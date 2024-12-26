import Image from "next/image";

export default function Albums(){
    return(
        <div className="sm:flex flex-wrap items-center justify-center gap-16 sm:m-20 ">
            <div className="flex items-center flex-col my-4">
                <div className="w-44 h-44 rounded-lg ">
                    <Image 
                        src="/Image/image-1.png"
                        alt="first"
                        width={176}
                        height={176}
                        layout="responsive"
                    />
                </div>
                <h1 className="font-semibold text-center mt-3">God, are you there ?</h1>
                <h3 className="text-gray-500/60 font-semibold text-sm text-center">DannoOppo</h3>
                <h3 className="text-sm font-semibold bg-gray-500/20 rounded-full text-center px-3 mt-1">Folk</h3>
            </div>
            <div className="flex items-center flex-col my-4">
                <div className="w-44 h-44 rounded-lg bg-gray-500/40">
                    <Image 
                        src="/Image/image-2.png"
                        alt="second"
                        width={176}
                        height={176}
                        layout="responsive"
                    />
                </div>
                <h1 className="font-semibold text-center mt-3">I let you down ?</h1> 
                <h3 className="text-gray-500/60 font-semibold text-sm text-center">MrTomMusic</h3>
                <h3 className="text-sm font-semibold bg-gray-500/20 rounded-full text-center px-3 mt-1">Electronic</h3> 
            </div>
            <div className="flex items-center flex-col my-4">
                <div className="w-44 h-44 rounded-lg bg-gray-500/40">
                    <Image 
                        src="/Image/image-3.png"
                        alt="third"
                        width={176}
                        height={176}
                        layout="responsive"
                    />
                </div>
                <h1 className="font-semibold text-center mt-3">Friday Night Ride</h1>  
                <h3 className="text-gray-500/60 font-semibold text-sm text-center">DannoOppo</h3>
                <h3 className="text-sm font-semibold bg-gray-500/20 rounded-full text-center px-3 mt-1">Hip Hop</h3>
            </div>
            <div className="flex items-center flex-col my-4">
                <div className="w-44 h-44 rounded-lg bg-gray-500/40">
                    <Image 
                        src="/Image/image-4.png"
                        alt="fourth"
                        width={176}
                        height={176}
                        layout="responsive"
                    />
                </div>
                <h1 className="font-semibold text-center mt-4">Pro Castinator</h1>  
                <h3 className="text-gray-500/60 font-semibold text-sm text-center">Jakemarsh</h3>
                <h3 className="text-sm font-semibold bg-gray-500/20 rounded-full text-center px-3 mt-1">Rock</h3>
            </div>
            <div className="flex items-center flex-col my-2">
                <div className="w-44 h-44 rounded-lg bg-gray-500/40">
                    <Image 
                        src="/Image/image-5.png"
                        alt="fifth"
                        width={176}
                        height={176}
                        layout="responsive"
                    />
                </div>
                <h1 className="font-semibold text-center mt-3">Monster Monster</h1>  
                <h3 className="text-gray-500/60 font-semibold text-sm text-center">DannoOppo</h3>
                <h3 className="text-sm font-semibold bg-gray-500/20 rounded-full text-center px-3 mt-1">Folk</h3>   
            </div>
        </div>
    )
}