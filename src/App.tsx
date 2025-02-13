import { useEffect, useState } from "react";
import "./App.css";
import { MenuIcon, Upload } from "lucide-react";
import { VideoControls } from "./components/macro/actionSelector";
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { toast } from "sonner"
import { Button } from "./components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner"
import { ProjectCard } from "./components/macro/project-card";




interface GenShape {
  minLength: number,
  maxLength: number,
  captionFont: string,
  extraContext: string,
  quantity: number
}


function App() {

  useEffect(() => {
    var unlisten: UnlistenFn;

    (async () => {
      unlisten = (await listen<string>("error", (event) => {
        let id = event.id;
        let data = event.payload;

        <Button variant={"destructive"}>{toast(id + "Internal System Error", {
          description: <div><span>{data as string}</span><span className="block text-gray-800">{new Date().toLocaleDateString()}</span></div>,
          action: {
            label: "Retry",
            onClick: () => console.log("Not yet implemented"),
          },
          duration: 3
        })}</Button>;
      }))
    })();

    return () => {if (unlisten) unlisten()};


  }, [])

  return (
    <div className="text-gray-200 min-w-screen h-screen bg-black/95  relative p-4
    grid grid-rows-12
    ">
      <Header />
      <OperationInitializer />
      <PreviewOperations />
      <Toaster />

    </div>
  );
}

export default App;

const Header = () => {
  return (
    <div className="row-span-1 w-full flex justify-between items-center p-4">
      <h2 className="text-white font-bold text-xl">Diva </h2>
      <button className="text-white  p-2 rounded-md"><MenuIcon /></button>
    </div>
  );
};

const OperationInitializer = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [videoLength, setVideoLength] = useState<number[]>([30, 180]);
  const [context, setContext] = useState<string>("");
  const [captionFont, setCaptionFont] = useState<string>("default");
  const [videoCount, setVideoCount] = useState<number>(12);

  const handleButtonClick = async (_: any) => {

    const file = await open({
      multiple: false,
      directory: false,
      filters: [{
        extensions: ["mkv", "mp4"],
        name: "*"
      }]
    });

    setSelectedFile(file);
  }

  async function submitGeneration(_: any): Promise<void> {
    const reqData = { captionFont: captionFont, extraContext: context, maxLength: videoLength[1], minLength: videoLength[0], quantity: videoCount } as GenShape;
    try {
      await invoke("generate_cuts", { reqData });
      <Button>
        {toast("Video creation process initialized!", {
          description: new Date().toLocaleDateString(),
          action: {
            label: "Cancel",
            onClick: () => console.log("Not yet implemented"),
          },
        })}
      </Button>
    } catch (error) {
      <Button variant={"destructive"}>{
        toast("Internal System Error", {

          description: <div><span></span><span>{error as string}</span><span className="block text-gray-800">{new Date().toLocaleDateString()}</span></div>,
          action: {
            label: "Retry",
            onClick: () => console.log("Not yet implemented"),
          },

        })
      }</Button>
    }

  }

  return (
    <div className="row-span-6 w-full  rounded-lg mt-4 pb-12 flex flex-row">
      {/**File Selector */}
      <div className="m-auto w-fit h-fit border-1 rounded-3xl border-neutral-600 shadow-sm shadow-neutral-600 bg-neutral-950 flex flex-row  p-4 min-w-[720px]">
        {/**Left File Handler */}
        <div className="flex flex-col min-w-[360px]">
          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 border-2 border-dashed border-neutral-800 rounded-lg">
            <button onClick={handleButtonClick} className="mb-2 flex flex-row gap-2 *:m-auto border-neutral-800 border-2 rounded-lg p-2 px-4">
              <Upload className="h-4 w-4" />
              <span className="text-center">Select File</span>
            </button>
            {selectedFile ? (
              <p className="text-sm text-gray-500">Selected file: {selectedFile.split("/").pop()}</p>
            ) : (
              <p className="text-sm text-gray-500">No file selected</p>
            )}
          </div>
          <button className="bg-neutral-200 text-xl font-semibold tracking-wider font-sans text-neutral-900 rounded-md px-2 p-1 my-2 mt-4 hover:cursor-pointer" onClick={submitGeneration}>Generate clips</button>
        </div>

        {/**Button controls */}
        <VideoControls activeControl={activeControl}
          setActiveControl={setActiveControl}
          videoLength={videoLength}
          setVideoLength={setVideoLength}
          context={context}
          setContext={setContext}
          captionFont={captionFont}
          setCaptionFont={setCaptionFont}
          videoCount={videoCount}
          setVideoCount={setVideoCount} />
      </div>
    </div>
  );
};


interface Project {
  id: string
  fileName: string
  thumbnail: string
  quantity: number
  date: string
  status: "completed" | "processing" | "failed"
}


const PreviewOperations = () => {
  const [projects, setProjects] = useState<Project[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const fetchedProjects = await invoke<Project[]>("projects");
      setProjects(fetchedProjects);
    })();
  }, []);

  return (
    <div className="p-4 px-6 my-2">
      <h2 className="text-gray-200 text-xl underline my-3">Projects</h2>
      
      <ScrollArea className="h-64 flex flex-col rounded-md border border-zinc-700 bg-neutral-950">
          {projects ? (
            projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))
          ) : (
            <div className="text-gray-400 text-center m-auto h-full">Create a project...</div>
          )}
      </ScrollArea>
    </div>
  );
};
