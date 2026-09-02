import { useRef, useState, useCallback } from 'react';
import { Image as ImageIcon, Upload, Download, RotateCcw } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useSEO } from '@/hooks/useSEO';
import { formatFileSize } from '@/utils/sanitize';

type Format = 'image/jpeg' | 'image/webp' | 'image/png';

interface ProcessedImage {
  url: string;
  blob: Blob;
  size: number;
  format: Format;
}

export default function ImageCompressor() {
  useSEO({
    title: 'Image Compressor & Converter — Free Online Tool | ToolKit',
    description:
      'Compress and convert images between JPG, WebP, and PNG directly in your browser. Fast client-side image resizing with HTML5 Canvas. No upload required.',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [targetFormat, setTargetFormat] = useState<Format>('image/webp');
  const [maxWidth, setMaxWidth] = useState(1920);
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setOriginalFile(file);
    const img = new Image();
    img.onload = () => setOriginalImage(img);
    img.src = URL.createObjectURL(file);
    setProcessed(null);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadImage(file);
  };

  const processImage = useCallback(() => {
    if (!originalImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = originalImage.naturalWidth;
    let height = originalImage.naturalHeight;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(originalImage, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setProcessed({ url, blob, size: blob.size, format: targetFormat });
      },
      targetFormat,
      quality
    );
  }, [originalImage, targetFormat, quality, maxWidth]);

  const download = () => {
    if (!processed) return;
    const a = document.createElement('a');
    a.href = processed.url;
    const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/webp' ? 'webp' : 'png';
    a.download = `compressed.${ext}`;
    a.click();
  };

  const reset = () => {
    setOriginalImage(null);
    setOriginalFile(null);
    setProcessed(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatLabel = (f: Format) => f === 'image/jpeg' ? 'JPG' : f === 'image/webp' ? 'WebP' : 'PNG';

  return (
    <div>
      <PageHeader
        title="Image Compressor & Converter"
        description="Resize and convert images between JPG, WebP, and PNG — all processed locally in your browser."
        icon={<ImageIcon className="w-6 h-6" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & controls */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">1. Upload Image</h2>
          {!originalImage ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-primary-400'
              }`}
            >
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Click to upload or drag &amp; drop</p>
              <p className="text-sm text-gray-400 mt-1">JPG, PNG, WebP supported</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={originalImage.src} alt="Original" className="w-full h-48 object-contain" />
              </div>
              {originalFile && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {originalFile.name} — {formatFileSize(originalFile.size)}
                </p>
              )}
              <button onClick={reset} className="btn-secondary text-sm">
                <RotateCcw className="w-4 h-4" /> Choose different image
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          <canvas ref={canvasRef} className="hidden" />

          {originalImage && (
            <>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 mt-6">2. Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Output Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['image/jpeg', 'image/webp', 'image/png'] as Format[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setTargetFormat(f)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          targetFormat === f
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {formatLabel(f)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Quality: {Math.round(quality * 100)}%</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-primary-600"
                    disabled={targetFormat === 'image/png'}
                  />
                  {targetFormat === 'image/png' && (
                    <p className="text-xs text-gray-400 mt-1">PNG is lossless — quality setting doesn't apply.</p>
                  )}
                </div>
                <div>
                  <label className="label">Max Width: {maxWidth}px</label>
                  <input
                    type="range"
                    min="320"
                    max="3840"
                    step="160"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    className="w-full accent-primary-600"
                  />
                </div>
                <button onClick={processImage} className="btn-primary w-full">
                  Compress &amp; Convert
                </button>
              </div>
            </>
          )}
        </div>

        {/* Result */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">3. Result</h2>
          {!processed ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              Processed image will appear here
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={processed.url} alt="Processed" className="w-full h-48 object-contain" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Original</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{originalFile ? formatFileSize(originalFile.size) : '—'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Compressed</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatFileSize(processed.size)}</p>
                </div>
              </div>
              {originalFile && processed.size < originalFile.size && (
                <div className="bg-success-50 dark:bg-success-700/20 text-success-700 dark:text-success-400 rounded-xl p-3 text-sm font-medium">
                  Saved {Math.round((1 - processed.size / originalFile.size) * 100)}% file size reduction!
                </div>
              )}
              <button onClick={download} className="btn-accent w-full">
                <Download className="w-4 h-4" /> Download {formatLabel(targetFormat)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
