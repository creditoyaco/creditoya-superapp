import { validateToken } from "@/lib/validate-token";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('creditoya_token')?.value;

    await validateToken(token);

    try {
        // Since we're using FormData, we need to parse it correctly
        const formData = await request.formData();

        // Extract the form fields from formData
        const signature = formData.get('signature') as string;
        const userId = formData.get('user_id') as string;
        const entity = formData.get('entity') as string;
        const bankNumberAccount = formData.get('bankNumberAccount') as string;
        const cantity = formData.get('cantity') as string;
        const terms_and_conditions = formData.get('terms_and_conditions') === 'true';
        const isValorAgregado = formData.get('isValorAgregado') === 'true';

        // Extract file uploads
        const labor_card = formData.get('labor_card') as File | null;
        const fisrt_flyer = formData.get('fisrt_flyer') as File | null;
        const second_flyer = formData.get('second_flyer') as File | null;
        const third_flyer = formData.get('third_flyer') as File | null;

        // Validate required fields
        if (!signature) {
            return NextResponse.json({
                success: false,
                error: 'No se proporcionó la firma del préstamo'
            }, { status: 400 });
        } else if (!userId) {
            return NextResponse.json({
                success: false,
                error: 'No se proporcionó el ID del usuario'
            }, { status: 400 });
        } else if (!entity || !bankNumberAccount || !cantity || !terms_and_conditions) {
            return NextResponse.json({
                success: false,
                error: 'Faltan campos obligatorios'
            }, { status: 400 });
        }

        // If not isValorAgregado, check for required files
        if (!isValorAgregado && (!labor_card || !fisrt_flyer || !second_flyer || !third_flyer)) {
            return NextResponse.json({
                success: false,
                error: 'Faltan archivos requeridos'
            }, { status: 400 });
        }

        // Create a new FormData for the API request
        const apiFormData = new FormData();

        // Add body fields to the API request - these will go in the request body
        apiFormData.append('signature', signature);
        apiFormData.append('entity', entity);
        apiFormData.append('bankNumberAccount', bankNumberAccount);
        apiFormData.append('cantity', cantity);
        apiFormData.append('terms_and_conditions', terms_and_conditions.toString());

        // Only add isValorAgregado if it's true (matches the optional parameter in the controller)
        if (isValorAgregado) {
            apiFormData.append('isValorAgregado', isValorAgregado.toString());
        }

        // Add files with the exact field names expected by the FileFieldsInterceptor
        if (labor_card) apiFormData.append('labor_card', labor_card);
        if (fisrt_flyer) apiFormData.append('fisrt_flyer', fisrt_flyer);
        if (second_flyer) apiFormData.append('second_flyer', second_flyer);
        if (third_flyer) apiFormData.append('third_flyer', third_flyer);

        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            const baseURL = process.env.GATEWAY_API || '';

            // Make the request to the backend API - note userId is now in the URL path
            const loanResponse = await axios.post(
                `${baseURL}/loans/${userId}`,
                apiFormData,
                config
            );

            console.log('[UPLOAD] API response:', loanResponse.status, loanResponse.statusText);
            console.log('[UPLOAD] API response data:', loanResponse.data);

            return NextResponse.json({
                success: true,
                data: "Creación de préstamo exitoso",
                loanDetails: loanResponse.data
            });
        } catch (apiError: any) {
            console.error('[UPLOAD] API request error details:', {
                status: apiError.response?.status,
                statusText: apiError.response?.statusText,
                data: apiError.response?.data,
                message: apiError.message
            });

            return NextResponse.json({
                success: false,
                error: apiError.response?.data?.message || 'Error al procesar la solicitud'
            }, { status: apiError.response?.status || 500 });
        }
    } catch (error: any) {
        console.error('[UPLOAD] Server error:', error);
        return NextResponse.json({
            success: false,
            error: 'Error interno del servidor'
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('creditoya_token')?.value;

    try {
        await validateToken(token);

        const { searchParams } = new URL(req.url);
        const loan_id = searchParams.get('loan_id');
        const user_id = searchParams.get('user_id');

        console.log("loanId: ", loan_id);
        console.log("userId: ", user_id);

        if (!loan_id || !user_id) {
            return NextResponse.json({
                success: false,
                error: 'Faltan parámetros requeridos: loan_id y user_id'
            }, { status: 400 });
        }

        const baseURL = process.env.GATEWAY_API || '';
        const response = await axios.get(
            `${baseURL}/loans/${user_id}/${loan_id}/info`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            },
        );

        console.log("Respuesta del API:", response.data);

        if (response.data.success === false) {
            throw new Error(response.data.error || 'Error al obtener información del préstamo');
        }

        return NextResponse.json({
            success: true,
            data: response.data
        });
    } catch (error: any) {
        console.error('[API] Error en petición GET loan:', error);

        if (error.response?.status === 401) {
            return NextResponse.json({
                success: false,
                error: 'No autenticado'
            }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            error: error.response?.data?.error || error.message || 'Error del servidor al obtener información del préstamo'
        }, { status: error.response?.status || 500 });
    }
}