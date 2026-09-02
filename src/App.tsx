import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@/context/ThemeContext';
import Home from '@/pages/Home';
import ImageCompressor from '@/pages/ImageCompressor';
import QRGenerator from '@/pages/QRGenerator';
import Calculators from '@/pages/Calculators';
import PasswordTools from '@/pages/PasswordTools';
import CryptoTools from '@/pages/CryptoTools';
import TextToSpeech from '@/pages/TextToSpeech';

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">This page could not be found.</p>
      <a href="/" className="btn-primary">Back to Home</a>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-compressor" element={<ImageCompressor />} />
            <Route path="/qr-generator" element={<QRGenerator />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/password-tools" element={<PasswordTools />} />
            <Route path="/crypto-tools" element={<CryptoTools />} />
            <Route path="/text-to-speech" element={<TextToSpeech />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
