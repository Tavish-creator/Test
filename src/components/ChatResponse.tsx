import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Bot, User, Loader2 } from 'lucide-react';

interface ChatResponseProps {
  response: string;
  isLoading: boolean;
}

export default function ChatResponse({ response, isLoading }: ChatResponseProps) {
  if (!response && !isLoading) return null;

  return (
    <div className="space-y-6 mt-8">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            <p className="text-gray-600 font-medium">Declutterbot is analyzing your space...</p>
          </div>
        </motion.div>
      )}

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex-1">
            <div className="prose prose-indigo max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-headings:text-gray-900 prose-strong:text-gray-900">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
