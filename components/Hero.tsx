import React from 'react';
import { SplineSceneBasic } from './SplineSceneBasic';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4 w-full">
      <SplineSceneBasic />
    </section>
  );
};

export default Hero;