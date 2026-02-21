'use client';;
import * as React from 'react';
import { Toggle as TogglePrimitive } from 'radix-ui';
import { motion, AnimatePresence } from 'motion/react';

import { getStrictContext } from '@/lib/get-strict-context';
import { useControlledState } from '@/hooks/use-controlled-state';

const [ToggleProvider, useToggle] =
  getStrictContext('ToggleContext');

function Toggle({
  pressed,
  defaultPressed,
  onPressedChange,
  disabled,
  ...props
}) {
  const [isPressed, setIsPressed] = useControlledState({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });

  return (
    <ToggleProvider value={{ isPressed, setIsPressed, disabled }}>
      <TogglePrimitive.Root
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={setIsPressed}
        disabled={disabled}
        asChild>
        <motion.button data-slot="toggle" whileTap={{ scale: 0.95 }} {...props} />
      </TogglePrimitive.Root>
    </ToggleProvider>
  );
}

function ToggleHighlight({
  style,
  ...props
}) {
  const { isPressed, disabled } = useToggle();

  return (
    <AnimatePresence>
      {isPressed && (
        <motion.div
          data-slot="toggle-highlight"
          aria-pressed={isPressed}
          data-state={isPressed ? 'on' : 'off'}
          data-disabled={disabled}
          style={{ position: 'absolute', zIndex: 0, inset: 0, ...style }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...props} />
      )}
    </AnimatePresence>
  );
}

function ToggleItem({
  style,
  ...props
}) {
  const { isPressed, disabled } = useToggle();

  return (
    <motion.div
      data-slot="toggle-item"
      aria-pressed={isPressed}
      data-state={isPressed ? 'on' : 'off'}
      data-disabled={disabled}
      style={{ position: 'relative', zIndex: 1, ...style }}
      {...props} />
  );
}

export { Toggle, ToggleHighlight, ToggleItem, useToggle };
