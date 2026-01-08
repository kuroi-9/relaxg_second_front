import React, { useEffect } from "react";
import "../../index.css";
import "../library/modal/modal.css";

interface Props {
    open: boolean;
    escapeModalFn?: () => void;
    titleContent?: React.ReactNode;
    bodyContent?: React.ReactNode;
    footerContent?: React.ReactNode;
}

/**
 * Generic modal component
 * @param props
 * @returns
 */
export const ModalGeneric: React.FC<Props> = (props) => {
    const { open, escapeModalFn, titleContent, bodyContent, footerContent } =
        props;

    // simple useEffect to capture ESC key to close the modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                if (escapeModalFn) {
                    escapeModalFn();
                }
            }
        };

        // add event listener for ESC keydown event
        document.addEventListener("keydown", handleKeyDown);
        // locking the body scroll if modal is open
        if (open) {
            document
                .getElementsByTagName("body")[0]
                .classList.add("modal-open");
        } else {
            document
                .getElementsByTagName("body")[0]
                .classList.remove("modal-open");
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document
                .getElementsByTagName("body")[0]
                .classList.remove("modal-open");
        };
    }, [open, escapeModalFn]);

    if (!open) return null;

    return (
        <div className="modal-background z-20">
            <div className="modal-container z-50 w-8/12">
                {titleContent && <div className="title">{titleContent}</div>}

                <div className="body">{bodyContent}</div>

                <div className="footer">{footerContent}</div>

                <div className="footer-gap" />
            </div>
        </div>
    );
};
