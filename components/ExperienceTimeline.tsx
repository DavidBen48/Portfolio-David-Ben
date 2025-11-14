import React from 'react';
import { TimelineItem, TimelineItemType } from '../types';

const timelineData: TimelineItem[] = [
    {
        type: TimelineItemType.EDUCATION,
        title: 'Ciência da Computação',
        institution: 'Faculdade Anhanguera',
        period: '2025 - 2029',
        description: [
            'Matemática Computacional e Lógica com C e C++',
            'Análise de Dados com Python e Modelagem de Dados SQL',
            'Desenvolvimento Frontend (JS) e Backend (Java)',
        ]
    },
    {
        type: TimelineItemType.EDUCATION,
        title: 'Desenvolvimento Fullstack',
        institution: 'Curso Recode PRO',
        period: '2024 - 2025 (concluído)',
        description: [
            'React, NextJS, TypeScript, TailwindCSS',
            'Java, Spring, Docker, PostgreSQL',
            'IA para Desenvolvimento Web (Prompts e Cursor AI)',
        ]
    },
    {
        type: TimelineItemType.EXPERIENCE,
        title: 'Analista de Banco de Dados - Estágio',
        institution: 'E-Soft Sistemas LTDA',
        period: '2021 – 2022',
        description: [
            'Análises de vendas com Python e Power BI',
            'Tarefas CRUD usando Firebird',
            'Gerenciamento de dados empresariais na nuvem',
        ]
    }
].reverse(); // Reverse to show most recent first

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-green-400 green-glow text-center">
      {children}
    </h2>
);

const BriefcaseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const GraduationCapIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 18.747V20a2 2 0 01-2 2H5a2 2 0 01-2-2v-1.253A12.083 12.083 0 016.84 10.578L12 14z" />
    </svg>
);


const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-20">
      <SectionTitle>Educação & Experiência</SectionTitle>
      <div className="container mx-auto px-4">
        <div className="p-8 md:py-12 md:px-0">
            <div className="relative">
            {/* Vertical line */}
            <div className="absolute top-0 h-full w-0.5 bg-green-700 bg-opacity-30 left-6 md:left-1/2 md:-translate-x-1/2"></div>
            
            {timelineData.map((item, index) => {
                const isLeftOnDesktop = index % 2 !== 0;
                const isEducation = item.type === TimelineItemType.EDUCATION;
                
                return (
                <div key={index} className={`mb-10 md:mb-8 flex md:justify-between w-full items-center ${isLeftOnDesktop ? 'md:flex-row-reverse' : ''}`}>
                    {/* Card Container */}
                    <div className="w-full md:w-5/12">
                    <div className="ml-12 md:ml-0 md:px-4">
                        <div className="relative p-6 rounded-lg shadow-lg border border-green-800 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
                            {/* Arrow */}
                            <div className={`hidden md:block absolute w-4 h-4 bg-gray-900 border-green-800 transform rotate-45 top-8 -translate-y-1/2
                                            ${isLeftOnDesktop ? 'right-[-8px] border-t-2 border-r-2' : 'left-[-8px] border-b-2 border-l-2'}`}>
                            </div>
                            
                            <h3 className="mb-2 font-bold text-white text-xl">{item.title}</h3>
                            <p className="text-sm font-medium leading-snug tracking-wide text-green-400">{item.institution} | {item.period}</p>
                            <ul className="list-disc list-inside mt-3 text-gray-300 space-y-1 text-left">
                                {item.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    </div>
                    </div>

                    {/* Dot */}
                    <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-green-500 absolute left-6 -translate-x-1/2 md:relative md:left-auto md:mx-auto">
                        {isEducation ? <GraduationCapIcon /> : <BriefcaseIcon />}
                    </div>

                    {/* Spacer for desktop layout */}
                    <div className="hidden md:block w-5/12"></div>
                </div>
                );
            })}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;