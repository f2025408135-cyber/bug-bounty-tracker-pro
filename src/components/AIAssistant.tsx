import React, { useState, useRef, useEffect } from 'react';
import { LLMModel, Bug } from '../types';
import { Bot, Send, User, Sparkles, Cpu, ChevronDown, X, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  contextBug?: Bug | null; // Optional bug context for analysis
}

const MODELS: LLMModel[] = ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Llama 3', 'Mistral Large'];

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, contextBug }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your Bug Bounty Assistant. How can I help you analyze vulnerabilities or generate payloads today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<LLMModel>('GPT-4o');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle context injection when bug changes
  useEffect(() => {
    if (contextBug && isOpen) {
      const contextMessage = `Analyze this bug: "${contextBug.title}" (Severity: ${contextBug.severity}).\nDescription: ${contextBug.description}\nTarget: ${contextBug.target}`;
      setInput(contextMessage);
    }
  }, [contextBug, isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Assistant response delay based on model
    setTimeout(() => {
      let responseContent = '';
      const prompt = userMsg.content.toLowerCase();
      
      if (prompt.includes('analyze') || prompt.includes('xss') || prompt.includes('sqli')) {
        responseContent = `Based on my analysis using **${selectedModel}**, this vulnerability looks promising. I recommend checking the input sanitization logic. Here is a potential bypass payload:\n\`<script>alert(document.domain)</script>\`\nMake sure to verify if WAF is active on ${contextBug?.target || 'the target'}.`;
      } else if (prompt.includes('report') || prompt.includes('writeup')) {
        responseContent = `Here is a drafted report structure for **${contextBug?.title || 'the vulnerability'}**:\n\n**1. Description:**\n[Detailed explanation]\n\n**2. Impact:**\nAllows unauthorized actions...\n\n**3. Remediation:**\nImplement proper input validation and parameterized queries.`;
      } else {
        responseContent = `As an assistant powered by **${selectedModel}**, I'm ready to assist with recon strategies, payload crafting, or report writing. What specific area are you focusing on?`;
      }

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseContent
      }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5s - 2.5s simulated delay
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Assistant</h3>
            <p className="text-xs text-blue-100 opacity-90">Powered by {selectedModel}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Model Selector Bar */}
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 relative">
        <button 
          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
          className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors w-full justify-between"
        >
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-500" />
            Current Model: <span className="text-blue-600">{selectedModel}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isModelDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 py-1 overflow-hidden">
            {MODELS.map(model => (
              <button
                key={model}
                onClick={() => { setSelectedModel(model); setIsModelDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-blue-50 transition-colors ${selectedModel === model ? 'bg-blue-50/50 text-blue-600 font-semibold' : 'text-gray-700'}`}
              >
                {model}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 relative">
        {contextBug && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 flex items-start gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p>Context injected: <strong>{contextBug.title}</strong></p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none whitespace-pre-wrap'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white border border-gray-100 flex items-center gap-1 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-xs text-gray-500 ml-1">{selectedModel} is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-end shadow-sm border border-gray-200 rounded-xl bg-gray-50 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${selectedModel} for help...`}
            className="w-full max-h-32 min-h-[44px] py-3 pl-4 pr-12 bg-transparent border-none focus:ring-0 resize-none text-sm text-gray-800"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">Automated tools can make mistakes. Verify payloads before using.</p>
      </div>

    </div>
  );
};

export default AIAssistant;
