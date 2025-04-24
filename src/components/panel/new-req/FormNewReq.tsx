"use client"

import { useState } from "react";
import DefaultInput from "./defaultInput";
import SelectBanks from "./SelectBank";
import SignaturePad from "./SignaturePad";
import usePanel from "@/hooks/usePanel";
import LoadingPanel from "../Loading";
import BoxUploadFiles from "./BoxUploadFile";
import axios from "axios";

interface FormDataProps {
    entity: string;
    bankNumberAccount: string;
    cantity: string;
    signature: string | null;
    terms_and_conditions: boolean;
    labor_card: File | null;
    fisrt_flyer: File | null;
    second_flyer: File | null;
    third_flyer: File | null;
}

function FormNewReq() {
    const [formData, setFormData] = useState<FormDataProps>({
        entity: "",
        bankNumberAccount: "",
        cantity: "",
        signature: null,
        labor_card: null,
        fisrt_flyer: null,
        second_flyer: null,
        third_flyer: null,
        terms_and_conditions: false,
    });

    const { userComplete } = usePanel();
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    console.log("loan Data: ", formData)

    // Handle bank selection
    const handleBankSelect = (option: string) => {
        setFormData(prev => ({ ...prev, entity: option }));
        console.log("Selected bank:", option);
    };

    // Handle bank account number input
    const handleBankAccountChange = (value: string) => {
        setFormData(prev => ({ ...prev, bankNumberAccount: value }));
    };

    // Handle cantity input
    const handleCantityChange = (value: string) => {
        setFormData(prev => ({ ...prev, cantity: value }));
    };

    // Handle signature
    const handleSignature = (signatureData: string | null) => {
        setFormData(prev => ({ ...prev, signature: signatureData }));
        console.log("Signature saved:", signatureData ? "✓" : "✗");
    };

    // Handle file uploads
    const handleFileUpload = (
        field: 'labor_card' | 'fisrt_flyer' | 'second_flyer' | 'third_flyer',
        file: File | null
    ) => {
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    // Handle terms and conditions toggle
    const handleTermsChange = () => {
        const newValue = !acceptedTerms;
        setAcceptedTerms(newValue);
        setFormData(prev => ({ ...prev, terms_and_conditions: newValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!acceptedTerms) {
            alert("Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        try {
            console.log("Formulario enviado:", formData);

            // Create a FormData object to handle file uploads
            const apiFormData = new FormData();

            // Append all files
            if (formData.labor_card) apiFormData.append('labor_card', formData.labor_card);
            if (formData.fisrt_flyer) apiFormData.append('fisrt_flyer', formData.fisrt_flyer);
            if (formData.second_flyer) apiFormData.append('second_flyer', formData.second_flyer);
            if (formData.third_flyer) apiFormData.append('third_flyer', formData.third_flyer);

            // Append signature as string
            if (formData.signature) apiFormData.append('signature', formData.signature);

            // Append user ID
            apiFormData.append('user_id', userComplete?.id as string);

            // Append other form data fields
            apiFormData.append('entity', formData.entity);
            apiFormData.append('bankNumberAccount', formData.bankNumberAccount);
            apiFormData.append('cantity', formData.cantity);
            apiFormData.append('terms_and_conditions', formData.terms_and_conditions.toString());
            apiFormData.append('isValorAgregado', (userComplete?.currentCompanie === "valor_agregado").toString());

            // Make the request
            const response = await axios.post("/api/loan", apiFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            if (response.data.success) {
                alert("Préstamo creado exitosamente");
            } else {
                alert("Error al crear el préstamo: " + response.data.error);
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            alert("Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.");
        }
    };

    if (!userComplete) return <LoadingPanel />;

    return (
        <form onSubmit={handleSubmit}>
            <div className="mt-8 space-y-4">
                <SelectBanks select={handleBankSelect} />
                <DefaultInput
                    title={"Numero de cuenta"}
                    onChange={handleBankAccountChange}
                    value={formData.bankNumberAccount}
                    required
                />
                <DefaultInput
                    title={"Monto"}
                    isValue={true}
                    onChange={handleCantityChange}
                    value={formData.cantity}
                    required
                    placeholder="0"
                />
                <SignaturePad onSave={handleSignature} required />

                {userComplete.currentCompanie !== "valor_agregado" && (
                    <div>
                        <label className="text-lg font-medium dark:text-gray-300 text-gray-700 mb-2">
                            Soportes de Ingresos Laborales
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <BoxUploadFiles
                                title={"Primer Volante de Pago"}
                                onChange={(file) => handleFileUpload('fisrt_flyer', file)}
                                required
                            />
                            <BoxUploadFiles
                                title={"Segundo Volante de Pago"}
                                onChange={(file) => handleFileUpload('second_flyer', file)}
                                required
                            />
                            <BoxUploadFiles
                                title={"Tercer Volante de Pago"}
                                onChange={(file) => handleFileUpload('third_flyer', file)}
                                required
                            />
                            <BoxUploadFiles
                                title={"Carta laboral actualizada"}
                                onChange={(file) => handleFileUpload('labor_card', file)}
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Términos y Condiciones */}
                <div className="grid place-content-center mt-10">
                    <div className="flex items-start gap-2 mb-4">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptedTerms}
                            onChange={handleTermsChange}
                            className="mt-1"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                            Acepto los{" "}
                            <a
                                href="https://tusitio.com/terminos"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Términos y Condiciones
                            </a>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!acceptedTerms}
                    className={`w-full px-4 py-2 rounded-xl transition-all text-white ${acceptedTerms
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                        } mb-10`}
                >
                    Continuar
                </button>
            </div>
        </form>
    );
}

export default FormNewReq;