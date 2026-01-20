import type { GroupBase } from 'react-select';
import type { AsyncProps } from 'react-select/async';
import AsyncSelect from 'react-select/async';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useSelectStyles } from '@/hooks/use-select-styles';

export default function CustomAsyncSelect<
    OptionType,
    IsMulti extends boolean = false,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>(props: AsyncProps<OptionType, IsMulti, Group>) {
    const isDark = useDarkMode();
    const customStyles = useSelectStyles<OptionType, IsMulti, Group>(isDark);

    return <AsyncSelect {...props} styles={customStyles} classNamePrefix="react-select" className="w-full" />;
}
