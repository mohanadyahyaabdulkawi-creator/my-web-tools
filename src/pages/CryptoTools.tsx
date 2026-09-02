import { useState, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import { Binary, Hash, Code2, Copy, Check } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useSEO } from '@/hooks/useSEO';

type HashMode = 'md5' | 'sha256';
type CryptoTab = 'hash' | 'base64';

export default function CryptoTools() {
  useSEO({
    title: 'Hash Generator & Base64 Encoder/Decoder — Crypto Tools | ToolKit',
    description:
      'Generate MD5 and SHA-256 hashes, encode and decode Base64 instantly. Free online crypto tools, 100% client-side and private.',
  });

  const [tab, setTab] = useState<CryptoTab>('hash');

  return (
    <div>
      <PageHeader
        title="Hash & Crypto Tools"
        description="Generate MD5 and SHA-256 hashes, encode and decode Base64 — all locally in your browser."
        icon={<Binary className="w-6 h-6" />}
      />

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('hash')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            tab === 'hash' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          <Hash className="w-4 h-4" /> Hash Generator
        </button>
        <button
          onClick={() => setTab('base64')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            tab === 'base64' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          <Code2 className="w-4 h-4" /> Base64 Encode/Decode
        </button>
      </div>

      {tab === 'hash' ? <HashGenerator /> : <Base64Tool />}
    </div>
  );
}

function HashGenerator() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<HashMode>('sha256');

  const hash = useMemo(() => {
    if (!input) return '';
    return mode === 'md5' ? CryptoJS.MD5(input).toString() : CryptoJS.SHA256(input).toString();
  }, [input, mode]);

  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode('md5')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'md5' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          MD5
        </button>
        <button
          onClick={() => setMode('sha256')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'sha256' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          SHA-256
        </button>
      </div>

      <div>
        <label className="label">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={4}
          className="input resize-none font-mono"
        />
      </div>

      <div>
        <label className="label">Hash Result ({mode.toUpperCase()})</label>
        <div className="flex items-start gap-2">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 break-all font-mono text-sm text-gray-900 dark:text-white min-h-[56px]">
            {hash || <span className="text-gray-400">Hash will appear here...</span>}
          </div>
          <button onClick={copy} disabled={!hash} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0" aria-label="Copy hash">
            {copied ? <Check className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const output = useMemo(() => {
    if (!input) { setError(''); return ''; }
    try {
      if (mode === 'encode') {
        setError('');
        return btoa(unescape(encodeURIComponent(input)));
      } else {
        setError('');
        return decodeURIComponent(escape(atob(input)));
      }
    } catch {
      setError('Invalid Base64 input — cannot decode.');
      return '';
    }
  }, [input, mode]);

  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
        >
          Decode
        </button>
      </div>

      <div>
        <label className="label">{mode === 'encode' ? 'Plain Text' : 'Base64 String'}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
          rows={4}
          className="input resize-none font-mono"
        />
      </div>

      <div>
        <label className="label">Result</label>
        <div className="flex items-start gap-2">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 break-all font-mono text-sm text-gray-900 dark:text-white min-h-[56px]">
            {error ? <span className="text-error-500">{error}</span> : output || <span className="text-gray-400">Result will appear here...</span>}
          </div>
          <button onClick={copy} disabled={!output || !!error} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0" aria-label="Copy result">
            {copied ? <Check className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
          </button>
        </div>
      </div>
    </div>
  );
}
