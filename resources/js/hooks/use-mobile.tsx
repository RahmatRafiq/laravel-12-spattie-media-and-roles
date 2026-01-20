import { useBreakpoint } from './use-media-query';
import { BREAKPOINTS } from '@/lib/constants';

export function useIsMobile() {
    return useBreakpoint(BREAKPOINTS.MOBILE);
}
