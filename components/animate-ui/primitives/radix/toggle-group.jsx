'use client';;
import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { AnimatePresence, motion } from 'motion/react';

import { Highlight, HighlightItem } from '@/components/animate-ui/primitives/effects/highlight';
import { getStrictContext } from '@/lib/get-strict-context';
import { useControlledState } from '@/hooks/use-controlled-state';

const [ToggleGroupProvider, useToggleGroup] =
  getStrictContext('ToggleGroupContext');

function ToggleGroup(props) {
  const [value, setValue] = useControlledState({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onValueChange,
  });

  return (
    <ToggleGroupProvider value={{ value, setValue, type: props.type }}>
      <ToggleGroupPrimitive.Root data-slot="toggle-group" {...props} onValueChange={setValue} />
    </ToggleGroupProvider>
  );
}

function ToggleGroupItem({
  value,
  disabled,
  ...props
}) {
  return (
    <ToggleGroupPrimitive.Item value={value} disabled={disabled} asChild>
      <motion.button data-slot="toggle-group-item" whileTap={{ scale: 0.95 }} {...props} />
    </ToggleGroupPrimitive.Item>
  );
}

function ToggleGroupHighlight({
  transition = { type: 'spring', stiffness: 200, damping: 25 },
  ...props
}) {
  const { value } = useToggleGroup();

  return (
    <Highlight
      data-slot="toggle-group-highlight"
      controlledItems
      value={typeof value === 'string' ? value : null}
      exitDelay={0}
      transition={transition}
      {...props} />
  );
}

function ToggleGroupHighlightItem({
  children,
  style,
  ...props
}) {
  const { type, value } = useToggleGroup();

  if (type === 'single') {
    return (
      <HighlightItem
        data-slot="toggle-group-highlight-item"
        style={{ inset: 0, ...style }}
        {...props}>
        {children}
      </HighlightItem>
    );
  }

  if (type === 'multiple' && React.isValidElement(children)) {
    const isActive = props.value && value && value.includes(props.value);

    const element = children;

    return React.cloneElement(children, {
      style: {
        ...element.props.style,
        position: 'relative',
      },
      ...element.props,
    }, <>
      <AnimatePresence>
        {isActive && (
          <motion.div
            data-slot="toggle-group-highlight-item"
            style={{ position: 'absolute', inset: 0, zIndex: 0, ...style }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...props} />
        )}
      </AnimatePresence>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}>
        {element.props.children}
      </div>
    </>);
  }
}

export { ToggleGroup, ToggleGroupItem, ToggleGroupHighlight, ToggleGroupHighlightItem, useToggleGroup };
