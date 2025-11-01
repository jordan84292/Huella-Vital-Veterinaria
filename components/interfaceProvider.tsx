"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import Loader from "@/components/loader";
import { Alerta } from "@/components/Alerta";

export function InterfaceProvider() {
  const isLoading = useSelector(
    (state: RootState) => state.interface.isLoading
  );
  const message = useSelector((state: RootState) => state.interface.message);

  return (
    <>
      {isLoading && <Loader />}
      {message.view == true && <Alerta />}
    </>
  );
}
