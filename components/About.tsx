import React from 'react';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-green-400 green-glow text-center">
    {children}
  </h2>
);

const About: React.FC = () => {
  return (
    <section id="about" className="py-20">
      <SectionTitle>Sobre Mim</SectionTitle>
      <div className="max-w-5xl mx-auto text-center text-lg md:text-xl text-gray-300 space-y-6 p-8 md:p-12">
        <p>
          Desenvolvedor com <span className="text-green-400 font-semibold">1 ano e 6 meses de estudo</span>, buscando minha primeira oportunidade
          para <span className="text-white font-bold">estágio/júnior</span> em Desenvolvimento de Software, Sistemas ou FullStack.
        </p>
        <p>
          Minha jornada, embora com experiência profissional focada em dados, é impulsionada pela paixão em construir soluções tecnológicas completas e inovadoras, com um forte interesse na <span className="text-green-400 font-semibold">integração de Inteligência Artificial</span> no ciclo de desenvolvimento.
        </p>
      </div>
    </section>
  );
};

export default About;