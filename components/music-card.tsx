import { Play } from "lucide-react";
import Music from "./ui/music";

export default function MusicCard(){
    return(
        <div className="flex items-center flex-col mt-20 ">
            <div className="sm:flex ">
                    <Music 
                        icon = {<Play/>}
                        image="/Image/sample.jpg"
                        title="The Night we Met"
                        subTitle="Lord huron"
                        duration={"3:28"}
                    />
                    <Music 
                        icon = {<Play/>}
                        image="/Image/sample.jpg"
                        title="The Night we Met"
                        subTitle="Lord huron"
                        duration={"3:28"}
                    />
                </div>
                <div className="sm:flex ">
                    <Music 
                        icon = {<Play/>}
                        image="/Image/sample.jpg"
                        title="The Night we Met"
                        subTitle="Lord huron"
                        duration={"3:28"}
                    />
                    
                    <Music 
                        icon = {<Play/>}
                        image="/Image/sample.jpg"
                        title="The Night we Met"
                        subTitle="Lord huron"
                        duration={"3:28"}
                    />
                    <Music 
                        icon = {<Play/>}
                        image="/Image/sample.jpg"
                        title="The Night we Met"
                        subTitle="Lord huron"
                        duration={"3:28"}
                    />
                </div>
        </div>
    )
}