import LoadingSpinner from "../gadgets/LoadingSpinner";

function LoadingPanel() {
    return (
        <main className="pt-32 dark:bg-gray-900 min-h-dvh flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" color="auto" />
            <p className="mt-4 text-gray-300">Cargando información del usuario...</p>
        </main>
    );
}

export default LoadingPanel