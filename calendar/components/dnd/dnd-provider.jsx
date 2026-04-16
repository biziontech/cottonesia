"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CustomDragLayer } from "@/calendar/components/dnd/custom-drag-layer";
export function DndProviderWrapper({ children }) {
    return (<DndProvider backend={HTML5Backend}>
      {children}
      <CustomDragLayer />
    </DndProvider>);
}
