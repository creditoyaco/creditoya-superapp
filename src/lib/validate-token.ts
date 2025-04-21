/**  
 * Función para validar el token JWT
*/
export async function validateToken(token: string | undefined): Promise<{ isValid: boolean; error: string | null }> {
    try {
        if (!token) {
            return { isValid: false, error: 'No se encontró token en cookies' };
        }

        // Decodificar y validar expiración del token
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            return { isValid: false, error: 'Formato de token inválido' };
        }

        // Decodificar el payload (segunda parte del token)
        const base64Payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = Buffer.from(base64Payload, 'base64').toString('utf-8');
        const payload = JSON.parse(decodedPayload);

        // Verificar expiración
        if (payload.exp) {
            const expTime = new Date(payload.exp * 1000);
            const now = new Date();

            if (expTime < now) {
                return { isValid: false, error: 'Token expirado' };
            }
        }

        return { isValid: true, error: null };
    } catch (error: any) {
        return {
            isValid: false,
            error: `Error al validar token: ${error.message}`
        };
    }
}