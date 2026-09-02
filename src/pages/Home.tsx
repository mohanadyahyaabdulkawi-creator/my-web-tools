import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  QrCode,
  Calculator,
  KeyRound,
  Binary,
  AudioLines,
  Shield,
  Zap,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const tools = [
  {
    to: '/image-compressor',
    title: 'Image Compressor & Converter',
    description: 'Resize and convert images between JPG, WebP, and PNG instantly in your browser.',
    icon: ImageIcon,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    to: '/qr-generator',
    title: 'QR Code Generator',
    description: 'Create QR codes from URLs or text and download them as PNG or SVG.',
    icon: QrCode,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    to: '/calculators',
    title: 'Everyday Calculators',
    description: 'Age calculator and BMI calculator with visual health indicators.',
    icon: Calculator,
    color: 'from-amber-500 to-orange-500',
  },
  {
    to: '/password-tools',
    title: 'Password Generator & Tester',
    description: 'Generate strong passwords with a real-time entropy meter and strength tester.',
    icon: KeyRound,
    color: 'from-rose-500 to-red-500',
  },
  {
    to: '/crypto-tools',
    title: 'Hash & Crypto Tools',
    description: 'Generate MD5 and SHA-256 hashes, encode and decode Base64 instantly.',
    icon: Binary,
    color: 'from-violet-500 to-purple-500',
  },
  {
    to: '/text-to-speech',
    title: 'Text-to-Speech & Utilities',
    description: 'Word counter, character counter, and natural speech reader with audio download.',
    icon: AudioLines,
    color: 'from-sky-500 to-indigo-500',
  },
];

const features = [
  { icon: Lock, title: '100% Private', description: 'Everything runs in your browser. No data is ever sent to a server.' },
  { icon: Zap, title: 'Lightning Fast', description: 'Client-side processing means instant results with zero network latency.' },
  { icon: Shield, title: 'Secure by Design', description: 'All inputs are sanitized to prevent XSS and protect your device.' },
];

export default function Home() {
  useSEO({
    title: 'ToolKit — Free Online Everyday & Security Tools',
    description:
      'All-in-one client-side toolkit: image compressor, QR code generator, calculators, password generator, hash & crypto tools, and text-to-speech. 100% private, no server needed.',
  });

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="text-center py-12 sm:py-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
          <Shield className="w-4 h-4" />
          100% Client-Side & Private
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          All-in-One Everyday &amp; Security Tools
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Fast, secure, and privacy-first tools that run entirely in your browser. No sign-up, no data
          collection, no backend.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#tools" className="btn-primary">
            Explore Tools
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        {features.map((f) => (
          <div key={f.title} className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <f.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{f.description}</p>
          </div>
        ))}
      </section>

      {/* Tools grid */}
      <section id="tools" className="scroll-mt-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="card p-6 group hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 animate-slide-up"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tool.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{tool.description}</p>
              <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:gap-2 transition-all">
                Open tool
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
