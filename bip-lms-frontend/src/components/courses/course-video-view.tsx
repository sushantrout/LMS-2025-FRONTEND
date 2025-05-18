import { SessionOverview } from "@/types/model/session-overview-model";
import { Button } from "../ui/button";
import { Play } from "lucide-react";

export default function CourseVideoView({ selectedSession }: { selectedSession: SessionOverview }) {
  return (
    <div className="w-full bg-gray-900 h-[40vh] md:h-[50vh] flex items-center justify-center relative group overflow-hidden">
      {selectedSession?.link ? (
        <video
          className="w-full h-full object-cover"
          poster="/modern-classroom-thumbnail.png"
          controls
        >
          <source src={selectedSession.link} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 bg-indigo-600/90 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors cursor-pointer">
            <Play className="w-10 h-10 fill-white text-white ml-1" />
          </div>
          <p className="text-lg font-medium">
            {selectedSession?.sessionName ||
              "Select a lesson to start learning"}
          </p>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <p className="text-sm text-gray-300">{selectedSession?.duration}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <span>1x</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              HD
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
