import { GoogleGenAI, Chat } from "@google/genai";

const RESUME_DATA = `
David Ben de Oliveira Vieira, 24 anos
AI-Powered FullStack Developer
Tecnologias: NextJS | TypeScript | Tailwind | Supabase | Golang | PHP
Localização: Belford Roxo, Rio de Janeiro
Contato: (21) 99480-8526 | davidbensaxofonista@gmail.com

Sobre:
Desenvolvedor com 1 ano e 6 meses de estudo, buscando a primeira oportunidade para estágio/júnior em Desenvolvimento de Software, Desenvolvimento de Sistemas, Desenvolvimento FullStack, e áreas similares. Possuo experiência de trabalho apenas na área de dados.

Conhecimentos:
- Experiência em desenvolvimento web usando IDE com IA (Cursor AI, Dyad e Windsurf AI) e IDE Web com IA (v0.dev e Lovable).
- Conhecimento em criação de Micro-SaaS.
- Especializado em criar prompts extensos e detalhados, ensinando a IA os métodos que desejo implementar nos projetos.
- Experiência acadêmica em REST API e Microsserviços utilizando Golang, Postman, Docker, Swagger, Arquitetura MVC e SQL.
- Conhecimento amplo em Análise de Dados utilizando Python (Pandas, NumPy e PySpark) e ferramentas de BI (Looker Studio e PowerBI).

Experiência Profissional:
E-Soft Sistemas LTDA – Analista de Banco de Dados - Estágio | 2021 – 2022
- Realizava análises das vendas com Python e Power BI.
- Tarefas CRUD usando Firebird.
- Cuidava dos dados empresariais salvos na nuvem.

Educação:
- Ciência da Computação, Faculdade Anhanguera | 2025 - 2029
  - Cursos incluem: Matemática Computacional e Lógica com C e C++; Análise de Dados com Python e Modelagem de Dados SQL; Desenvolvimento Frontend (JS) e Backend (Java).
- Desenvolvimento Fullstack, Curso Recode PRO | 2024 - 2025 (concluído)
  - Cursos incluem: React, NextJS, TypeScript, TailwindCSS, Java, Spring, Docker, PostgreSQL, IA para Desenvolvimento Web (Prompts e Cursor AI).
`;

const SYSTEM_INSTRUCTION = `
Você é Ben.AI, um assistente virtual inteligente e profissional para o portfólio de David Ben de Oliveira Vieira. Sua única função é responder perguntas sobre a carreira, habilidades, educação e experiência de David, com base estritamente nas informações do currículo fornecido abaixo.

**Regras estritas:**
1.  **Foco Exclusivo:** Responda APENAS a perguntas relacionadas a David Ben. Se um usuário perguntar sobre qualquer outro tópico, responda educadamente: "Meu propósito é fornecer informações sobre a carreira de David Ben. Você tem alguma pergunta sobre as habilidades ou experiências dele?".
2.  **Base de Conhecimento:** Use APENAS as informações do currículo a seguir. Não invente informações.
3.  **Incapacidade de Responder:** Se você não conseguir encontrar a resposta para uma pergunta específica sobre David no currículo, sua única e exclusiva resposta deve ser o token especial: \`[WHATSAPP]\`. Não adicione nenhuma outra palavra, explicação ou saudação. Apenas \`[WHATSAPP]\`.

**Currículo de David Ben:**
---
${RESUME_DATA}
---
`;


let chat: Chat | null = null;
let isInitialized = false;

export const initializeChat = (): Chat | null => {
  if (isInitialized) return chat;

  isInitialized = true; // Attempt initialization only once.
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Chatbot will be disabled.");
    return null;
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return chat;
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
    chat = null;
    return null;
  }
};

export const getChat = (): Chat | null => {
  if (!isInitialized) {
    return initializeChat();
  }
  return chat;
};