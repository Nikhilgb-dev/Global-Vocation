import { useState } from "react";
import { MessageSquare } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

const FeedbackButton = ({
    targetType = "platform",
    targetCompanyId = null,
}: {
    targetType?: "platform" | "company";
    targetCompanyId?: string | null;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all z-50"
                title="Give Feedback"
            >
                <MessageSquare className="w-6 h-6" />
            </button>

            {open && (
                <FeedbackModal
                    onClose={() => setOpen(false)}
                    targetType={targetType}
                    targetId={targetCompanyId || undefined}
                />
            )}
        </>
    );
};

export default FeedbackButton;
