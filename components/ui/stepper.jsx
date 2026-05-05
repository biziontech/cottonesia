'use client';

/**
 * Stepper — lightweight component, API-compatible with diceui.com Stepper.
 *
 * Drop-in compatible: if you later install diceui, you can replace this file
 * with `npx shadcn@latest add https://diceui.com/r/stepper.json` (or copy
 * stepper-diceui.jsx) without changing any consumer code.
 *
 * Usage:
 *
 *   const [step, setStep] = useState('account');
 *
 *   <Stepper
 *     value={step}
 *     onValueChange={setStep}
 *     onValidate={async (value, direction) => {
 *       // direction: 'next' | 'prev'
 *       return true; // false to block
 *     }}
 *   >
 *     <StepperList>
 *       <StepperItem value="account">
 *         <StepperTrigger>
 *           <StepperIndicator />
 *           <div>
 *             <StepperTitle>Data Diri</StepperTitle>
 *             <StepperDescription>Akun & profil</StepperDescription>
 *           </div>
 *         </StepperTrigger>
 *         <StepperSeparator />
 *       </StepperItem>
 *       <StepperItem value="target">…</StepperItem>
 *       <StepperItem value="confirm">…</StepperItem>
 *     </StepperList>
 *
 *     <StepperContent value="account">…</StepperContent>
 *     <StepperContent value="target">…</StepperContent>
 *     <StepperContent value="confirm">…</StepperContent>
 *
 *     <StepperPrev>Kembali</StepperPrev>
 *     <StepperNext>Lanjut</StepperNext>
 *   </Stepper>
 */

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    Children,
    isValidElement,
} from 'react';
import { Check } from 'lucide-react';

// ─── helpers ─────────────────────────────────────────────────────────────────

function cn(...args) {
    return args.filter(Boolean).join(' ');
}

/** Walk children recursively, collect every <StepperItem value="…"> in order. */
function collectStepValues(children) {
    const values = [];
    const visit = (node) => {
        Children.forEach(node, (child) => {
            if (!isValidElement(child)) return;
            if (child.type?.displayName === 'StepperItem' && child.props?.value != null) {
                values.push(child.props.value);
            } else if (child.props?.children) {
                visit(child.props.children);
            }
        });
    };
    visit(children);
    return values;
}

// ─── contexts ────────────────────────────────────────────────────────────────

const StepperCtx = createContext(null);
const StepperItemCtx = createContext(null);

function useStepperRoot(name = 'component') {
    const ctx = useContext(StepperCtx);
    if (!ctx) throw new Error(`<${name}> must be used inside <Stepper>`);
    return ctx;
}
function useStepperItem(name = 'component') {
    const ctx = useContext(StepperItemCtx);
    if (!ctx) throw new Error(`<${name}> must be used inside <StepperItem>`);
    return ctx;
}

// ─── Root ────────────────────────────────────────────────────────────────────

export function Stepper({
    children,
    value: valueProp,
    defaultValue,
    onValueChange,
    onValidate,
    onValueComplete,
    orientation = 'horizontal',
    nonInteractive = false,
    disabled = false,
    className = '',
    ...rest
}) {
    const stepKeys = useMemo(() => collectStepValues(children), [children]);

    const [internal, setInternal] = useState(defaultValue ?? stepKeys[0] ?? '');
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internal;

    const setValue = useCallback(
        (next) => {
            if (!isControlled) setInternal(next);
            onValueChange?.(next);
        },
        [isControlled, onValueChange]
    );

    /**
     * goTo handles validation. Forward navigation triggers onValidate;
     * backward navigation is unconditional.
     */
    const goTo = useCallback(
        async (target) => {
            if (target === value) return true;
            const currentIdx = stepKeys.indexOf(value);
            const targetIdx = stepKeys.indexOf(target);
            if (targetIdx === -1) return false;

            const direction = targetIdx > currentIdx ? 'next' : 'prev';

            if (direction === 'next' && typeof onValidate === 'function') {
                try {
                    const ok = await onValidate(target, direction);
                    if (!ok) return false;
                } catch {
                    return false;
                }
            }

            setValue(target);

            if (targetIdx === stepKeys.length - 1) {
                onValueComplete?.(target);
            }
            return true;
        },
        [value, stepKeys, onValidate, setValue, onValueComplete]
    );

    const next = useCallback(() => {
        const idx = stepKeys.indexOf(value);
        if (idx < 0 || idx >= stepKeys.length - 1) return;
        goTo(stepKeys[idx + 1]);
    }, [value, stepKeys, goTo]);

    const prev = useCallback(() => {
        const idx = stepKeys.indexOf(value);
        if (idx <= 0) return;
        // backward is unconditional
        setValue(stepKeys[idx - 1]);
    }, [value, stepKeys, setValue]);

    const ctxValue = useMemo(
        () => ({
            value,
            stepKeys,
            orientation,
            nonInteractive,
            disabled,
            goTo,
            next,
            prev,
        }),
        [value, stepKeys, orientation, nonInteractive, disabled, goTo, next, prev]
    );

    return (
        <StepperCtx.Provider value={ctxValue}>
            <div
                data-orientation={orientation}
                data-disabled={disabled ? '' : undefined}
                className={cn('stepper', className)}
                {...rest}
            >
                {children}
            </div>
        </StepperCtx.Provider>
    );
}
Stepper.displayName = 'Stepper';

