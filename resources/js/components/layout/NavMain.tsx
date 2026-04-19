import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items }: { items: NavItem[] }) {
    return (
        <nav>
            {items.map((item) => (
                <NavItemComponent key={item.href} item={item} />
            ))}
        </nav>
    );
}

function NavItemComponent({ item }: { item: NavItem }) {
    const [open, setOpen] = useState(false);
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    return (
        <div>
            <div className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                {hasChildren ? (
                    // Jika memiliki children, tidak gunakan Link agar tidak langsung mengarahkan
                    <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center space-x-2 text-left focus:outline-none">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                    </button>
                ) : (
                    <Link href={item.href} className="flex items-center space-x-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                    </Link>
                )}
                {hasChildren && (
                    <button type="button" onClick={() => setOpen(!open)} className="p-2 focus:outline-none" aria-label="Toggle submenu">
                        {open ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                    </button>
                )}
            </div>
            {hasChildren && open && (
                <div className="ml-4 space-y-1">
                    {item.children!.map((child) => (
                        <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center space-x-2 rounded p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                            {child.icon && <child.icon className="h-4 w-4" />}
                            <span>{child.title}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
