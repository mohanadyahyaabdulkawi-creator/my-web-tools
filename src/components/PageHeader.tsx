import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">{description}</p>
    </div>
  );
}
