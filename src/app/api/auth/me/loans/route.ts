import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        const loan_id = searchParams.get('loan_id');

        const response = await axios.get(`${process.env.GATEWAY_API}/loans/${userId}`)
    } catch (error) {

    }
}