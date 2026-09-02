import { useState, useMemo, useCallback } from 'react';
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useSEO } from '@/hooks/useSEO';

const charSets = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const charSetLabels: Record<keyof typeof charSets, string> = {
  lower: 'Lowercase (a-z)',
  upper: 'Uppercase (A-Z)',
  numbers: 'Numbers (0-9)',
  symbols: 'Symbols (!@#$)',
};

function generatePassword(length: number, sets: Record<keyof typeof charSets, boolean>): string {
  let pool = '';
  (Object.keys(sets) as (keyof typeof charSets)[]).forEach((key) => {
    if (sets[key]) pool += charSets[key];
  });
  if (!pool) return '';

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += pool[array[i] % pool.length];
  }
  return result;
}

function calculateEntropy(password: string, sets: Record<keyof typeof charSets, boolean>): number {
  if (!password) return 0;
  let poolSize = 0;
  (Object.keys(sets) as (keyof typeof charSets)[]).forEach((key) => {
    if (sets[key]) poolSize += charSets[key].length;
  });
  if (poolSize === 0) return 0;
  return Math.round(password.length * Math.log2(poolSize));
}

function getStrengthInfo(entropy: number): { label: string; color: string; percentage: number } {
  if (entropy < 28) return { label: 'Very Weak', color: 'bg-error-500', percentage: 15 };
  if (entropy < 36) return { label: 'Weak', color: 'bg-warning-500', percentage: 35 };
  if (entropy < 60) return { label: 'Reasonable', color: 'bg-amber-500', percentage: 60 };
  if (entropy < 128) return { label: 'Strong', color: 'bg-success-500', percentage: 80 };
  return { label: 'Very Strong', color: 'bg-success-600', percentage: 100 };
}

export default function PasswordTools() {
  useSEO({
    title: 'Password Generator & Strength Tester — Secure Passwords | ToolKit',
    description:
      'Generate strong, secure passwords with customizable parameters and a real-time entropy meter. Test password strength instantly. 100% client-side.',
  });

  const [length, setLength] = useState(16);
  const [sets, setSets] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [password, setPassword] = useState(() => generatePassword(16, { lower: true, upper: true, numbers: true, symbols: true }));
  const [testInput, setTestInput] = useState('');
  const [copied, setCopied] = useState(false);

  const regen = useCallback(() => {
    setPassword(generatePassword(length, sets));
    setCopied(false);
  }, [length, sets]);

  const toggleSet = (key: keyof typeof charSets) => {
    const newSets = { ...sets, [key]: !sets[key] };
    if (Object.values(newSets).some(Boolean)) {
      setSets(newSets);
      setPassword(generatePassword(length, newSets));
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const entropy = useMemo(() => calculateEntropy(password, sets), [password, sets]);
  const strength = getStrengthInfo(entropy);

  const testEntropy = useMemo(() => {
    if (!testInput) return 0;
    let poolSize = 0;
    if (/[a-z]/.test(testInput)) poolSize += 26;
    if (/[A-Z]/.test(testInput)) poolSize += 26;
    if (/[0-9]/.test(testInput)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(testInput)) poolSize += 26;
    return Math.round(testInput.length * Math.log2(poolSize || 1));
  }, [testInput]);
  const testStrength = getStrengthInfo(testEntropy);

  return (
    <div>
      <PageHeader
        title="Password Generator & Tester"
        description="Generate strong passwords with a real-time entropy meter and test password strength."
        icon={<KeyRound className="w-6 h-6" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Generator</h2>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2">
              <code className="text-lg font-mono text-gray-900 dark:text-white break-all flex-1">{password}</code>
              <div className="flex gap-1 shrink-0">
                <button onClick={copy} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Copy">
                  {copied ? <Check className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
                <button onClick={regen} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Regenerate">
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Entropy</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{entropy} bits</span>
            </div>
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.percentage}%` }} />
            </div>
            <p className={`text-sm font-medium mt-1.5 ${strength.label === 'Very Strong' ? 'text-success-600 dark:text-success-400' : strength.label === 'Strong' ? 'text-success-500' : strength.label === 'Reasonable' ? 'text-amber-500' : strength.label === 'Weak' ? 'text-warning-500' : 'text-error-500'}`}>
              {strength.label}
            </p>
          </div>

          <div>
            <label className="label">Length: {length}</label>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => { setLength(Number(e.target.value)); setPassword(generatePassword(Number(e.target.value), sets)); }}
              className="w-full accent-primary-600"
            />
          </div>

          <div className="space-y-2">
            {(Object.keys(charSets) as (keyof typeof charSets)[]).map((key) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sets[key]}
                  onChange={() => toggleSet(key)}
                  className="w-4 h-4 rounded accent-primary-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{charSetLabels[key]}</span>
              </label>
            ))}
          </div>

          <button onClick={regen} className="btn-primary w-full">
            <RefreshCw className="w-4 h-4" /> Generate New Password
          </button>
        </div>

        {/* Tester */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Password Strength Tester</h2>
          </div>

          <div>
            <label className="label">Enter a password to test</label>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Type or paste a password..."
              className="input font-mono"
            />
          </div>

          {testInput && (
            <div className="animate-fade-in space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Entropy</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{testEntropy} bits</span>
                </div>
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${testStrength.color}`} style={{ width: `${testStrength.percentage}%` }} />
                </div>
                <p className="text-sm font-medium mt-1.5 text-gray-900 dark:text-white">{testStrength.label}</p>
              </div>

              <div className="space-y-1.5">
                <ChecklistItem ok={testInput.length >= 12} label="At least 12 characters" />
                <ChecklistItem ok={/[a-z]/.test(testInput)} label="Contains lowercase letters" />
                <ChecklistItem ok={/[A-Z]/.test(testInput)} label="Contains uppercase letters" />
                <ChecklistItem ok={/[0-9]/.test(testInput)} label="Contains numbers" />
                <ChecklistItem ok={/[^a-zA-Z0-9]/.test(testInput)} label="Contains special characters" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${ok ? 'bg-success-100 dark:bg-success-700/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
        {ok ? <Check className="w-3 h-3 text-success-600 dark:text-success-400" /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
      </div>
      <span className={`text-sm ${ok ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}
