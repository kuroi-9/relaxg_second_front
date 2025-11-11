import React, { useEffect } from "react";
import "../../../index.css";
import type { Title } from "../../../types";
import { TitleBooks } from "../TitleBooks";
import "./modal.css";

interface externalProps {
    VITE_API_URL: string;
}

interface Props {
    open: boolean;
    cancelFn?: () => void;
    primaryFn?: () => void;
    secondaryFn?: () => void;
    titleContent?: React.ReactNode;
    content: Title;
}

export const Modal: React.FC<Props & externalProps> = (props) => {
    const {
        open,
        cancelFn,
        primaryFn,
        secondaryFn,
        titleContent,
        content,
        VITE_API_URL,
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
            <div className="modalContainer z-50 w-8/12">
                {titleContent && <div className="title">{titleContent}</div>}

                <div className="body">
                    <img
                        src={`${VITE_API_URL}library/titles/covers/?cover_path=${content.cover_image}`}
                        alt={`${content.name} cover`}
                        className="modal-img m-4"
                    />
                    <TitleBooks title_name={content.name} />
                </div>

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
                    <button
                        className="secondary-button border h-full pl-2 pr-2 ml-2"
                        onClick={cancelFn}
                        id="cancelBtn"
                    >
                        Close
                    </button>
                    {primaryFn && <button onClick={primaryFn}>Continue</button>}
                </div>
            </div>
        </div>
    );
};
