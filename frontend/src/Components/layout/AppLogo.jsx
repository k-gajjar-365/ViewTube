import { Play } from "lucide-react";

const AppLogo = () => (
   <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500">
         <Play size={16} className="ml-0.5 text-white" fill="white" />
      </span>
      <span className="text-lg font-bold tracking-wide text-white">PLAY</span>
   </div>
);

export default AppLogo;
