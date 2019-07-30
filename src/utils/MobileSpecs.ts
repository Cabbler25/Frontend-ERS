export const MobileWidth = 700;

export function IsMobile(): boolean {
    return !window.matchMedia(`(min-width: ${MobileWidth}px)`).matches;
}