// ─── List ────────────────────────────────────────────────────────────────────

export function StepperList({ children, className = '', ...rest }) {
    const { orientation } = useStepperRoot('StepperList');

    return (
        <ol
            role="tablist"
            aria-orientation={orientation}
            className={cn(
                'stepper-list flex',
                orientation === 'vertical' ? 'flex-col gap-2' : 'items-start w-full',
                className
            )}
            {...rest}
        >
            {children}
        </ol>
    );
}
StepperList.displayName = 'StepperList';

// ─── Item ────────────────────────────────────────────────────────────────────

export function StepperItem({
    children,
    value,
    completed: completedProp,
    disabled: disabledProp = false,
    className = '',
}) {
    const { value: currentValue, stepKeys } = useStepperRoot('StepperItem');

    const indexOfThis = stepKeys.indexOf(value);
    const indexOfCurrent = stepKeys.indexOf(currentValue);
    const isLast = indexOfThis === stepKeys.length - 1;

    // diceui semantics: explicit completed prop wins; otherwise
    // any step before current is auto-completed
    const isCompleted =
        completedProp ?? (indexOfCurrent > indexOfThis && indexOfCurrent !== -1);

    const isActive = value === currentValue;
    const dataState = isCompleted ? 'completed' : isActive ? 'active' : 'inactive';

    const ctx = useMemo(
        () => ({ value, isLast, isCompleted, isActive, disabled: disabledProp, dataState }),
        [value, isLast, isCompleted, isActive, disabledProp, dataState]
    );

    return (
        <StepperItemCtx.Provider value={ctx}>
            <li
                data-state={dataState}
                data-disabled={disabledProp ? '' : undefined}
                className={cn(
                    'stepper-item flex items-start',
                    isLast ? 'flex-none' : 'flex-1',
                    className
                )}
            >
                {children}
            </li>
        </StepperItemCtx.Provider>
    );
}
StepperItem.displayName = 'StepperItem';

// ─── Trigger ─────────────────────────────────────────────────────────────────

