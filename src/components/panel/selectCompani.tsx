"use client"

import React, { useEffect, useState } from 'react';
import usePanelApi from '@/hooks/usePanelApi';
import { UserCompany } from '@/types/full';

const SelectEmpresa: React.FC = () => {
    const { userComplete, updateUserField } = usePanelApi();
    
    // Estado para controlar si el componente está inicializado
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Estado para almacenar el valor de la empresa
    const [companyValue, setCompanyValue] = useState<UserCompany | null>(null);
    
    // Estado para controlar si está ocurriendo una actualización manual
    const [manuallyUpdating, setManuallyUpdating] = useState(false);
    
    // Efecto para inicializar el componente cuando los datos del usuario están disponibles
    useEffect(() => {
        if (userComplete?.currentCompanie && !isInitialized) {
            setCompanyValue(userComplete.currentCompanie as UserCompany);
            setIsInitialized(true);
        }
    }, [userComplete?.currentCompanie, isInitialized]);
    
    // Manejador para el cambio del selector
    const handleCompanyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as UserCompany;
        
        // Actualizar estado local
        setCompanyValue(newValue);
        
        // Prevenir múltiples actualizaciones
        if (manuallyUpdating) return;
        
        try {
            setManuallyUpdating(true);
            // Actualizar en el backend directamente (sin usar debounce)
            await updateUserField('currentCompanie', newValue);
        } finally {
            // Restaurar estado después de un tiempo para evitar múltiples actualizaciones
            setTimeout(() => {
                setManuallyUpdating(false);
            }, 1500);
        }
    };
    
    // Formatear el nombre de la empresa para mostrar
    const formatCompanyName = (company: string): string => {
        return company.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };
    
    // No mostrar nada hasta que se inicialice
    if (!isInitialized || companyValue === null) {
        return (
            <div className="w-full mt-6">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-white mb-3">
                    Entidad a la que pertenece
                </h3>
                <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
        );
    }
    
    return (
        <div className="w-full mt-6">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-white mb-3">
                Entidad a la que pertenece
            </h3>
            <div className="">
                <div className="relative">
                    <select
                        value={companyValue}
                        onChange={handleCompanyChange}
                        className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-thin"
                        disabled={manuallyUpdating}
                    >
                        {Object.values(UserCompany).map((company) => (
                            <option key={company} value={company}>
                                {formatCompanyName(company)}
                            </option>
                        ))}
                    </select>
                    {manuallyUpdating && (
                        <div className="absolute right-3 top-2">
                            <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                        </div>
                    )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {manuallyUpdating ? 'Actualizando...' : 'Seleccione la empresa a la que pertenece'}
                </p>
            </div>
        </div>
    );
};

export default SelectEmpresa;