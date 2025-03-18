import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <LoaderCircle className="mt-4 size-12 animate-spin" />
    </div>
  );
};

export default Loading;
