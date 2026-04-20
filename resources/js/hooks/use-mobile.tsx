import { BREAKPOINTS } from '@/lib/constants';
import { useBreakpoint } from './use-media-query';

export function useIsMobile() {
    return useBreakpoint(BREAKPOINTS.MOBILE);
}
