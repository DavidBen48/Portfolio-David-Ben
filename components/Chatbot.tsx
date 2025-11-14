import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageAuthor, GroundingSource } from '../types';
import { streamResponse } from '../services/geminiService';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-green-400 green-glow text-center">
    {children}
  </h2>
);

const isAffirmative = (text: string) => {
    const affirmativeWords = ['sim', 'yes', 'pode', 'quero', 'claro', 'com certeza', 'ok', 'prossiga'];
    const lowerText = text.toLowerCase().trim();
    return affirmativeWords.some(word => lowerText.includes(word));
}

const GithubIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const DeployIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
);

const renderMessageContent = (text: string) => {
    const regex = /(\[REPO:([^\]]+)\]|\[DEPLOY:([^\]]+)\])/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add the text before the match
        if (match.index > lastIndex) {
            elements.push(text.substring(lastIndex, match.index));
        }

        const repoUrl = match[2];
        const deployUrl = match[3];

        if (repoUrl) {
            elements.push(
                <div key={match.index} className="mt-2">
                    <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                        <GithubIcon /> Repositório
                    </a>
                </div>
            );
        } else if (deployUrl) {
            elements.push(
                <div key={match.index} className="mt-2">
                    <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                        <DeployIcon /> Deploy
                    </a>
                </div>
            );
        }
        
        lastIndex = regex.lastIndex;
    }

    // Add the remaining text after the last match
    if (lastIndex < text.length) {
        elements.push(text.substring(lastIndex));
    }

    // Wrap plain text parts in spans
    return elements.map((part, index) => {
        if (typeof part === 'string') {
            return <span key={index}>{part}</span>;
        }
        return part;
    });
};


const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatAvailable, setIsChatAvailable] = useState(true);
  const [pendingConfirmation, setPendingConfirmation] = useState<{ originalQuestion: string } | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Removed the initial API Key check to ensure the chat is available on Vercel.
    // The UI will start optimistically. Any API key errors will be caught and displayed
    // upon the first message submission.
    setMessages([
      {
        author: MessageAuthor.BOT,
        text: 'Olá! Sou Ben.AI, o assistente virtual de David. Como posso ajudar a saber mais sobre ele?',
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || !isChatAvailable) return;

    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let botResponseText = '';
    let sources: GroundingSource[] | null = null;
    
    // Add a placeholder for the bot's response
    setMessages(prev => [...prev, { author: MessageAuthor.BOT, text: '' }]);

    try {
      let query = trimmedInput;
      let useGoogleSearch = false;
      const history = [...messages, userMessage];

      if (pendingConfirmation) {
        if (isAffirmative(trimmedInput)) {
          query = pendingConfirmation.originalQuestion;
          history[history.length -1].text = query; // Use original question for context
          useGoogleSearch = true;
        } else {
          // User declined the search
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.author === MessageAuthor.BOT) {
                lastMessage.text = "Entendido! Como posso ajudar com informações sobre o David Ben?";
            }
            return newMessages;
          });
          setPendingConfirmation(null);
          setIsLoading(false);
          return;
        }
        setPendingConfirmation(null);
      }
      
      const stream = streamResponse(history, useGoogleSearch);

      for await (const chunk of stream) {
        if (chunk.text) {
          botResponseText += chunk.text;
        }
        if (chunk.sources) {
          sources = (sources || []).concat(chunk.sources);
        }
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if(lastMessage.author === MessageAuthor.BOT){
                lastMessage.text = botResponseText;
                lastMessage.sources = sources;
            }
            return newMessages;
        });
      }

      if (botResponseText.includes('[CONFIRM_SEARCH]')) {
        const cleanText = botResponseText.replace('[CONFIRM_SEARCH]', '').trim();
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = cleanText;
            return newMessages;
        });
        setPendingConfirmation({ originalQuestion: trimmedInput });
      }
      
      if (botResponseText.includes('[WHATSAPP]')) {
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if(lastMsg.author === MessageAuthor.BOT){
                lastMsg.text = "Não encontrei essa informação no meu banco de dados. Gostaria de falar diretamente com o David?";
                lastMsg.isWhatsappButton = true;
            }
            return newMessages;
        });
      }

    } catch (error) {
      console.error('Error streaming response:', error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.author === MessageAuthor.BOT) {
          lastMessage.text = `Desculpe, ocorreu um erro inesperado ao processar sua solicitação.\n\nDetalhe: ${errorMessage}`;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isChatAvailable, messages, pendingConfirmation]);

  return (
    <section id="ben-ai" className="py-20">
      <SectionTitle>Converse com Ben.AI</SectionTitle>
      <div className="max-w-3xl mx-auto border border-green-700 rounded-lg shadow-lg bg-gray-900 bg-opacity-60 green-glow-border flex flex-col">
        <div ref={chatContainerRef} className="h-[70vh] md:h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  msg.author === MessageAuthor.USER
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{renderMessageContent(msg.text)}</div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <h4 className="text-xs font-bold text-gray-400 mb-1">Fontes:</h4>
                    <ul className="text-xs space-y-1">
                      {msg.sources.map((source, i) => (
                        <li key={i}>
                          <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline truncate block" title={source.title}>
                            {i + 1}. {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {msg.isWhatsappButton && (
                    <a href="https://wa.me/5521994808526" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                        Chamar no WhatsApp
                    </a>
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length-1].author === MessageAuthor.USER && (
             <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-green-800 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isChatAvailable ? "Pergunte sobre minhas habilidades..." : "Chat indisponível"}
            className="flex-grow bg-gray-800 text-white placeholder-gray-500 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-700"
            disabled={isLoading || !isChatAvailable}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !isChatAvailable}
            className="bg-green-600 text-white px-6 py-2 rounded-r-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Chatbot;