import { useState } from "react"
import { Clock, FileText, Subtitles, Copy } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VideoControlsProps {
  activeControl: string | null;
  setActiveControl: (control: string | null) => void;
  videoLength: number[];
  setVideoLength: (length: number[]) => void;
  context: string;
  setContext: (context: string) => void;
  captionFont: string;
  setCaptionFont: (font: string) => void;
  videoCount: number;
  setVideoCount: (count: number) => void;
}

export function VideoControls({
  activeControl,
  setActiveControl,
  videoLength,
  setVideoLength,
  context,
  setContext,
  captionFont,
  setCaptionFont,
  videoCount,
  setVideoCount,
}: VideoControlsProps) {

  const [hoveredControl, setHoveredControl] = useState<string | null>(null);


  const renderControlPanel = () => {
    switch (activeControl) {
      case "length":
        return (
          <div className="p-6">
            <h4 className="block text-sm font-medium leading-6 text-neutral-100 mb-2">
              Video Length (seconds)
            </h4>
            <Slider
              defaultValue={videoLength}
              max={180}
              min={20}
              step={1}
              onValueChange={setVideoLength}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-zinc-400">
              <span>Min: {videoLength[0]}s</span>
              <span>Max: {videoLength[1]}s</span>
            </div>
          </div>
        )
      case "context":
        return (
          <div className="p-1 max-h-[120px] overflow-y-auto"> {/* Fixed max height and scroll */}
            <Textarea
              placeholder="Add context to refine video generation..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[100px] h-full rounded-md border-0 outline-0 focus:border-0 py-1.5 text-neutral-100 shadow-sm  bg-transparent placeholder:text-zinc-400 sm:text-sm sm:leading-6"
            />
          </div>
        )
      case "captions":
        return (
          <div className="p-6">
            <h4 className="block text-sm font-medium leading-6 text-neutral-100 mb-3">
              Caption Font
            </h4>
            <Select value={captionFont} onValueChange={setCaptionFont}>
              <SelectTrigger className="w-full bg-zinc-800 text-neutral-100 border-zinc-700 rounded-md">
                <SelectValue placeholder="Select font style" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-neutral-100 border-zinc-700 rounded-md">
                <SelectItem className="text-neutral-100" value="none">No Captions</SelectItem>
                <SelectItem className="text-neutral-100" value="default">Default</SelectItem>
                <SelectItem className="text-neutral-100" value="arial">Arial</SelectItem>
                <SelectItem className="text-neutral-100" value="helvetica">Helvetica</SelectItem>
                <SelectItem className="text-neutral-100" value="times">Times New Roman</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      case "amount":
        return (
          <div className="p-6">
            <h4 className="block text-sm font-medium leading-6 text-neutral-100 mb-3">
              Number of Videos
            </h4>
            <Slider
              defaultValue={[videoCount]}
              max={24}
              min={1}
              step={1}
              onValueChange={(e) => {setVideoCount(e[0])}}
              className="w-full"
            />
            <div className="mt-2 text-xs text-zinc-400">
              Generate {videoCount} video{videoCount > 1 ? "s" : ""}
            </div>
          </div>
        )
      default:
        return (
          <div className="p-6">
             <p className="text-sm text-zinc-400">
              Click on a control below to adjust video settings.
            </p>
          </div>
        )
    }
  }

  const controlButtons = [
    { name: "length", icon: <Clock size={32} className="text-blue-500" strokeWidth={3.5} />, label: "Length" },
    { name: "context", icon: <FileText size={32} className="text-green-500" strokeWidth={3.5} />, label: "Context" },
    { name: "captions", icon: <Subtitles size={32} className="text-yellow-500" strokeWidth={3.5} />, label: "Captions" },
    { name: "amount", icon: <Copy  size={32} className="text-red-500" strokeWidth={3.5} />, label: "Amount" },
  ];


  return (
    <div className="w-lg mx-auto px-2 grid grid-rows-6"> {/* Fixed height container */}
      <div className="row-span-4 rounded-xl border border-zinc-700 bg-zinc-900 shadow-sm min-w-full"> {/* Take full height of parent */}
        {renderControlPanel()}
      </div>
      <div className="row-span-2 flex flex-row place-content-evenly gap-4 w-full m-auto">
        {controlButtons.map((button) => (
          <div key={button.name} className="relative"> {/* Position relative for hover card */}
            <Button
              variant={activeControl === button.name ? "default" : "outline"}
              className="justify-center items-center rounded-full border-2 hover:border-blue-500 transition-colors bg-zinc-900 text-neutral-100 border-zinc-700 hover:bg-zinc-800"
              size={"icon"}
              onClick={() => setActiveControl(activeControl === button.name ? null : button.name)}
              onMouseEnter={() => setHoveredControl(button.name)}
              onMouseLeave={() => setHoveredControl(null)}
            >
              {button.icon}
            </Button>
            {hoveredControl === button.name && (
              <div className="absolute bottom-[-35px] left-1/2 transform -translate-x-1/2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md p-2 text-xs shadow-md">
                {button.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}