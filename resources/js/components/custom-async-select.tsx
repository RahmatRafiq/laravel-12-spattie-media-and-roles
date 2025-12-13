import { useEffect, useState } from 'react';
import type { GroupBase, StylesConfig } from 'react-select';
import type { AsyncProps } from 'react-select/async';
import AsyncSelect from 'react-select/async';

export default function CustomAsyncSelect<OptionType, IsMulti extends boolean = false, Group extends GroupBase<OptionType> = GroupBase<OptionType>>(
    props: AsyncProps<OptionType, IsMulti, Group>,
) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return () => observer.disconnect();
    }, []);

    const customStyles: StylesConfig<OptionType, IsMulti, Group> = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: isDark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
            borderColor: state.isFocused ? (isDark ? 'oklch(0.439 0 0)' : 'oklch(0.87 0 0)') : isDark ? 'oklch(0.269 0 0)' : 'oklch(0.922 0 0)',
            boxShadow: state.isFocused ? `0 0 0 2px ${isDark ? 'oklch(0.439 0 0 / 0.5)' : 'oklch(0.87 0 0 / 0.5)'}` : 'none',
            borderRadius: '0.375rem',
            minHeight: '2.25rem',
            '&:hover': {
                borderColor: isDark ? 'oklch(0.439 0 0)' : 'oklch(0.87 0 0)',
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: isDark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
            borderRadius: '0.375rem',
            padding: '0.25rem',
            boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${isDark ? 'oklch(0.269 0 0)' : 'oklch(0.922 0 0)'}`,
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            padding: '0.5rem 0.75rem',
            backgroundColor: state.isSelected
                ? 'oklch(0.488 0.243 264.376)'
                : state.isFocused
                  ? isDark
                      ? 'oklch(0.269 0 0)'
                      : 'oklch(0.97 0 0)'
                  : 'transparent',
            color: state.isSelected ? 'oklch(1 0 0)' : isDark ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: state.isSelected ? 'oklch(0.488 0.243 264.376)' : isDark ? 'oklch(0.269 0 0)' : 'oklch(0.97 0 0)',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.708 0 0)' : 'oklch(0.556 0 0)',
        }),
        input: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: isDark ? 'oklch(0.269 0 0)' : 'oklch(0.97 0 0)',
            borderRadius: '0.25rem',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.708 0 0)' : 'oklch(0.556 0 0)',
            ':hover': {
                backgroundColor: 'oklch(0.577 0.245 27.325)',
                color: 'white',
            },
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.708 0 0)' : 'oklch(0.556 0 0)',
            ':hover': {
                color: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
            },
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.708 0 0)' : 'oklch(0.556 0 0)',
            ':hover': {
                color: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
            },
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: isDark ? 'oklch(0.269 0 0)' : 'oklch(0.922 0 0)',
        }),
        noOptionsMessage: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.708 0 0)' : 'oklch(0.556 0 0)',
        }),
        loadingMessage: (provided) => ({
            ...provided,
            color: isDark ? 'oklch(0.708 0 0)' : 'oklch(0.556 0 0)',
        }),
    };

    return <AsyncSelect {...props} styles={customStyles} classNamePrefix="react-select" className="w-full" />;
}
