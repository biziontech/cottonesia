import { useModule } from "@/contexts/ModuleContext";

export const ModuleWorkspaceTitle = ({ Action, active: activeInitial }) => {
    const { active: activeModule } = useModule();
    const active = activeInitial ? activeInitial : activeModule

    return (
        <>
            {active?.title && (
                <div className="flex flex-col md:flex-row gap-5 justify-between py-3">
                    <div className="flex flex-1 gap-4">
                        {active?.icon && (
                            <div className="flex items-center size-10 rounded-xl shadow justify-center bg-white">
                                <active.icon className="size-5 text-gray-500" />
                            </div>
                        )}
                        <div className="flex flex-col flex-1">
                            <h4 className="font-semibold">{active?.title}</h4>
                            {active?.subtitle && (
                                <small className="text-gray-500 line-clamp-1">{active?.subtitle}</small>
                            )}
                        </div>
                    </div>
                    {Action && <Action />}
                </div>
            )}
        </>
    )
}