"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Message, MessageRole } from "../types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatInterfaceProps {
  chatId?: string;
  onChatCreated?: (chatId: string) => void;
}

const DEFAULT_BOT_MESSAGE: Message = {
  id: "1",
  role: "bot",
  content:
    "¡Hola! Soy ESCOMBOT. Puedo ayudarte con información sobre inscripciones, constancias, reglamentos y más. ¿Qué necesitas saber hoy?",
  timestamp: new Date().toISOString(),
};

export default function ChatInterface({ chatId, onChatCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_BOT_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
    setIsMounted(true); }, []);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Cargar mensajes cuando cambia el chatId
  useEffect(() => {
    if (!chatId) return;

    setCurrentChatId(chatId);

    // Resetear mensajes mientras carga (sin tocar el prompt inicial)
    setMessages([DEFAULT_BOT_MESSAGE]);

    loadMessagesForChat(chatId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const loadMessagesForChat = async (id: string) => {
    if (!id) {
      setMessages([DEFAULT_BOT_MESSAGE]);
      return;
    }

    try {
      const res = await fetch(`/api/chats/${id}/messages`, {
        method: "GET",
        credentials: 'include',
      });

      if (!res.ok) {
        // Si no hay autorización o no existe, no explotes: deja el bot inicial
        setMessages([DEFAULT_BOT_MESSAGE]);
        return;
      }

      const data = await res.json().catch(() => ({}));
      const rawMessages = Array.isArray(data?.messages) ? data.messages : [];

      const formattedMessages: Message[] = rawMessages.map((msg: any) => ({
        id: String(msg.id),
        role: (msg.role as MessageRole) ?? "bot",
        content: String(msg.content ?? ""),
        timestamp: String(msg.timestamp || msg.createdAt || new Date().toISOString()),
      }));

      setMessages(formattedMessages.length > 0 ? formattedMessages : [DEFAULT_BOT_MESSAGE]);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([DEFAULT_BOT_MESSAGE]);
    }
  };

  const createChatIfNeeded = async (title: string): Promise<string | undefined> => {
    // Intenta crear chat (solo si existe sesión). Si falla, regresa null y se usa modo anónimo.
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ title }),
      });

      if (!res.ok) return undefined;

      const data = await res.json().catch(() => null);
      const newId = data?.chat?.id as string | undefined;

      if (!newId) return undefined;

      setCurrentChatId(newId);
      onChatCreated?.(newId);
      return newId;
    } catch {
      return undefined;
    }
  };

  const sendAnonymous = async (content: string): Promise<Message> => {
    const response = await fetch("/api/messages-anonymous", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ message: content }),
    });

    if (!response.ok) {
      throw new Error(`Anonymous API error: ${response.status}`);
    }

    const data = await response.json().catch(() => null);

    // Si tu endpoint ya regresa botMessage, lo usamos. Si no, fallback.
    const bm = data?.botMessage;
    if (bm?.content) {
      return {
        id: String(bm.id ?? Date.now() + 1),
        role: "bot",
        content: String(bm.content),
        timestamp: String(bm.timestamp ?? new Date().toISOString()),
      };
    }

    // Fallback por si el endpoint responde diferente (por ejemplo {message: "..."} )
    const msgText = data?.message ?? "No pude responder en este momento.";
    return {
      id: String(Date.now() + 1),
      role: "bot",
      content: String(msgText),
      timestamp: new Date().toISOString(),
    };
  };

  const sendAuthenticated = async (chatId: string, content: string): Promise<Message> => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ chatId, message: content }),
    });

    // Si te da 401/405/500, lo tratamos como falla para poder caer a anónimo si lo deseas
    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      throw new Error(`Auth API error: ${response.status} ${JSON.stringify(errBody)}`);
    }

    const data = await response.json().catch(() => null);

    const bot = data?.botMessage;
    if (!bot?.content) {
      // Fallback si el backend no trae botMessage como esperas
      return {
        id: String(Date.now() + 1),
        role: "bot",
        content: "No pude obtener respuesta del servidor.",
        timestamp: new Date().toISOString(),
      };
    }

    return {
      id: String(bot.id),
      role: "bot",
      content: String(bot.content),
      timestamp: String(bot.timestamp ?? new Date().toISOString()),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const content = input.trim();
    if (!content) return;

    // Optimista: mostramos el mensaje del usuario de inmediato
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let targetChatId = currentChatId;

      // Si no hay chatId actual, intenta crearlo. Si no puede, se usará modo anónimo.
      if (!targetChatId) {
        targetChatId = await createChatIfNeeded(content.substring(0, 60));
      }

      let botMessage: Message;

      if (!targetChatId) {
        // Modo anónimo
        botMessage = await sendAnonymous(content);
      } else {
        // Modo autenticado
        try {
          botMessage = await sendAuthenticated(targetChatId, content);
        } catch (err) {
          // Si falla el modo autenticado (por ejemplo 401/405), cae a modo anónimo (sin cambiar tu prompt)
          console.error("Authenticated send failed, falling back to anonymous:", err);
          botMessage = await sendAnonymous(content);
        }
      }

      setMessages((prev) => [...prev, botMessage]);

      // No recargar mensajes - ya están en el estado local
      // Si es primer mensaje de un nuevo chat, ya lo creamos con el ID
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] sm:h-full w-full max-w-4xl mx-auto bg-gray-50 sm:rounded-xl md:rounded-2xl sm:shadow-md md:shadow-xl overflow-hidden border border-gray-100">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === "user" ? "bg-[#0b6696]" : "bg-gray-200"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-gray-600" />
              )}
            </div>

            <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-[#0b6696] text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-sm prose-gray max-w-none"
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className={`${
                          msg.role === "user"
                            ? "text-[#0b6696] hover:text-white"
                            : "text-[#0b6696] hover:text-[#0b6696]"
                        } underline`}
                      />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {isMounted ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }): ""}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot className="w-5 h-5 text-gray-600" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
              <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta sobre trámites escolares..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-blue-900/10"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
