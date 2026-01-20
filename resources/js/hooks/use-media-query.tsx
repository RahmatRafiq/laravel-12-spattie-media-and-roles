import { useEffect, useState } from 'react';

/**
 * Generic hook to check if viewport matches a media query
 * @param query - CSS media query string (e.g., "(max-width: 767px)")
 * @param defaultValue - Default value before hydration
 * @returns boolean indicating if media query matches
 */
export function useMediaQuery(query: string, defaultValue: boolean = false): boolean {
    const [matches, setMatches] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const mql = window.matchMedia(query);

        const onChange = () => {
            setMatches(mql.matches);
        };

        mql.addEventListener('change', onChange);
        setMatches(mql.matches);

        return () => mql.removeEventListener('change', onChange);
    }, [query]);

    return matches === undefined ? defaultValue : matches;
}

/**
 * Hook to check if viewport is below a specific breakpoint
 * @param breakpoint - Maximum width in pixels
 * @returns boolean indicating if viewport is mobile-sized
 */
export function useBreakpoint(breakpoint: number): boolean {
    return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}
