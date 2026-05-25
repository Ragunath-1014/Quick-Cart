function Loader({ loadingMessage }) {
    return (
        <div
            className="fixed inset-0 
            flex justify-center 
            items-center bg-black/10
            backdrop-blur-md z-50"
        >
            <div
                className="flex flex-col 
                items-center justify-center 
                min-h-screen animate-pulse
                gap-2"
            >
                <div className="animate-spin h-6 w-6 rounded-full border-2 border-transparent border-t-black" />
                <p className="test-sm font-medium">{loadingMessage}</p>
            </div>
        </div>
    );
}

export default Loader;