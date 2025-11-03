import React, { useEffect } from "react";
import "./modal.css";
import "../../../index.css";

interface Props {
    open: boolean;
    cancelFn?: () => void;
    primaryFn?: () => void;
    secondaryFn?: () => void;
    closeIcon?: string;
    content?: React.ReactNode;
    titleContent?: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<Props> = (props) => {
    const {
        open,
        cancelFn,
        primaryFn,
        secondaryFn,
        closeIcon,
        titleContent,
        content,
    } = props;

    // simple useEffect to capture ESC key to close the modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                if (cancelFn) {
                    cancelFn();
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
    }, [open, cancelFn]);

    if (!open) return null;

    return (
        <div className="modalBackground z-20">
            <div className="modalContainer z-50 w-11/12 md:w-8/12 h-8/12">
                {titleContent && (
                    <div className="title">
                        {titleContent}
                        <div className="titleCloseBtn">
                            <button onClick={cancelFn}>
                                {closeIcon ?? "X"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="body">{content}</div>

                <div className="footer">
                    {secondaryFn && (
                        <button
                            className="primary-button"
                            onClick={secondaryFn}
                            id="cancelBtn"
                        >
                            Create job
                        </button>
                    )}
                    {primaryFn && <button onClick={primaryFn}>Continue</button>}
                </div>
            </div>
        </div>
    );
};
