"use client"

import LoadingPanel from "@/components/panel/Loading";
import useLoan from "@/hooks/useLoan";
import { use } from "react";
import DotBox from "@/components/panel/perfil/DotBox";
import { CircleDollarSign, Files, File, WalletMinimal, Paperclip, CircleUser, Smartphone, Mail, MapPin, Earth, Building2, CalendarClock } from "lucide-react";
import { stringToPriceCOP } from "@/handlers/stringToCop";
import { BankTypes, handleKeyToStringBank } from "@/handlers/stringToBank";
import Image from "next/image";

function LoanInfoPage({ params }: { params: Promise<{ loanId: string }> }) {
    const resolveParams = use(params);
    const { loanId } = resolveParams;
    const {
        loan,
        loading,
        error,
        bgColor,
    } = useLoan({ loanId });

    // Formatear el nombre de la empresa para mostrar
    const formatCompanyName = (company: string): string => {
        return company.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    // Si está cargando, mostrar un indicador de carga
    if (loading) return <LoadingPanel message="Cargando datos de la solicitud de prestamo" />

    // Si hay un error, mostrar el mensaje de error
    if (error) {
        return (
            <main className="pt-26 min-h-dvh dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-3 px-4 flex justify-center items-center min-h-[200px]">
                    <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
                        <p className="font-medium">Error al cargar el préstamo</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            </main>
        )
    }

    // Si no hay préstamo aún después de cargar, mostrar mensaje
    if (!loan) {
        return (
            <main className="pt-26 min-h-dvh dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-3 px-4 flex justify-center items-center min-h-[200px]">
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                        <p className="text-gray-700">No se encontró información del préstamo solicitado.</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-dvh dark:bg-gray-900 py-8 px-4 pt-24">
            {/* Top Card - Loan Amount */}
            <div className="max-w-7xl mx-auto rounded-lg p-6 mb-6">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                            <CircleDollarSign className="text-green-500 drop-shadow-sm" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-300 text-sm">Monto Solicitado</p>
                            <h1 className="text-2xl font-semibold text-green-700">{stringToPriceCOP(loan.cantity)}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <DotBox status={loan.status} />
                    </div>
                </div>
            </div>

            {/* Main Content - Two Column Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Financial and Documents */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Financial Information */}
                    <div className="bg-gray-50 border border-gray-100 dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <WalletMinimal size={20} className="text-green-600 dark:text-green-300 drop-shadow-md" />
                            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-100">Información Financiera</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-green-600 dark:text-green-500 text-sm mb-1">Entidad Bancaria</p>
                                <p className="font-thin text-lg dark:text-gray-100">{handleKeyToStringBank(loan.entity as BankTypes)}</p>
                            </div>
                            <div>
                                <p className="text-green-600 dark:text-green-500 text-sm mb-1">Número de Cuenta</p>
                                <p className="font-thin text-lg dark:text-gray-100">{loan.bankNumberAccount}</p>
                            </div>
                            <div>
                                <p className="text-green-600 dark:text-green-500 text-sm mb-1">Tipo de Cuenta</p>
                                <p className="font-thin text-lg dark:text-gray-100">Ahorros</p>
                            </div>
                            <div>
                                <p className="text-green-600 dark:text-green-500 text-sm mb-1">ID de Solicitud</p>
                                <p className="font-thin text-xs text-gray-600 dark:text-gray-200">{loan.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Required Documents */}
                    <div className="bg-gray-50 border border-gray-100 dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Files size={20} className="text-green-600 dark:text-green-300 drop-shadow-md" />
                            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-100">Documentos Requeridos</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="flex items-center bg-green-50 border border-green-100 dark:bg-gray-500 p-4 rounded-lg">
                                <div className="mr-3">
                                    <Paperclip className="text-green-400 dark:text-green-300 drop-shadow-md" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-600 dark:text-green-400">Primer Volante de Pago</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">{loan.upid_first_flyer}</p>
                                </div>
                            </div>

                            <div className="flex items-center bg-green-50 border border-green-100 dark:bg-gray-500 p-4 rounded-lg">
                                <div className="mr-3">
                                    <Paperclip className="text-green-400 dark:text-green-300 drop-shadow-md" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-600 dark:text-green-400">Segundo Volante de Pago</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">{loan.upid_second_flyer}</p>
                                </div>
                            </div>

                            <div className="flex items-center bg-green-50 border border-green-100 dark:bg-gray-500 p-4 rounded-lg">
                                <div className="mr-3">
                                    <Paperclip className="text-green-400 dark:text-green-300 drop-shadow-md" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-600 dark:text-green-400">Tercer Volante de Pago</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">{loan.upid_third_flyer}</p>
                                </div>
                            </div>

                            <div className="flex items-center bg-green-50 border border-green-100 dark:bg-gray-500 p-4 rounded-lg">
                                <div className="mr-3">
                                    <Paperclip className="text-green-400 dark:text-green-300 drop-shadow-md" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-600 dark:text-green-400">Carta laboral</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">{loan.upid_labor_card}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Personal Info and Status */}
                <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 border border-gray-100 dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <CircleUser className="text-green-600 dark:text-green-300 drop-shadow-md" size={20} />
                            <h2 className="text-lg dark:text-gray-100 font-semibold">Información Personal</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-green-600 dark:text-green-500 text-sm mb-2">Nombre Completo</p>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={loan.user.avatar}
                                        alt={"Avatar de " + loan.user.names}
                                        width={30}
                                        height={30}
                                        className="rounded-full drop-shadow-md object-cover aspect-square overflow-hidden"
                                    />
                                    <p className="font-medium text-gray-800 dark:text-gray-100">David Vasquez Mahecha</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-green-600 dark:text-green-500 text-sm mb-1">Contacto</p>
                                <div className="flex flex-col space-y-3 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="drop-shadow-md dark:text-gray-200" size={15} />
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{loan.user.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="drop-shadow-md dark:text-gray-200" size={15} />
                                        <p className="text-sm text-gray-600 dark:text-gray-300">davidvasquezmahecha@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-green-600 dark:text-green-500 text-sm mb-1">Ubicación</p>
                                <div className="flex flex-col space-y-3 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Earth className="drop-shadow-md dark:text-gray-200" size={15} />
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{loan.user.city}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin className="drop-shadow-md dark:text-gray-200" size={15} />
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{loan.user.residence_address}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-green-600 dark:text-green-500 text-sm mb-1">Empresa Actual</p>
                                <div className="flex items-center gap-2">
                                    <Building2 className="drop-shadow-md dark:text-gray-200" size={15} />
                                    <p className="text-normal text-gray-600 dark:text-gray-300">{formatCompanyName(loan.user.currentCompanie)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application Status */}
                    <div className="bg-gray-50 border border-gray-100 dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <CalendarClock size={20} className="drop-shadow-md text-green-600 dark:text-green-300" />
                            <h2 className="text-lg dark:text-gray-200 font-semibold">Estado de Solicitud</h2>
                        </div>
                        <div>
                            <p className="text-green-600 dark:text-green-500 text-sm mb-1">Fecha de Solicitud</p>
                            <p className="font-normal text-sm dark:text-gray-100">{new Intl.DateTimeFormat('es-CO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }).format(new Date(loan.created_at))}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LoanInfoPage