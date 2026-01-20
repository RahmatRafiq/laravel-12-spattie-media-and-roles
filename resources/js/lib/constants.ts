/**
 * Application Constants
 * Centralized values for consistency across the application
 */

/**
 * Z-Index Layers
 * Standardized z-index values for consistent layering
 *
 * Usage:
 * - Use Tailwind classes (z-10, z-20, z-50) for general layering
 * - Use these constants for inline styles when dynamic z-index is needed
 */
export const Z_INDEX = {
    /**  Dragging items in trees/lists (10) */
    DRAGGING: 10,

    /** Base modal/dialog layer (50) - matches Tailwind z-50 */
    MODAL: 50,

    /** Dropdowns and popovers (50) - matches Tailwind z-50 */
    DROPDOWN: 50,

    /** Select menus (must be above modals for react-select) */
    SELECT_MENU: 9999,
} as const;

/**
 * Breakpoint Values
 * Screen size breakpoints in pixels
 *
 * Matches Tailwind CSS default breakpoints:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 */
export const BREAKPOINTS = {
    /** Mobile breakpoint (< 768px) */
    MOBILE: 768,

    /** Sidebar collapse breakpoint (< 1024px) */
    SIDEBAR: 1024,

    /** Tablet breakpoint */
    TABLET: 1024,

    /** Desktop breakpoint */
    DESKTOP: 1280,
} as const;
