import { use } from "react"

function LoanInfoPage({ params }: { params: Promise<{ loanId: string }> }) {
    const resolveParams = use(params);
    const { loanId } = resolveParams;

    return (
        <main className="pt-26 min-h-dvh dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-3 px-4">
                <p>{loanId}</p>
            </div>
        </main>
    )
}

export default LoanInfoPage