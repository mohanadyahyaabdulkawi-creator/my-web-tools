import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioLines, Play, Pause, Square, Download, RotateCcw, Volume2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useSEO } from '@/hooks/useSEO';

export default function TextToSpeech() {
  useSEO({
    title: 'Text-to-Speech & Word Counter — Free Online Utility | ToolKit',
    description:
      'Real-time word and character counter, plus text-to-speech reader with full Arabic and English voice support. Download speech as audio file. 100% client-side.',
  });

  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [status, setStatus] = useState('');

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const available = synthRef.current?.getVoices() ?? [];
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        const arVoice = available.find((v) => v.lang.startsWith('ar'));
        setSelectedVoice(arVoice?.name ?? available[0].name);
      }
    };

    loadVoices();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
        synthRef.current.onvoiceschanged = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [selectedVoice]);

  const speak = useCallback(() => {
    if (!text.trim() || !synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setStatus('Speech error occurred.');
    };

    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, voices, selectedVoice, rate, pitch, isRecording]);

  const togglePause = () => {
    if (!synthRef.current) return;
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    } else {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const stop = () => {
    synthRef.current?.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const downloadAudio = async () => {
    if (!text.trim() || !synthRef.current) return;
    synthRef.current.cancel();
    setAudioUrl('');
    setStatus('Recording audio... Please wait.');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      setIsRecording(true);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        setStatus('Audio ready! Click download to save.');
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onend = () => {
        if (recorder.state !== 'inactive') {
          setTimeout(() => {
            if (recorder.state !== 'inactive') recorder.stop();
          }, 500);
        }
      };

      synthRef.current.speak(utterance);
    } catch {
      setStatus('Microphone access denied. Cannot record audio.');
      setIsRecording(false);
    }
  };

  const reset = () => {
    stop();
    setText('');
    setAudioUrl('');
    setStatus('');
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split('\n').length : 1;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const arVoices = voices.filter((v) => v.lang.startsWith('ar'));
  const enVoices = voices.filter((v) => v.lang.startsWith('en'));
  const otherVoices = voices.filter((v) => !v.lang.startsWith('ar') && !v.lang.startsWith('en'));

  return (
    <div>
      <PageHeader
        title="Text-to-Speech & Utilities"
        description="Word/character counter and natural speech reader with Arabic and English voice support and audio download."
        icon={<AudioLines className="w-6 h-6" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text input & counter */}
        <div className="lg:col-span-2 card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Text Editor</h2>
            <button onClick={reset} className="btn-secondary text-sm">
              <RotateCcw className="w-4 h-4" /> Clear
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here... Supports Arabic and English."
            rows={10}
            className="input resize-none text-base leading-relaxed"
            dir="auto"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Words" value={wordCount} />
            <StatCard label="Characters" value={charCount} />
            <StatCard label="Lines" value={lineCount} />
            <StatCard label="Read Time" value={`${readingTime}m`} />
          </div>

          {/* Playback controls */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={speak} disabled={!text.trim() || isPlaying} className="btn-primary">
              <Play className="w-4 h-4" /> Play
            </button>
            <button onClick={togglePause} disabled={!isPlaying} className="btn-secondary">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={stop} disabled={!isPlaying} className="btn-secondary">
              <Square className="w-4 h-4" /> Stop
            </button>
            <button onClick={downloadAudio} disabled={!text.trim() || isRecording} className="btn-accent">
              <Download className="w-4 h-4" /> {isRecording ? 'Recording...' : 'Download Audio'}
            </button>
          </div>

          {status && (
            <div className="bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 rounded-xl p-3 text-sm">
              {status}
            </div>
          )}

          {audioUrl && (
            <div className="animate-fade-in space-y-2">
              <audio controls src={audioUrl} className="w-full" />
              <a href={audioUrl} download="speech.webm" className="btn-accent w-full">
                <Download className="w-4 h-4" /> Save Audio File
              </a>
            </div>
          )}
        </div>

        {/* Voice settings */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Voice Settings</h2>
          </div>

          {voices.length === 0 ? (
            <p className="text-sm text-gray-400">Loading available voices...</p>
          ) : (
            <>
              <div>
                <label className="label">Voice ({voices.length} available)</label>
                <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="input">
                  {arVoices.length > 0 && (
                    <optgroup label="Arabic">
                      {arVoices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                    </optgroup>
                  )}
                  {enVoices.length > 0 && (
                    <optgroup label="English">
                      {enVoices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                    </optgroup>
                  )}
                  {otherVoices.length > 0 && (
                    <optgroup label="Other Languages">
                      {otherVoices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                    </optgroup>
                  )}
                </select>
              </div>

              {arVoices.length === 0 && (
                <div className="bg-warning-50 dark:bg-warning-600/10 text-warning-600 dark:text-warning-400 rounded-xl p-3 text-xs">
                  No Arabic voices detected on this device. Arabic text will use the default voice.
                </div>
              )}

              <div>
                <label className="label">Speed: {rate.toFixed(1)}x</label>
                <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary-600" />
              </div>

              <div>
                <label className="label">Pitch: {pitch.toFixed(1)}</label>
                <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full accent-primary-600" />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <p className="font-medium text-gray-700 dark:text-gray-300">Tips:</p>
                <p>• Arabic voices are labeled with (ar-SA) or (ar-EG).</p>
                <p>• Download Audio uses your microphone to capture system speech.</p>
                <p>• Allow microphone access when prompted for audio download.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
