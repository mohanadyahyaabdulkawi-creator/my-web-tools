import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Link2, Type } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useSEO } from '@/hooks/useSEO';

type InputMode = 'url' | 'text';

export default function QRGenerator() {
  useSEO({
    title: 'QR Code Generator — Create & Download QR Codes Free | ToolKit',
    description:
      'Generate QR codes from URLs or text instantly. Download as PNG or SVG. Free, fast, and 100% client-side QR code generator.',
  });

  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [text, setText] = useState('https://');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dataUrl, setDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(() => {
    if (!text.trim()) {
      setDataUrl('');
      setSvgString('');
      return;
    }
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      color: { dark: fgColor, light: bgColor },
      margin: 2,
    }).catch(() => {});

    QRCode.toDataURL(text, {
      width: size,
      color: { dark: fgColor, light: bgColor },
      margin: 2,
    })
      .then((url) => setDataUrl(url))
      .catch(() => setDataUrl(''));

    QRCode.toString(text, {
      type: 'svg',
      color: { dark: fgColor, light: bgColor },
      margin: 2,
    })
      .then((svg) => setSvgString(svg))
      .catch(() => setSvgString(''));
  }, [text, size, fgColor, bgColor]);

  useEffect(() => {
    generate();
  }, [generate]);

  const downloadPNG = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  const downloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="QR Code Generator"
        description="Create QR codes from URLs or text and download them as PNG or SVG."
        icon={<QrCode className="w-6 h-6" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="card p-6 space-y-4">
          <div>
            <label className="label">Input Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInputMode('url')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  inputMode === 'url' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Link2 className="w-4 h-4" /> URL
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  inputMode === 'text' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Type className="w-4 h-4" /> Text
              </button>
            </div>
          </div>

          <div>
            <label className="label">{inputMode === 'url' ? 'URL' : 'Text'}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={inputMode === 'url' ? 'https://example.com' : 'Enter any text...'}
              rows={3}
              className="input resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Foreground</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="label">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{bgColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Size: {size}px</label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="card p-6 flex flex-col items-center justify-center">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 self-start">Preview</h2>
          <div className="flex-1 flex items-center justify-center w-full">
            {text.trim() ? (
              <div className="rounded-xl overflow-hidden bg-white p-4 shadow-sm">
                <canvas ref={canvasRef} className="max-w-full" />
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Enter text or URL to generate QR code</p>
            )}
          </div>
          {text.trim() && (
            <div className="flex gap-3 mt-6 w-full">
              <button onClick={downloadPNG} className="btn-primary flex-1">
                <Download className="w-4 h-4" /> PNG
              </button>
              <button onClick={downloadSVG} className="btn-secondary flex-1">
                <Download className="w-4 h-4" /> SVG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
