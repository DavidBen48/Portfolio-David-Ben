import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 gap-8 items-center text-center md:text-left">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            David Ben de Oliveira Vieira
          </h1>
          <p className="text-2xl md:text-3xl text-green-400 green-glow">
            AI-Powered FullStack Developer
          </p>
          <p className="text-gray-400 text-lg">
            NextJS | TypeScript | Tailwind | Supabase | Golang | PHP
          </p>
        </div>
        <div className="flex justify-center items-center h-64 md:h-auto" style={{ perspective: '1000px' }}>
          <div className="cube">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
