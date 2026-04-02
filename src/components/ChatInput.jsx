import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { parseNaturalLanguage, parsedToSearchParams } from '../utils/nlpParser.js';

const EXAMPLES = [
  'Barcelona to London, April 10-22',
  'From Munich to Rome, 7 nights',
  'Paris to Amsterdam, next week for 2 adults',
  'Tokyo to Bangkok, May 1-15, 4 people'
];

export default function ChatInput({ onSearchParsed, loading = false }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '✈️ Hi! I can help you plan your trip. Try saying something like "Barcelona to London, April 10-22"',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing || loading) return;

    // Add user message
    const userMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Process input
    setIsProcessing(true);
    const parsed = parseNaturalLanguage(input);

    // Add assistant response
    let responseText = '';
    let assistantMessage = null;

    if (parsed.confidence === 'high') {
      const searchParams = parsedToSearchParams(parsed);
      responseText = `🎯 Perfect! Found:\n${parsed.origin} → ${parsed.destination}\n${parsed.startDate} to ${parsed.endDate}\n${parsed.adults} adult${parsed.adults !== 1 ? 's' : ''}${parsed.children > 0 ? `, ${parsed.children} child${parsed.children !== 1 ? 'ren' : ''}` : ''}`;
      assistantMessage = {
        role: 'assistant',
        text: responseText,
        timestamp: new Date(),
        action: 'search',
        confidence: parsed.confidence,
        params: searchParams
      };
    } else if (parsed.confidence === 'medium') {
      responseText = `🤔 Mostly got it, but missing: ${parsed.missingFields.join(', ')}\n\nCan you clarify?`;
      assistantMessage = {
        role: 'assistant',
        text: responseText,
        timestamp: new Date(),
        confidence: parsed.confidence
      };
    } else {
      responseText = `🤔 I didn't quite get that. Please provide: origin city, destination city, and dates.\n\nExample: "Barcelona to London, April 10-22"`;
      assistantMessage = {
        role: 'assistant',
        text: responseText,
        timestamp: new Date(),
        confidence: parsed.confidence
      };
    }

    setMessages(prev => [...prev, assistantMessage]);

    // Trigger search if high confidence
    if (parsed.confidence === 'high' && assistantMessage.params && onSearchParsed) {
      setTimeout(() => {
        onSearchParsed(assistantMessage.params);
        setIsProcessing(false);
      }, 500);
    } else {
      setIsProcessing(false);
    }

    setInput('');
  };

  const handleExampleClick = (example) => {
    setInput(example);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={clsx(
              'flex gap-2 animate-fade-in',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={clsx(
                'max-w-xs px-4 py-3 rounded-lg whitespace-pre-wrap text-sm',
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none shadow-sm'
              )}
            >
              <div>{msg.text}</div>
              {msg.confidence && (
                <div className="text-xs mt-2 opacity-75 flex items-center gap-1">
                  {msg.confidence === 'high' && '🎯 High confidence'}
                  {msg.confidence === 'medium' && '🤔 Partial confidence'}
                  {msg.confidence === 'low' && '❓ Low confidence'}
                </div>
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex gap-2 justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <Loader2 size={16} className="animate-spin text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Examples (if no messages history) */}
      {messages.length <= 1 && !isProcessing && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Try:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Barcelona to London, April 10-22..."
            disabled={isProcessing || loading}
            className={clsx(
              'flex-1 px-4 py-2 rounded-xl border text-sm',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
              'border-gray-300 dark:border-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-150'
            )}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing || loading}
            className={clsx(
              'p-2 rounded-xl transition-all duration-150',
              input.trim() && !isProcessing && !loading
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
