// src/hooks/use-disclosure.js
import { useState } from 'react';

export function useDisclosure(initial = false) {
    const [isOpen, setIsOpen] = useState(initial);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(p => !p);
    const onOpenChange = nextOpen => setIsOpen(Boolean(nextOpen));
    return {
        isOpen,
        setIsOpen: onOpenChange,
        onOpenChange,
        open,
        close,
        toggle,
        onOpen: open,
        onClose: close,
        onToggle: toggle,
    };
}