export function StepperTrigger({ children, className = '', onClick: onClickProp, ...rest }) {
    const { goTo, nonInteractive } = useStepperRoot('StepperTrigger');
    const { value, disabled, dataState } = useStepperItem('StepperTrigger');

    const handleClick = async (e) => {
        onClickProp?.(e);
        if (e.defaultPrevented) return;
        if (disabled || nonInteractive) return;
        await goTo(value);
    };

    return (
        <button
            type="button"
            role="tab"
            data-state={dataState}
            data-slot="stepper-trigger"
            disabled={disabled}
            onClick={handleClick}
            className={cn(
                'stepper-trigger inline-flex items-center gap-3 rounded-md text-left outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'transition-colors',
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
}
StepperTrigger.displayName = 'StepperTrigger';

// ─── Indicator ───────────────────────────────────────────────────────────────

export function StepperIndicator({ children, className = '', ...rest }) {
    const { stepKeys } = useStepperRoot('StepperIndicator');
    const { value, dataState, isActive, isCompleted } = useStepperItem('StepperIndicator');

    const stepPosition = stepKeys.indexOf(value) + 1;

    return (
        <div
            data-state={dataState}
            data-slot="stepper-indicator"
            className={cn(
                'relative inline-flex items-center justify-center shrink-0',
                'h-8 w-8 rounded-full font-display font-bold text-sm transition-all duration-300',
                isCompleted &&
                'bg-primary text-primary-foreground shadow-md shadow-primary/30',
                isActive &&
                !isCompleted &&
                'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md shadow-primary/30',
                !isActive &&
                !isCompleted &&
                'bg-muted/30 text-muted-foreground border-2 border-border',
                className
            )}
            {...rest}
        >
            {isActive && !isCompleted && (
                <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25"
                />
            )}
            <span className="relative">
                {typeof children === 'function'
                    ? children(dataState)
                    : children
                        ? children
                        : isCompleted
                            ? <Check className="h-4 w-4" strokeWidth={3} />
                            : stepPosition}
            </span>
        </div>
    );
}
StepperIndicator.displayName = 'StepperIndicator';

// ─── Title / Description ─────────────────────────────────────────────────────

export function StepperTitle({ children, className = '', ...rest }) {
    const { dataState } = useStepperItem('StepperTitle');
    return (
        <span
            data-slot="title"
            data-state={dataState}
            className={cn(
                'stepper-title font-display font-semibold text-sm leading-tight transition-colors',
                dataState === 'inactive' ? 'text-muted-foreground' : 'text-foreground',
                className
            )}
            {...rest}
        >
            {children}
        </span>
    );
}
StepperTitle.displayName = 'StepperTitle';

export function StepperDescription({ children, className = '', ...rest }) {
    return (
        <span
            data-slot="description"
            className={cn(
                'stepper-description block text-[11px] text-muted-foreground/80 mt-0.5 leading-tight',
                className
            )}
            {...rest}
        >
            {children}
        </span>
    );
}
StepperDescription.displayName = 'StepperDescription';

// ─── Separator ───────────────────────────────────────────────────────────────

export function StepperSeparator({ className = '', forceMount = false, ...rest }) {
    const { orientation } = useStepperRoot('StepperSeparator');
    const { isLast, isCompleted } = useStepperItem('StepperSeparator');

    if (isLast && !forceMount) return null;

    const dataState = isCompleted ? 'completed' : 'inactive';

    return (
        <div
            role="separator"
            aria-hidden
            aria-orientation={orientation}
            data-state={dataState}
            data-slot="stepper-separator"
            className={cn(
                'stepper-separator transition-colors',
                orientation === 'horizontal' ? 'h-px flex-1 mt-5 mx-2 sm:mx-3' : 'w-px h-10',
                isCompleted ? 'bg-primary' : 'bg-border',
                className
            )}
            {...rest}
        />
    );
}
StepperSeparator.displayName = 'StepperSeparator';

// ─── Content ─────────────────────────────────────────────────────────────────

export function StepperContent({
    children,
    value,
    forceMount = false,
    className = '',
    ...rest
}) {
    const { value: currentValue } = useStepperRoot('StepperContent');
    const isActive = value === currentValue;

    if (!isActive && !forceMount) return null;

    return (
        <div
            role="tabpanel"
            data-state={isActive ? 'active' : 'inactive'}
            data-slot="stepper-content"
            hidden={!isActive}
            className={cn('stepper-content outline-none', className)}
            {...rest}
        >
            {children}
        </div>
    );
}
StepperContent.displayName = 'StepperContent';

// ─── Prev / Next (unstyled — pass your own className) ────────────────────────

export function StepperPrev({ children, asChild = false, onClick: onClickProp, ...rest }) {
    const { prev, value, stepKeys } = useStepperRoot('StepperPrev');
    const isFirst = stepKeys.indexOf(value) <= 0;

    const handleClick = (e) => {
        onClickProp?.(e);
        if (e.defaultPrevented) return;
        prev();
    };

    return (
        <button
            type="button"
            data-slot="stepper-prev"
            disabled={isFirst}
            onClick={handleClick}
            {...rest}
        >
            {children}
        </button>
    );
}
StepperPrev.displayName = 'StepperPrev';

export function StepperNext({ children, asChild = false, onClick: onClickProp, ...rest }) {
    const { next, value, stepKeys } = useStepperRoot('StepperNext');
    const isLast = stepKeys.indexOf(value) >= stepKeys.length - 1;

    const handleClick = async (e) => {
        onClickProp?.(e);
        if (e.defaultPrevented) return;
        next();
    };

    return (
        <button
            type="button"
            data-slot="stepper-next"
            disabled={isLast}
            onClick={handleClick}
            {...rest}
        >
            {children}
        </button>
    );
}
StepperNext.displayName = 'StepperNext';

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Reach into the stepper imperatively from descendants.
 * Use sparingly — usually props on Stepper root are enough.
 */
export function useStepper() {
    const ctx = useContext(StepperCtx);
    if (!ctx) throw new Error('useStepper must be used inside <Stepper>');
    return ctx;
}