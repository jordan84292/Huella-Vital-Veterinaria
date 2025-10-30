import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
interface alertprops {
  type: string;
  text: string;
  desc: string;
}
export function Alerta({ type, text, desc }: alertprops) {
  return (
    <div className="grid w-full max-w-xl items-start gap-4 absolute top-2 left-2  ">
      {type == "error" ? (
        <Alert variant={"destructive"}>
          <AlertCircleIcon />
          <AlertTitle>{text}</AlertTitle>
          <AlertDescription>
            <p>{desc}</p>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Success! {text}</AlertTitle>
          <AlertDescription>{desc}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
