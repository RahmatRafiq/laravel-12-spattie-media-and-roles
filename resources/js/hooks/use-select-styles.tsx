import { useMemo } from 'react';
import type { GroupBase, StylesConfig } from 'react-select';
import { Z_INDEX } from '@/lib/constants';

/**
 * OKLCH Color Tokens for React Select
 * Centralized color values for consistency
 */
const COLORS = {
    // Background colors
    bgLight: 'oklch(1 0 0)',
    bgDark: 'oklch(0.205 0 0)',
    bgHoverLight: 'oklch(0.97 0 0)',
    bgHoverDark: 'oklch(0.269 0 0)',

    // Border colors
    borderLight: 'oklch(0.922 0 0)',
    borderDark: 'oklch(0.269 0 0)',
    borderFocusLight: 'oklch(0.87 0 0)',
    borderFocusDark: 'oklch(0.439 0 0)',

    // Text colors
    textLight: 'oklch(0.145 0 0)',
    textDark: 'oklch(0.985 0 0)',
    textMutedLight: 'oklch(0.556 0 0)',
    textMutedDark: 'oklch(0.708 0 0)',

    // Selection colors
    selected: 'oklch(0.488 0.243 264.376)',
    selectedText: 'oklch(1 0 0)',
    removeHover: 'oklch(0.577 0.245 27.325)',
} as const;

/**
 * Hook to generate react-select styles based on dark mode
 * Returns memoized StylesConfig object
 *
 * @param isDark - boolean indicating if dark mode is active
 * @returns StylesConfig for react-select components
 */
export function useSelectStyles<
    OptionType,
    IsMulti extends boolean = false,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>(isDark: boolean): StylesConfig<OptionType, IsMulti, Group> {
    return useMemo(
        () => ({
            control: (provided, state) => ({
                ...provided,
                backgroundColor: isDark ? COLORS.bgDark : COLORS.bgLight,
                borderColor: state.isFocused
                    ? isDark
                        ? COLORS.borderFocusDark
                        : COLORS.borderFocusLight
                    : isDark
                      ? COLORS.borderDark
                      : COLORS.borderLight,
                boxShadow: state.isFocused
                    ? `0 0 0 2px ${isDark ? `${COLORS.borderFocusDark} / 0.5` : `${COLORS.borderFocusLight} / 0.5`}`
                    : 'none',
                borderRadius: '0.375rem',
                minHeight: '2.25rem',
                '&:hover': {
                    borderColor: isDark ? COLORS.borderFocusDark : COLORS.borderFocusLight,
                },
            }),
            menu: (provided) => ({
                ...provided,
                backgroundColor: isDark ? COLORS.bgDark : COLORS.bgLight,
                borderRadius: '0.375rem',
                padding: '0.25rem',
                boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${isDark ? COLORS.borderDark : COLORS.borderLight}`,
                zIndex: Z_INDEX.SELECT_MENU,
            }),
            option: (provided, state) => ({
                ...provided,
                padding: '0.5rem 0.75rem',
                backgroundColor: state.isSelected
                    ? COLORS.selected
                    : state.isFocused
                      ? isDark
                          ? COLORS.bgHoverDark
                          : COLORS.bgHoverLight
                      : 'transparent',
                color: state.isSelected ? COLORS.selectedText : isDark ? COLORS.textDark : COLORS.textLight,
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: state.isSelected
                        ? COLORS.selected
                        : isDark
                          ? COLORS.bgHoverDark
                          : COLORS.bgHoverLight,
                },
            }),
            singleValue: (provided) => ({
                ...provided,
                color: isDark ? COLORS.textDark : COLORS.textLight,
            }),
            placeholder: (provided) => ({
                ...provided,
                color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight,
            }),
            input: (provided) => ({
                ...provided,
                color: isDark ? COLORS.textDark : COLORS.textLight,
            }),
            multiValue: (provided) => ({
                ...provided,
                backgroundColor: isDark ? COLORS.bgHoverDark : COLORS.bgHoverLight,
                borderRadius: '0.25rem',
            }),
            multiValueLabel: (provided) => ({
                ...provided,
                color: isDark ? COLORS.textDark : COLORS.textLight,
            }),
            multiValueRemove: (provided) => ({
                ...provided,
                color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight,
                ':hover': {
                    backgroundColor: COLORS.removeHover,
                    color: 'white',
                },
            }),
            clearIndicator: (provided) => ({
                ...provided,
                color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight,
                ':hover': {
                    color: isDark ? COLORS.textDark : COLORS.textLight,
                },
            }),
            dropdownIndicator: (provided) => ({
                ...provided,
                color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight,
                ':hover': {
                    color: isDark ? COLORS.textDark : COLORS.textLight,
                },
            }),
            indicatorSeparator: (provided) => ({
                ...provided,
                backgroundColor: isDark ? COLORS.borderDark : COLORS.borderLight,
            }),
            noOptionsMessage: (provided) => ({
                ...provided,
                color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight,
            }),
            loadingMessage: (provided) => ({
                ...provided,
                color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight,
            }),
        }),
        [isDark],
    );
}
