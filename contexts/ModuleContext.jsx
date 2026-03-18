import { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'sonner';
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ModuleContext = createContext(null);



export function ModuleProvider({ children, uuid }) {
    const [active, setActive] = useState(null);
    const [module, setModule] = useState(null);
    const [category, setCategory] = useState(null);
    const [staff, setStaff] = useState(null);
    const [moduleTemp, setModuleTemp] = useState({});
    const [actions, setActions] = useState({});
    const [rightPanel, setRightPanel] = useState("general");
    const [selectedSlide, setSelectedSlide] = useState(null);
    const [openSideSlide, setOpenSideSlide] = useState(true);
    const [openSideSlideDrawer, setOpenSideSlideDrawer] = useState(false);
    const [openSideTabDrawer, setOpenSideTabDrawer] = useState(false);
    const [loading, setLoading] = useState(false);

    // -------------- Load Module --------------
    const loadModule = async () => {
        if (!uuid) return;

        try {
            setLoading(true);

            const response = await api.fetch(
                `${API_URL}/office/trainings/${uuid}`,
                { method: "GET" }
            );

            if (response?.success) {
                setModule(response.data);
            } else {
                toast.error(response?.message || "Error loading module");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error loading module");
        } finally {
            setLoading(false);
        }
    };

    // -------------- Load Module --------------
    const loadCategories = async () => {
        if (!uuid) return;

        try {
            setLoading(true);

            const response = await api.fetch(
                `${API_URL}/office/category/data`,
                { method: "GET" }
            );

            if (response?.success) {
                setCategory(response.data);
            } else {
                toast.error(response?.message || "Error loading category");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error loading category");
        } finally {
            setLoading(false);
        }
    };

    // autoload
    useEffect(() => {
        loadModule();
        loadCategories();
    }, [uuid]);

    // Save
    const handleSaveModule = async () => {
        try {
            setLoading(true);
            // response
            const response = await api.fetch(`${API_URL}/office/trainings/${uuid}/update`, {
                method: "PATCH",
                body: JSON.stringify(moduleTemp)
            });
            // check response
            if (response?.success) {
                setModule(response.data);
                setModuleTemp({});
                // toast
                toast.success(response?.message || "Module berhasil diperbarui");
            } else {
                toast.error(response?.message || "Error loading module");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error loading module");
        } finally {
            setLoading(false);
        }
    }

    // return
    return (
        <ModuleContext.Provider
            value={{
                active,
                setActive,
                module,
                setModule,
                moduleTemp,
                setModuleTemp,
                loading,
                handleSaveModule,
                staff,
                setStaff,
                selectedSlide,
                setSelectedSlide,
                actions,
                setActions,
                rightPanel,
                setRightPanel,
                openSideSlide,
                setOpenSideSlide,
                openSideSlideDrawer,
                setOpenSideSlideDrawer,
                openSideTabDrawer,
                setOpenSideTabDrawer,
                category,
                setCategory,
                loadModule,

            }}
        >
            {children}
        </ModuleContext.Provider>
    );
}

export function useModule() {
    const context = useContext(ModuleContext);

    if (!context) {
        throw new Error("useModule must be used inside ModuleProvider");
    }

    return context;
}
