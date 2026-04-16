"use client";
import { useDrop } from "react-dnd";
import { parseISO, differenceInMilliseconds } from "date-fns";
import { useUpdateEvent } from "@/calendar/hooks/use-update-event";
import { cn } from "@/lib/utils";
import { ItemTypes } from "@/calendar/components/dnd/draggable-event";
export function DroppableDayCell({ cell, children }) {
    const { updateEvent } = useUpdateEvent();
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.EVENT,
        drop: (item) => {
            const droppedEvent = item.event;
            const eventStartDate = parseISO(droppedEvent.startDate);
            const eventEndDate = parseISO(droppedEvent.endDate);
            const eventDurationMs = differenceInMilliseconds(eventEndDate, eventStartDate);
            const newStartDate = new Date(cell.date);
            newStartDate.setHours(eventStartDate.getHours(), eventStartDate.getMinutes(), eventStartDate.getSeconds(), eventStartDate.getMilliseconds());
            const newEndDate = new Date(newStartDate.getTime() + eventDurationMs);
            updateEvent({
                ...droppedEvent,
                startDate: newStartDate.toISOString(),
                endDate: newEndDate.toISOString(),
            });
            return { moved: true };
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [cell.date, updateEvent]);
    return (<div ref={drop} className={cn(isOver && canDrop && "bg-accent/50")}>
      {children}
    </div>);
}
