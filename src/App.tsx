import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Eraser, Info } from 'lucide-react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import ChatResponse from './components/ChatResponse';

const SYSTEM_INSTRUCTION = `You are Declutterbot, a professional home organization assistant. 
Your expertise includes space optimization, decluttering strategies, layout improvement, simple room enhancement ideas, and theme-based suggestions.

Tone: Professional, polite, calm, and encouraging.
Constraints:
- Never assume personal or private information about the user.
- Never criticize or shame the user for the state of their room.
- Never suggest expensive or major renovations unless clearly justified by the image (e.g., structural damage).
- Only organize rooms in a house. If the image is not a room in a house, politely decline and explain your purpose.

Response Structure:
1. Brief Room Summary: A concise, objective description of the space as seen in the photo.
2. Step-by-Step Instructions: A logical, numbered list of actions to organize and declutter the space.
3. Useful Additions: A list of items (e.g., storage bins, shelves, lighting) that could enhance the organized space.
4. Theme Selection Offer: After the suggestions, ask if the user would like to explore specific theme-based improvement suggestions (e.g., Minimalist, Cozy, Modern, etc.).

Always maintain a helpful and non-judgmental attitude.`;

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!image) {
      setError('Please upload a photo of your room first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = 'gemini-3-flash-preview';
      
      const contents = {
        parts: [
          { text: prompt || "Please analyze this room and provide organization advice." },
          { inlineData: { mimeType: "image/png", data: image } }
        ]
      };

      const result = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      setResponse(result?.text || 'I apologize, but I was unable to generate a response. Please try again.');
    } catch (err) {
      console.error('AI Analysis Error:', err);
      setError('An error occurred while analyzing the image. Please ensure your API key is valid and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setPrompt('');
    setResponse('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Info className="w-5 h-5" />
                <h2 className="font-semibold uppercase tracking-wider text-sm">How it works</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Upload a photo of any room in your home. Declutterbot will analyze the space and provide a professional organization plan tailored to your needs.
              </p>
            </section>

            <div className="bg-zinc-900 p-6 rounded-3xl shadow-xl border border-zinc-800 space-y-6">
              <ImageUpload onImageSelect={setImage} />
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-zinc-300">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., This is my home office. I need more desk space and better cable management."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-24 text-sm placeholder:text-zinc-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !image}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
                >
                  {isLoading ? (
                    <>Analyzing...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Analyze Space
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="p-3 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-800 transition-colors"
                  title="Reset"
                >
                  <Eraser className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-400 font-medium bg-red-950/30 p-3 rounded-lg border border-red-900/50"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!response && !isLoading ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/50"
                >
                  <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
                    <Info className="w-10 h-10 text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Your Plan Awaits</h3>
                  <p className="text-zinc-500 max-w-xs">
                    Upload a photo and click analyze to receive your personalized organization strategy.
                  </p>
                </motion.div>
              ) : (
                <ChatResponse key="response" response={response} isLoading={isLoading} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-zinc-800 text-center text-sm text-zinc-500">
        <p>© 2026 Declutterbot. Your professional home organization partner.</p>
      </footer>
    </div>
  );
}
