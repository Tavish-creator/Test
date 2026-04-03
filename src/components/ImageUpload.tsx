import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/src/lib/utils';

interface ImageUploadProps {
  onImageSelect: (base64: string | null) => void;
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onImageSelect(base64.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[240px]",
            isDragging 
              ? "border-indigo-500 bg-indigo-500/10" 
              : "border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900/50"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-white">Upload a photo of your room</p>
            <p className="text-sm text-zinc-500 mt-1">Drag and drop or click to browse</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video max-h-[400px] flex items-center justify-center">
          <img
            src={preview}
            alt="Room preview"
            className="max-w-full max-h-full object-contain"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={clearImage}
            className="absolute top-4 right-4 p-2 bg-zinc-900/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-950 hover:text-red-400 transition-all duration-200 border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
