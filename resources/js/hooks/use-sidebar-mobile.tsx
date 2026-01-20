import { useBreakpoint } from './use-media-query';
import { BREAKPOINTS } from '@/lib/constants';

export function useSidebarMobile() {
    return useBreakpoint(BREAKPOINTS.SIDEBAR);
}
