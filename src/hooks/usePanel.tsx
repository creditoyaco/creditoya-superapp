"use client";

import { useClientAuth } from "@/context/AuthContext";
import { User } from "@/types/full";
import axios from "axios";
import { useEffect, useState, useTransition, cache } from "react";
import useLoadingState from "./useLoading";
import { useRouter } from "next/navigation";

export type FieldStatus = {
    name: string;
    completed: boolean;
};

export interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
}

function usePanel() {
    const { user } = useClientAuth();
    const [userComplete, setUserComplete] = useState<User | null>(null);
    const { isLoading, executeWithLoading } = useLoadingState(true);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // States for field status tracking
    const [fieldStatuses, setFieldStatuses] = useState<FieldStatus[]>([]);
    const [allFieldsComplete, setAllFieldsComplete] = useState<boolean>(false);
    const [dataReady, setDataReady] = useState<boolean>(false);

    // Fetch user data when user ID is available
    useEffect(() => {
        if (user?.id) {
            getFullDataClient(user.id);
        }
    }, [user?.id]);

    // Update allFieldsComplete when fieldStatuses changes
    useEffect(() => {
        const allComplete = fieldStatuses.length > 0 && fieldStatuses.every(field => field.completed);
        setAllFieldsComplete(allComplete);
    }, [fieldStatuses]);

    // Cache user data requests
    const fetchUserData = cache(async (userId: string) => {
        try {
            const response = await axios.get(`/api/auth/me?user_id=${userId}`, { withCredentials: true });
            console.log("data client: ", response.data)
            return response.data.data;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching user data:", error.message);
                throw new Error(error.message);
            }
            throw error;
        }
    });

    // Fetch full user data
    const getFullDataClient = async (userId: string) => {
        await executeWithLoading(async () => {
            try {
                // Use startTransition to avoid blocking UI
                startTransition(async () => {
                    const userData = await fetchUserData(userId);
                    setUserComplete(userData);
                    updateFieldStatuses(userData);
                    setDataReady(true);
                });
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                // Show a toast or notification here
            }
        });
    };

    // Update field statuses based on user data
    const updateFieldStatuses = (userData: User | null) => {
        if (!userData) return;

        const statuses: FieldStatus[] = [];

        // Mappings for field names
        const fieldMappings: Record<string, string> = {
            "city": "Ciudad",
            "residence_address": "Dirección de residencia",
            "genre": "Género",
            "phone_whatsapp": "Numero de WhatsApp",
            "phone": "Numero de celular",
        };

        // Mappings for document fields
        const documentFieldMappings: Record<string, string> = {
            "documentSides": "Documento de identidad por ambos lados",
            "imageWithCC": "Selfie de verificacion de identidad",
            "number": "Número de documento"
        };

        // Check main fields
        for (const [key, label] of Object.entries(fieldMappings)) {
            const isCompleted = !(
                userData[key as keyof typeof userData] === "No definidos" ||
                userData[key as keyof typeof userData] === "No definido" ||
                userData[key as keyof typeof userData] === null
            );

            statuses.push({
                name: label,
                completed: isCompleted
            });
        }

        // Check document fields
        if (userData.Document && userData.Document.length > 0) {
            const document = userData.Document[0];
            for (const [key, label] of Object.entries(documentFieldMappings)) {
                const isCompleted = !(
                    document[key as keyof typeof document] === "No definidos" ||
                    document[key as keyof typeof document] === "No definido" ||
                    document[key as keyof typeof document] === null
                );

                statuses.push({
                    name: label,
                    completed: isCompleted
                });
            }
        } else {
            // If no document, mark all document fields as incomplete
            for (const label of Object.values(documentFieldMappings)) {
                statuses.push({
                    name: label,
                    completed: false
                });
            }
        }

        setFieldStatuses(statuses);
    };

    // Refresh user data
    const refreshUserData = () => {
        if (user?.id) {
            setDataReady(false); // Reset data ready state
            getFullDataClient(user.id);
        }
    };

    const toggleNewReq = (isReq?: boolean) => {
        if (isReq === true) {
            router.push('/panel');
        } else if (!isReq || isReq === false) {
            router.push('/panel/nueva-solicitud');
        }
    }

    // Calculate missing fields for backward compatibility
    const missingFields = fieldStatuses
        .filter(field => !field.completed)
        .map(field => field.name);

    return {
        user,
        userComplete,
        fieldStatuses,
        missingFields,
        isLoading,
        isPending,
        allFieldsComplete,
        dataReady,
        router,
        refreshUserData,
        toggleNewReq,
    };
}

export default usePanel;