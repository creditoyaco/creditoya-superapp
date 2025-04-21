"use client";

import usePanel from "@/hooks/usePanel";
import MissingData from "@/components/panel/MissingData";
import LoadingPanel from "@/components/panel/Loading";
import { CircleHelp, FolderPlus, Plus } from "lucide-react";
import searchIlustration from "@/assets/ilustrations/Search.svg";
import Image from "next/image";
import { useState } from "react";
import FormNewReq from "@/components/panel/new-req/FormNewReq";

function PanelComponent() {
    const [isOpenNewReq, setIsOpenNewReq] = useState(false);

    const toggleNewReq = () => setIsOpenNewReq(!isOpenNewReq);

    const {
        isLoading,
        allFieldsComplete,
        userComplete
    } = usePanel();

    if (isLoading && !userComplete) return <LoadingPanel />

    if (!allFieldsComplete) return <MissingData />;

    return (
        <main className="pt-32 min-h-dvh dark:bg-gray-900 px-[5%] flex flex-col">
            <div className="flex flex-wrap-reverse gap-3 justify-between w-full">
                <div className="flex flex-row gap-2">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
                        aria-label="Crear nueva solicitud"
                        onClick={toggleNewReq}
                    >
                        <FolderPlus size={16} className="flex-shrink-0" />
                        <span className="text-sm font-medium">
                            {isOpenNewReq ? "Cancelar" : "Crear nueva solicitud"}
                        </span>
                    </button>

                    {isOpenNewReq && (
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
                            aria-label="Crear nueva solicitud"
                        >
                            <FolderPlus size={16} className="flex-shrink-0" />
                            <span className="text-sm font-medium">Guardar Borrador</span>
                        </button>
                    )}
                </div>

                {!isOpenNewReq && (
                    <button
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        aria-label="Ver instrucciones"
                    >
                        <CircleHelp size={16} className="flex-shrink-0 dark:text-gray-400" />
                        <span className="text-sm font-medium dark:text-gray-400">Instrucciones</span>
                    </button>
                )}
            </div>

            {userComplete?.LoanApplication?.length === 0 && !isOpenNewReq && (
                <div className="flex flex-col items-center justify-center flex-grow mt-12 mb-20">
                    <div className="relative w-64 h-64 opacity-65">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-800 opacity-20 rounded-full"></div>
                        <Image
                            src={searchIlustration}
                            alt="No hay solicitudes"
                            fill
                            className="object-contain drop-shadow-sm"
                        />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mt-6 font-medium">Sin ninguna solicitud hasta el momento</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-md text-center">
                        Empieza creando tu primera solicitud de préstamo usando el botón superior.
                    </p>
                    <button onClick={toggleNewReq} className="mt-8 flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 shadow-sm">
                        <Plus size={16} strokeWidth={2.5} />
                        <span className="font-medium">Nueva solicitud</span>
                    </button>
                </div>
            )}

            {isOpenNewReq && <FormNewReq />}
        </main>
    )
}

export default PanelComponent;