import { useEffect, useState } from 'react';

/**
 * Hook to detect and track dark mode changes
 * Watches for 'dark' class on document.documentElement
 *
 * @returns isDark - boolean indicating if dark mode is active
 */
export function useDarkMode(): boolean {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        // Check initial state
        checkDarkMode();

        // Watch for class changes on html element
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return isDark;
}
