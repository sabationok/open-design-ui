/**
 * Size scale for new controls: xs (inline, in rows and chips, 24px), sm (default toolbar control, 32px),
 * md (form-sized control, 36px). A component takes `size?: ComponentSize`, or `Extract<ComponentSize, …>`
 * when it supports fewer sizes. Side by side, controls of one size line up.
 */
export type ComponentSize = 'xs' | 'sm' | 'md';

/** One height per size for every control, inputs and buttons alike. */
export const CONTROL_HEIGHT: Record<ComponentSize, string> = { xs: 'h-6', sm: 'h-8', md: 'h-9' };
/** A square (icon) control of the same height. */
export const CONTROL_SQUARE: Record<ComponentSize, string> = { xs: 'size-6', sm: 'size-8', md: 'size-9' };
