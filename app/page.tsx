"use client";
import { Alerta } from "@/components/Alerta";
import Loader from "@/components/loader";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import dogImage from "@/public/dog.png";
import catImage from "@/public/cat.png";

import Image from "next/image";
import { useEffect, useState } from "react";
const initialMessage = {
  type: "",
  text: "",
  desc: "",
};
export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [isloading, setIsloading] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  useEffect(() => {
    if (!message.text) return;
    setTimeout(() => {
      setMessage(initialMessage);
    }, 2500);
  }, [message]);

  return (
    <main className="h-[100vh] flex justify-center items-center ">
      {isloading && <Loader />}
      {message.text && <Alerta />}
      <div className="container w-[90%] sm:w-[90%] md:w-[70%] lg:w-[60%] h-[50%]  p-5 rounded-md shadow relative flex text-[#O53D58] backdrop-blur-sm shadow-lg shadow-white/50 text-blue-600">
        <section
          className={`basis-full sm:basis-1/2 grow-1 transition  duration-1000 ease-in-out ${
            !isLogin && "sm:translate-x-[70%]"
          }`}
        >
          <h1 className="text-center text-3xl font-bold">Huella Vital </h1>
          {isLogin ? (
            <LoginForm
              setIsLogin={setIsLogin}
              setMessage={setMessage}
              setIsloading={setIsloading}
            />
          ) : (
            <RegisterForm
              setIsloading={setIsloading}
              setMessage={setMessage}
              setIsLogin={setIsLogin}
            />
          )}
        </section>
        <section
          className={`hidden sm:block sm:basis-[40%] transition  duration-1000 ease-in-out ${
            !isLogin && "sm:-translate-x-[150%]"
          } `}
        >
          {isLogin ? (
            <>
              <Image
                src={dogImage}
                alt="Fire Image"
                className="h-full w-full "
              />
              <h2 className="relative top-[-110%] text-center z-999  font-bold animate-bounce ">
                Login cuarta 1
              </h2>
            </>
          ) : (
            <>
              <Image
                src={catImage}
                alt="Fire Image"
                className="h-full w-full "
              />
              <h2 className="relative top-[-110%] text-center z-999  font-bold animate-bounce ">
                Register cuarta 1
              </h2>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
