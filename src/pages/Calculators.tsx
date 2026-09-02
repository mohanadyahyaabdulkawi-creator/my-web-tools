import { useState } from 'react';
import { Calculator, Cake, Activity } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useSEO } from '@/hooks/useSEO';

export default function Calculators() {
  useSEO({
    title: 'Age & BMI Calculator — Free Online Calculators | ToolKit',
    description:
      'Calculate your exact age in years, months, and days, and check your BMI with visual health indicators. Free, fast, and private.',
  });

  return (
    <div>
      <PageHeader
        title="Everyday Calculators"
        description="Age calculator and BMI calculator with visual health indicators."
        icon={<Calculator className="w-6 h-6" />}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgeCalculator />
        <BMICalculator />
      </div>
    </div>
  );
}

function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  const calculate = () => {
    if (!birthDate || !targetDate) return;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (birth > target) return;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    setResult({ years, months, days, totalDays });
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Cake className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h2 className="font-semibold text-gray-900 dark:text-white">Age Calculator</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="birth-date">Date of Birth</label>
          <input id="birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="target-date">Age at Date</label>
          <input id="target-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="input" />
        </div>
        <button onClick={calculate} className="btn-primary w-full" disabled={!birthDate}>
          Calculate Age
        </button>
        {result && (
          <div className="animate-fade-in space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{result.years}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Years</p>
              </div>
              <div className="bg-accent-50 dark:bg-accent-900/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">{result.months}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Months</p>
              </div>
              <div className="bg-success-50 dark:bg-success-700/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">{result.days}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Days</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total: <span className="font-semibold text-gray-900 dark:text-white">{result.totalDays.toLocaleString()} days</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<{ value: number; category: string; color: string; percentage: number } | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;

    let bmiValue: number;
    if (unit === 'metric') {
      bmiValue = w / ((h / 100) ** 2);
    } else {
      bmiValue = (w / (h ** 2)) * 703;
    }
    bmiValue = Math.round(bmiValue * 10) / 10;

    let category: string;
    let color: string;
    if (bmiValue < 18.5) { category = 'Underweight'; color = 'text-warning-500'; }
    else if (bmiValue < 25) { category = 'Normal'; color = 'text-success-500'; }
    else if (bmiValue < 30) { category = 'Overweight'; color = 'text-amber-500'; }
    else { category = 'Obese'; color = 'text-error-500'; }

    const percentage = Math.min((bmiValue / 40) * 100, 100);
    setBmi({ value: bmiValue, category, color, percentage });
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h2 className="font-semibold text-gray-900 dark:text-white">BMI Calculator</h2>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setUnit('metric')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              unit === 'metric' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Metric (cm/kg)
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              unit === 'imperial' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Imperial (in/lb)
          </button>
        </div>
        <div>
          <label className="label">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input" placeholder={unit === 'metric' ? '175' : '69'} />
        </div>
        <div>
          <label className="label">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="input" placeholder={unit === 'metric' ? '70' : '154'} />
        </div>
        <button onClick={calculate} className="btn-primary w-full" disabled={!height || !weight}>
          Calculate BMI
        </button>
        {bmi && (
          <div className="animate-fade-in space-y-3">
            <div className="text-center">
              <p className={`text-4xl font-bold ${bmi.color}`}>{bmi.value}</p>
              <p className={`text-sm font-medium ${bmi.color} mt-1`}>{bmi.category}</p>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full rounded-full transition-all duration-500"
                style={{
                  width: `${bmi.percentage}%`,
                  background: 'linear-gradient(to right, #facc15, #22c55e, #f59e0b, #ef4444)',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
