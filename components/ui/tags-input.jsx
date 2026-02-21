import * as TagsInputPrimitive from "@diceui/tags-input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createContext, useContext, useState, useRef, useEffect } from "react";

const TagsInputContext = createContext({
  editable: true,
  suggestions: [],
  inputValue: "",
  setInputValue: () => { },
  showDropdown: false,
  setShowDropdown: () => { }
});

function TagsInput({
  className,
  editable = true,
  suggestions = [],
  ...props
}) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <TagsInputContext.Provider value={{
      editable,
      suggestions,
      inputValue,
      setInputValue,
      showDropdown,
      setShowDropdown
    }}>
      <TagsInputPrimitive.Root
        data-slot="tags-input"
        className={cn("flex flex-col gap-2 relative", className)}
        editable={editable}
        {...props} />
    </TagsInputContext.Provider>
  );
}

function TagsInputLabel({
  className,
  ...props
}) {
  return (
    <TagsInputPrimitive.Label
      data-slot="tags-input-label"
      className={cn(
        "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props} />
  );
}

function TagsInputList({
  className,
  ...props
}) {
  const { editable } = useContext(TagsInputContext);

  return (
    <div
      data-slot="tags-input-list"
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
        editable && "focus-within:ring-1 focus-within:ring-ring",
        className
      )}
      {...props} />
  );
}

function TagsInputInput({
  className,
  ...props
}) {
  const { editable, setInputValue, setShowDropdown } = useContext(TagsInputContext);

  if (!editable) {
    return null;
  }

  return (
    <TagsInputPrimitive.Input
      data-slot="tags-input-input"
      className={cn(
        "flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onChange={(e) => {
        setInputValue(e.target.value);
        setShowDropdown(true);
      }}
      onFocus={() => {
        setShowDropdown(true);
      }}
      {...props} />
  );
}

function TagsInputDropdown({ onSelect, className }) {
  const { suggestions, inputValue, showDropdown, setShowDropdown } = useContext(TagsInputContext);
  const dropdownRef = useRef(null);

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(item =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  if (!showDropdown || filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "z-50 min-w-40 w-fit bottom-full mb-1 max-h-60 overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground p-1 shadow-md absolute animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2",
        className
      )}
    >
      {filteredSuggestions.map((suggestion, index) => (
        <div
          key={index}
          className="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            if (onSelect) {
              onSelect(suggestion);
            }
            setShowDropdown(false);
          }}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
}

function TagsInputItem({
  className,
  children,
  ...props
}) {
  const { editable } = useContext(TagsInputContext);

  return (
    <TagsInputPrimitive.Item
      data-slot="tags-input-item"
      className={cn(
        "inline-flex max-w-[calc(100%-8px)] items-center gap-1.5 rounded border bg-transparent px-2.5 py-1 text-sm focus:outline-hidden data-disabled:cursor-not-allowed data-editable:select-none data-editing:bg-transparent data-disabled:opacity-50 data-editing:ring-1 data-editing:ring-ring",
        editable ? "[&:not([data-editing])]:pr-1.5" : "pr-2.5",
        editable && "[&[data-highlighted]:not([data-editing])]:bg-accent [&[data-highlighted]:not([data-editing])]:text-accent-foreground",
        className
      )}
      {...props}>
      <TagsInputPrimitive.ItemText className="truncate">
        {children}
      </TagsInputPrimitive.ItemText>
      {editable && (
        <TagsInputPrimitive.ItemDelete
          className="size-4 shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
          <X className="size-3.5" />
        </TagsInputPrimitive.ItemDelete>
      )}
    </TagsInputPrimitive.Item>
  );
}

function TagsInputClear({
  ...props
}) {
  return <TagsInputPrimitive.Clear data-slot="tags-input-clear" {...props} />;
}

export {
  TagsInput,
  TagsInputLabel,
  TagsInputList,
  TagsInputInput,
  TagsInputItem,
  TagsInputClear,
  TagsInputDropdown,
};