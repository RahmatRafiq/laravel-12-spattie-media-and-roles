import { BREAKPOINTS } from '@/lib/constants';
import { useBreakpoint } from './use-media-query';

export function useSidebarMobile() {
    return useBreakpoint(BREAKPOINTS.SIDEBAR);
}
