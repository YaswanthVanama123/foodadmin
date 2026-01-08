import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/Button';

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, error }) => {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setPreview(undefined);
    onChange(null);
  }, [onChange]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Item Image
      </label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }
          `}
        >
          <ImageIcon className={`mx-auto h-12 w-12 mb-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Drag and drop an image here, or click to browse
            </p>
            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 px-3 py-1.5 text-sm">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </span>
            </label>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
