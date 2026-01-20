import { useEffect, useState } from 'react';
import { type MenuItem } from '@/types';

export function useMenus() {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        let url = '/dashboard/menus/json';
        if (
            typeof window !== 'undefined' &&
            typeof (window as unknown as { route?: unknown }).route === 'function'
        ) {
            url = ((window as unknown as { route: (name: string) => string }).route)('menus.json');
        }
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch menus');
                return res.json();
            })
            .then((data) => {
                setMenus(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return { menus, loading, error };
}
