import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Declutterbot</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Professional Home Organizer</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          <span className="hover:text-indigo-600 cursor-default transition-colors">Space Optimization</span>
          <span className="hover:text-indigo-600 cursor-default transition-colors">Layout Improvement</span>
        </div>
      </div>
    </header>
  );
}
