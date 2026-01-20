import type { Props as SelectProps } from 'react-select';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useSelectStyles } from '@/hooks/use-select-styles';

type CustomSelectProps<OptionType> = SelectProps<OptionType> & {
    isCreatable?: boolean;
};

export default function CustomSelect<OptionType>(props: CustomSelectProps<OptionType>) {
    const { isCreatable, ...restProps } = props;
    const isDark = useDarkMode();
    const customStyles = useSelectStyles<OptionType>(isDark);

    if (isCreatable) {
        return <CreatableSelect {...restProps} styles={customStyles} classNamePrefix="react-select" className="w-full" />;
    }
    return <Select {...restProps} styles={customStyles} classNamePrefix="react-select" className="w-full" />;
}
