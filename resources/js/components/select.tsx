import Select, { Props as SelectProps, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type CustomSelectProps<OptionType> = SelectProps<OptionType> & {
    isCreatable?: boolean;
};

export default function CustomSelect<OptionType>(props: CustomSelectProps<OptionType>) {
    const { isCreatable, ...restProps } = props;
    const customStyles: StylesConfig<OptionType, boolean> = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#fff',
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
            borderRadius: '0.375rem',
            minHeight: '2.5rem',
            '&:hover': {
                borderColor: '#3b82f6',
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
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: state.isSelected ? '#ffffff' : '#111827',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#111827',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '0.25rem',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#1e40af',
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
    if (isCreatable) {
        return <CreatableSelect {...restProps} styles={customStyles} classNamePrefix="react-select" />;
    }
    return <Select {...restProps} styles={customStyles} classNamePrefix="react-select" />;
}
