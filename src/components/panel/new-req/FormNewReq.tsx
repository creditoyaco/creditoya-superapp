import { useState } from "react";
import DefaulInput from "./defaultInput";
import SelectBanks from "./SelectBank";
import SignaturePad from "./SignaturePad";
import usePanel from "@/hooks/usePanel";
import LoadingPanel from "../Loading";
import BoxUploadFiles from "./BoxUploadFile";

function FormNewReq() {
    const [formData, setFormData] = useState<{
        bank: string;
        accountNumber: string;
        amount: string;
        signature: string | null;
    }>({
        bank: "",
        accountNumber: "",
        amount: "",
        signature: null,
    });

    const { userComplete } = usePanel();
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBankSelect = (option: string) => {
        setFormData(prev => ({ ...prev, bank: option }));
        console.log("Selected bank:", option);
    };

    const handleSignature = (signatureData: string | null) => {
        setFormData(prev => ({ ...prev, signature: signatureData }));
        console.log("Signature saved:", signatureData ? "✓" : "✗");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptedTerms) {
            alert("Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        console.log("Formulario enviado:", formData);
        // Aquí iría la lógica de envío del formulario
    };

    if (!userComplete) return <LoadingPanel />;

    return (
        <form onSubmit={handleSubmit}>
            <div className="mt-8 space-y-4">
                <SelectBanks select={handleBankSelect} />
                <DefaulInput title={"Numero de cuenta"} />
                <DefaulInput
                    title={"Monto"}
                    isValue={true}
                    onChange={(value) => handleInputChange("amount", value)}
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
                            <BoxUploadFiles title={"Primer Volante de Pago"} />
                            <BoxUploadFiles title={"Segundo Volante de Pago"} />
                            <BoxUploadFiles title={"Tercer Volante de Pago"} />
                            <BoxUploadFiles title={"Carta laboral actualizada"} />
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
                            onChange={() => setAcceptedTerms(prev => !prev)}
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
