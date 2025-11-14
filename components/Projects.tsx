import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';

const projects: Project[] = [
  {
    title: 'Loja de Vendas - Connect',
    description: 'Site desenvolvido para venda de blusas específicas para um evento de jovens cristãos.',
    status: ProjectStatus.COMPLETED,
    tech: ['Next.js', 'Typescript', 'Tailwind', 'API Whatsapp'],
    repoUrl: 'https://github.com/DavidBen48/connect-sao-bento',
    deployUrl: 'https://connect-saobento.vercel.app/',
  },
  {
    title: 'API Rest with Golang',
    description: 'API completa feita com Golang usando todos os métodos HTTP.',
    status: ProjectStatus.IN_PROGRESS,
    tech: ['Golang', 'Docker', 'Postman', 'SQL'],
  },
  {
    title: 'Loja de Chá',
    description: 'Loja feita para uma venda específica de produtos de chá.',
    status: ProjectStatus.UNDER_CONSTRUCTION,
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'API Whatsapp'],
  },
  {
    title: 'API with PHP',
    description: 'API completa feita com PHP usando todos os métodos HTTP.',
    status: ProjectStatus.IN_PROGRESS,
    tech: ['PHP', 'Laravel', 'Postman', 'PostgreSQL'],
  },
];

const getStatusClass = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.COMPLETED:
      return 'bg-green-500 text-green-900';
    case ProjectStatus.IN_PROGRESS:
      return 'bg-yellow-500 text-yellow-900';
    case ProjectStatus.UNDER_CONSTRUCTION:
      return 'bg-blue-500 text-blue-900';
    default:
      return 'bg-gray-500 text-gray-900';
  }
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-green-400 green-glow text-center">
      {children}
    </h2>
  );

const GithubIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const DeployIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="border border-green-700 bg-gray-900 bg-opacity-40 p-6 rounded-lg flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300 green-glow-border">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-white">{project.title}</h3>
      <span
        className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(
          project.status
        )}`}
      >
        {project.status}
      </span>
    </div>
    <p className="text-gray-400 mb-6 flex-grow">{project.description}</p>
    <div className='mt-auto'>
        <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
                <span
                key={t}
                className="bg-gray-800 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                {t}
                </span>
            ))}
        </div>
        <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-700 border-opacity-50">
            {project.repoUrl ? (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                    <GithubIcon />
                    <span>Repositório</span>
                </a>
            ) : (
                <div className="flex items-center space-x-2 text-gray-600 cursor-not-allowed">
                    <GithubIcon />
                    <span>Repositório</span>
                </div>
            )}
            {project.deployUrl ? (
                <a href={project.deployUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                    <DeployIcon />
                    <span>Deploy</span>
                </a>
            ) : (
                <div className="flex items-center space-x-2 text-gray-600 cursor-not-allowed">
                    <DeployIcon />
                    <span>Deploy</span>
                </div>
            )}
        </div>
    </div>
  </div>
);

const Projects: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<ProjectStatus | 'All'>('All');

    const filterOptions: (ProjectStatus | 'All')[] = [
        'All',
        ProjectStatus.COMPLETED,
        ProjectStatus.IN_PROGRESS,
        ProjectStatus.UNDER_CONSTRUCTION,
    ];

    const filteredProjects = projects.filter(project => {
        if (activeFilter === 'All') return true;
        return project.status === activeFilter;
    });

  return (
    <section id="projects" className="py-20">
      <SectionTitle>Projetos</SectionTitle>
      
      <div className="max-w-7xl mx-auto p-8 md:p-12">
        <div className="flex justify-center flex-wrap gap-4 mb-12">
            {filterOptions.map(option => (
                <button
                    key={option}
                    onClick={() => setActiveFilter(option)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                    activeFilter === option
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-green-400 hover:bg-green-700 hover:text-white'
                    }`}
                >
                    {option === 'All' ? 'Todos' : option}
                </button>
            ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;