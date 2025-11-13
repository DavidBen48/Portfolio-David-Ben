import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { getChat } from '../services/geminiService';
import { Chat } from '@google/genai';


const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-green-400 green-glow text-center">
    {children}
  </h2>
);

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      author: MessageAuthor.BOT,
      text: 'Olá! Sou Ben.AI, o assistente virtual de David. Como posso ajudar a saber mais sobre ele?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    chatRef.current = getChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        if (!chatRef.current) {
            throw new Error("Chat not initialized");
        }
      const result = await chatRef.current.sendMessageStream({ message: input });
      
      let botResponseText = '';
      setMessages(prev => [...prev, { author: MessageAuthor.BOT, text: '' }]);

      for await (const chunk of result) {
        const chunkText = chunk.text;
        botResponseText += chunkText;
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if(lastMessage.author === MessageAuthor.BOT){
                lastMessage.text = botResponseText;
            }
            return newMessages;
        });
      }
      
      if (botResponseText.includes('[WHATSAPP]')) {
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if(lastMsg.author === MessageAuthor.BOT){
                lastMsg.text = "Não encontrei essa informação. Gostaria de falar diretamente com o David?";
                lastMsg.isWhatsappButton = true;
            }
            return newMessages;
        });
      }

    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      setMessages((prev) => [
        ...prev,
        {
          author: MessageAuthor.BOT,
          text: 'Desculpe, ocorreu um erro. Tente novamente mais tarde.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

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
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.isWhatsappButton && (
                    <a href="https://wa.me/5521994808526" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                        Chamar no WhatsApp
                    </a>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
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
            placeholder="Pergunte sobre minhas habilidades..."
            className="flex-grow bg-gray-800 text-white placeholder-gray-500 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
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
