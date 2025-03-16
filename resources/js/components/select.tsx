import React from 'react';
import Select, { Props as SelectProps, StylesConfig } from 'react-select';

export default function CustomSelect<OptionType>(props: SelectProps<OptionType>) {
  const customStyles: StylesConfig<OptionType, boolean> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#fff',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // Tailwind blue-500 or gray-300
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      borderRadius: '0.375rem', // rounded-md
      minHeight: '2.5rem',
      '&:hover': {
        borderColor: '#3b82f6', // blue-500
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      borderRadius: '0.375rem',
      padding: '0.25rem',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '0.5rem 0.75rem',
      backgroundColor: state.isSelected
        ? '#3b82f6' // blue-500
        : state.isFocused
        ? 'rgba(59, 130, 246, 0.1)' // blue-500/10
        : 'transparent',
      color: state.isSelected ? '#ffffff' : '#111827', // white or gray-900
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#111827', // gray-900
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af', // gray-400
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500/20
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1e40af', // blue-800
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#1e40af',
      ':hover': {
        backgroundColor: '#3b82f6',
        color: 'white',
      },
    }),
  };

  return (
    <Select
      {...props}
      styles={customStyles}
      classNamePrefix="react-select"
    />
  );
}
