import { Sparkles } from "lucide-react";
import { LLM } from "../../types/llms";

interface ModelOptionProps {
  model: LLM;
  onSelect: () => void;
}

const ModelOption = ({ model, onSelect }: ModelOptionProps) => {
  return (
    <div
      className="hover:bg-accent flex w-full cursor-pointer justify-start space-x-3 truncate rounded p-2 hover:opacity-50"
      onClick={onSelect}
    >
      <div className="flex items-center space-x-2">
        <Sparkles className="size-4" />
        <div className="text-sm font-semibold">{model.modelName}</div>
      </div>
    </div>
    // <TooltipWrapper
    //   display={
    //     model.pricing ? (
    //       <div>
    //         <div className="space-y-1 text-sm">
    //           <div>
    //             <span className="font-semibold">Input Cost:</span>{" "}
    //             {model.pricing.inputCost} {model.pricing.currency} per{" "}
    //             {model.pricing.unit}
    //           </div>
    //           {model.pricing.outputCost && (
    //             <div>
    //               <span className="font-semibold">Output Cost:</span>{" "}
    //               {model.pricing.outputCost} {model.pricing.currency} per{" "}
    //               {model.pricing.unit}
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     ) : undefined
    //   }
    //   side="bottom"
    //   trigger={
    //   }
    // />
  );
};

export default ModelOption;
