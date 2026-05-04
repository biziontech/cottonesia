import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

const splitTime = (value) => {
    const [hour = "00", minute = "00"] = (value || "00:00").split(":");

    return {
        hour: hour.padStart(2, "0"),
        minute: minute.padStart(2, "0"),
    };
};

export default function TimePicker({ value, onChange, disabled = false }) {
    const selected = splitTime(value);

    const handleChange = (type, nextValue) => {
        const nextTime = {
            ...selected,
            [type]: nextValue,
        };

        onChange(`${nextTime.hour}:${nextTime.minute}`);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className="h-9 w-full justify-start px-3 font-normal"
                >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{value || "Pilih jam"}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-2">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Jam</p>
                        <ScrollArea className="h-48 rounded-md border">
                            <div className="p-1">
                                {hours.map((hour) => (
                                    <button
                                        key={hour}
                                        type="button"
                                        onClick={() => handleChange("hour", hour)}
                                        className={`flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors ${selected.hour === hour ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                                    >
                                        {hour}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <div>
                        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Menit</p>
                        <ScrollArea className="h-48 rounded-md border">
                            <div className="p-1">
                                {minutes.map((minute) => (
                                    <button
                                        key={minute}
                                        type="button"
                                        onClick={() => handleChange("minute", minute)}
                                        className={`flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors ${selected.minute === minute ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                                    >
                                        {minute}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
