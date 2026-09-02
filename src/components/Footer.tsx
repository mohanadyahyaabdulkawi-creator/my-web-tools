import { Wrench, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold">
            <Wrench className="w-5 h-5" />
            <span>ToolKit</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            Developed by <span className="font-semibold text-gray-700 dark:text-gray-300">Mohanad albana'a</span>
            <Heart className="w-4 h-4 text-error-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
