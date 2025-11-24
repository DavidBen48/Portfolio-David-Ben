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
          Com <span className="text-green-400 font-semibold">1 ano e 6 meses de estudo</span> focado e agora atuando como <span className="text-white font-bold">Desenvolvedor e Programador</span> na Suporte Verde, minha paixão é criar soluções robustas e eficientes.
        </p>
        <p>
          No <span className="text-green-400 font-semibold">Frontend</span>, possuo conhecimento intermediário e utilizo <span className="text-white font-bold">Inteligência Artificial</span> de forma estratégica, criando prompts eficientes para acelerar o desenvolvimento e otimizar a interface do usuário.
        </p>
        <p>
          No <span className="text-green-400 font-semibold">Backend</span>, meu conhecimento também é intermediário, mas com uma abordagem diferente: construo tudo <span className="text-white font-bold">manualmente</span>. Tenho uma lógica de programação aguçada que me permite desenvolver APIs e sistemas seguros e performáticos sem depender de IA, garantindo um código limpo e sob total controle.
        </p>
      </div>
    </section>
  );
};

export default About;