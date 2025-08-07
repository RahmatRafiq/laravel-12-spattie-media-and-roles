import clsx from 'clsx';

interface ToggleTabsProps {
    tabs: string[];
    active: string;
    onChange: (tab: string) => void;
}

export default function ToggleTabs({ tabs, active, onChange }: ToggleTabsProps) {
    return (
        <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={clsx(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        active === tab
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );
}
