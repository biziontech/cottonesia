import { useModule } from "@/contexts/ModuleContext";
import { ModuleDescription } from "@/components/partials/modules/ModuleDescription";

export const ModuleWorkspace = () => {
    const { active } = useModule();
    return (
        <div className="flex flex-col gap-3 w-full">
            {!active ? <ModuleDescription /> : active?.content && <active.content {...active.props} />}
        </div>
    );
};