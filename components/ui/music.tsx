import { JSX } from "react";

export interface Music {
  icon: JSX.Element; // Changed from `string` to `JSX.Element` for icons
  image: string;
  title: string;
  subTitle: string;
  duration: string;
}

export default function Music(props: Music): JSX.Element {
  return (
    <div className="w-96 border h-12 rounded-md flex items-center justify-between px-3 m-2 shadow-primary-glow">
      <div className="flex items-center py-2 gap-2">
        {props.icon} {/* Render the icon component */}
        <div className="w-9 h-9">
          <img src={props.image} alt={`${props.title} cover`} className="rounded-sm" />
        </div>
        <div>
          <h1 className="text-md">{props.title}</h1>
          <h3 className="font-semibold text-xs text-primary cursor-pointer">{props.subTitle}</h3>
        </div>
      </div>
      <div>
        <h1 className="dark:text-white">{props.duration}</h1>
      </div>
    </div>
  );
}
