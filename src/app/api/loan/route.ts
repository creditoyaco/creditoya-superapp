import { validateToken } from "@/lib/validate-token";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('creditoya_token')?.value;
    
    const { isValid, error } = await validateToken(token);
    
    if (!isValid) {
        console.warn('[UPLOAD] Token inválido o expirado');
        return NextResponse.json({
            success: false,
            error: error || 'Token inválido o expirado'
        }, { status: 401 });
    }
    
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
        
        // Add all fields to the API request
        apiFormData.append('signature', signature);
        apiFormData.append('entity', entity);
        apiFormData.append('bankNumberAccount', bankNumberAccount);
        apiFormData.append('cantity', cantity);
        apiFormData.append('terms_and_conditions', terms_and_conditions.toString());
        apiFormData.append('isValorAgregado', isValorAgregado.toString());
        
        // Add files if they exist
        if (labor_card) apiFormData.append('labor_card', labor_card);
        if (fisrt_flyer) apiFormData.append('fisrt_flyer', fisrt_flyer);
        if (second_flyer) apiFormData.append('second_flyer', second_flyer);
        if (third_flyer) apiFormData.append('third_flyer', third_flyer);
        
        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        };
        
        try {
            // Make the request to the backend API
            const loanDB = await axios.post(
                `${process.env.GATEWAY_API}/loan/${userId}`,
                apiFormData,
                config
            );
            
            console.log('[UPLOAD] API response:', loanDB.status, loanDB.statusText);
            console.log('[UPLOAD] API response data:', loanDB.data);
            
            return NextResponse.json({
                success: true,
                data: "Creación de préstamo exitoso",
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