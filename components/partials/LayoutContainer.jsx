export default function LayoutContent({ children }) {
    return (
        <div className="h-full w-full min-h-[calc(100dvh-108px)] p-4 pb-0 flex flex-col">
            <div className="mx-auto h-full w-full">
                {children}
            </div>
        </div>
    )
}