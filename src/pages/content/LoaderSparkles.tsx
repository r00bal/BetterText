import { SparklesCore } from "@src/components/ui/sparkles";

export const LoaderSparkles = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <>
      <h2 className="text-slate-900 w-full rounded-md text-xs font-light mb-4">
        Working on it...
      </h2>
      <div className="w-full h-full max-h-[300px] flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full h-full relative">
          <div className="absolute inset-x-20 top-0 left-0 right-0 m-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm"></div>
          <div className="absolute inset-x-20 top-0 left-0 right-0 m-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4"></div>
          <div className="absolute inset-x-60 top-0 left-0 right-0 m-auto bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm"></div>
          <div className="absolute inset-x-60 top-0 left-0 right-0 m-auto bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4"></div>
          <div className="opacity-0 w-full h-[400px]" style={{ opacity: 1 }}>
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={300}
              className="w-full h-full"
              particleColor="#000"
            />
          </div>
          <div className="absolute inset-0 w-full h-[400px] bg-white [mask-image:radial-gradient(100%_80%_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
    </>
  );
};
