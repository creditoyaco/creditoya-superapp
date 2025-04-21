"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "@/context/AuthContext"; // Asegúrate de ajustar la ruta correcta

interface AuthFormData {
    email: string;
    password: string;
    names?: string;
    firstLastName?: string;
    secondLastName?: string;
}

function useAuth() {
    const router = useRouter();
    const authContext = useClientAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [names, setNames] = useState("");
    const [firstLastName, setFirstLastName] = useState("");
    const [secondLastName, setSecondLastName] = useState("");

    // Usamos el estado de carga del contexto de autenticación
    const isLoading = authContext.isLoading;
    // Usamos el error del contexto de autenticación
    const error = authContext.error;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            if (isLogin) {
                // Iniciar sesión usando el método del contexto
                const success = await authContext.login(email, password);

                if (success) {
                    // Redirigir al panel del cliente si la autenticación fue exitosa
                    router.push('/panel');
                }
            } else {
                // Registrar un nuevo usuario usando el método del contexto
                const userData = {
                    email,
                    password,
                    names,
                    firstLastName,
                    secondLastName: secondLastName || undefined
                };

                const success = await authContext.register(userData);

                if (success) {
                    // Redirigir al panel del cliente si el registro fue exitoso
                    router.push('/panel');
                }
            }
        } catch (err) {
            // Los errores son manejados por el contexto
            console.error('Error en autenticación:', err);
        }
    };

    return {
        isLogin,
        email,
        setEmail,
        password,
        setPassword,
        names,
        setNames,
        firstLastName,
        setFirstLastName,
        secondLastName,
        setSecondLastName,
        isLoading,
        error,
        setIsLogin,
        handleSubmit,
    };
}

export default useAuth;