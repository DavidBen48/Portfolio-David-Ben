import React from 'react';
import { SplineScene } from "./ui/splite";
import { Card } from "./ui/card";
import { Spotlight } from "./ui/spotlight";
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden border-green-700 green-glow-border">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            <span className="text-green-400">D</span>avid <span className="text-green-400">B</span>en
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-neutral-300 max-w-lg mx-auto md:mx-0">
            <span className="text-green-400">AI</span>-Powered <span className="text-green-400">FullStack Developer</span>
          </p>
          <p className="mt-6 text-md md:text-lg text-gray-500 tracking-wider">
            NextJS | TypeScript | Tailwind | Supabase | Golang | PHP
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative h-64 md:h-full">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full absolute top-0 left-0"
          />
        </div>
      </div>
    </Card>
  )
}