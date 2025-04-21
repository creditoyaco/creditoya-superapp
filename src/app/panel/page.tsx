"use client";

import usePanel from "@/hooks/usePanel";
import LoadingSpinner from "@/components/gadgets/LoadingSpinner";
import MissingData from "@/components/panel/MissingData";
import LoadingPanel from "@/components/panel/Loading";

function PanelComponent() {
    const {
        isLoading,
        allFieldsComplete
    } = usePanel();

    if (isLoading) return <LoadingPanel />

    if (!allFieldsComplete) return <MissingData />;
}

export default PanelComponent;