import React, { useRef } from 'react';
import { UploadedImage } from '../types';

interface ThumbnailUploadProps {
  image: UploadedImage | null;
  onImageChange: (img: UploadedImage | null) => void;
}

const ThumbnailUpload: React.FC<ThumbnailUploadProps> = ({ image, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageChange({
        file,
        previewUrl: URL.createObjectURL(file),
        base64
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
        Thumbnail Preview
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`
          relative w-full aspect-video rounded-xl border-2 border-dashed 
          transition-all duration-300 cursor-pointer overflow-hidden group
          ${image ? 'border-brand-500 bg-black' : 'border-gray-700 hover:border-brand-500 bg-gray-900 hover:bg-gray-800'}
        `}
      >
        {image ? (
          <>
            <img 
              src={image.previewUrl} 
              alt="Thumbnail preview" 
              className="w-full h-full object-contain" 
            />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white font-bold uppercase tracking-widest">Change Image</span>
            </div>
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-brand-600 text-white rounded-full p-2 shadow-lg hover:bg-brand-700 transition-colors z-10"
              title="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-gray-700 group-hover:border-brand-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 group-hover:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <p className="font-bold text-gray-400 group-hover:text-gray-200 transition-colors">Drag & Drop Thumbnail</p>
            <p className="text-xs mt-1 text-gray-600">1280x720 recommended</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ThumbnailUpload;