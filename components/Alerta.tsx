import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useEffect, useEffectEvent } from "react";
import { setMessage } from "@/Redux/reducers/interfaceReducer";

export function Alerta() {
  const message = useSelector((state: RootState) => state.interface.message);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!message.view) return;
    setTimeout(() => {
      dispatch(
        setMessage({
          view: false,
          type: "",
          text: "",
          desc: "",
        })
      );
    }, 4000);
  }, [message.view]);

  return (
    <div className="grid w-[200px] max-w-xl items-start gap-4 absolute top-5 left-2  z-999999">
      {message.type == "Error" ? (
        <Alert variant={"destructive"}>
          <AlertCircleIcon />
          <AlertTitle>{message.text}</AlertTitle>
          <AlertDescription>
            <p>{message.desc}</p>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle> {message.text}</AlertTitle>
          <AlertDescription>{message.desc}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
