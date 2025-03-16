import { useState } from 'react';
import { Link } from '@inertiajs/react';
import type { NavItem } from '@/types';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

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
      <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
        {hasChildren ? (
          // Jika memiliki children, tidak gunakan Link agar tidak langsung mengarahkan
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-2 focus:outline-none w-full text-left"
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            <span>{item.title}</span>
          </button>
        ) : (
          <Link href={item.href} className="flex items-center space-x-2">
            {item.icon && <item.icon className="w-4 h-4" />}
            <span>{item.title}</span>
          </Link>
        )}
        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 focus:outline-none"
            aria-label="Toggle submenu"
          >
            {open ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div className="ml-4 space-y-1">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="flex items-center space-x-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
            >
              {child.icon && <child.icon className="w-4 h-4" />}
              <span>{child.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
