import imagesLoaded from "imagesloaded";
import axiosInstance from "../../../api/axios";
import Masonry from "masonry-layout";
import { useEffect, useRef, useState } from "react";
import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { SingleTitleModal } from "../../../components/library/modal/SingleTitleModal";
import { useAuth } from "../../../hooks/useAuth";
import { useLibrary } from "../../../hooks/useLibrary";
import useWindowSize from "../../../hooks/useWindowSize";
import "../../../index.css";
import type { Title } from "../../../types";
import { RefreshButtonIcon } from "../../../icons/globals";
import { TitleGridItem } from "../../../components/library/TitleGridItem";

const VITE_API_HOST = import.meta.env.VITE_API_HOST;
const VITE_API_PORT = import.meta.env.VITE_API_PORT;

export default function LibraryTab() {
    const { isAuthenticated } = useAuth();
    const { titles, loading, isLibraryEmpty, refreshCatalog } = useLibrary();
    const dimensions = useWindowSize();
    const masonry = useRef<Masonry | null>(null);
    const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);

    const handleCreateJob = async (): Promise<boolean> => {
        return axiosInstance
            .post("/library/process/", {
                title_id: selectedTitle?.id,
            })
            .then((res) => {
                if (res.status === 200) {
                    console.warn(
                        `Job for ${selectedTitle?.name} created successfully!`,
                    );
                    return true;
                } else {
                    console.warn(
                        `Failed to create job for ${selectedTitle?.name}`,
                    );
                    return false;
                }
            });
    };

    /**
     * Initialize Masonry layout when titles data is available, after the component mounts.
     */
    useEffect(() => {
        if (titles.length === 0) return;
        const grid = document.querySelector(".titles-grid");
        if (!grid) return;

        imagesLoaded(grid).on("progress", function () {
            // layout Masonry after each image loads
            masonry.current = new Masonry(grid, {
                itemSelector: ".titles-grid-item",
                gutter: 8,
                fitWidth: true, // allows the grid to fit the width of its container, ensuring centered alignment with auto margins
                transitionDuration: 0, // disables animations for instant layout updates
            });

            console.log("Images loading, masonry layout updated");

            if (window.location.hash) {
                const titleToBeSelected = titles.find(
                    (title) =>
                        title.id ===
                        Number(window.location.hash.replace("#", "")),
                );
                if (titleToBeSelected) {
                    setSelectedTitle(titleToBeSelected);
                }
            }
        });

        imagesLoaded(grid).on("done", function () {
            // layout Masonry after all images have loaded
        });
    }, [titles]);

    /**
     * A separate hook (useWindowSize) is necessary to handle the Masonry layout update when window dimensions change.
     */
    useEffect(() => {
        if (!masonry.current) return;
        console.log("Dimensions changed:", dimensions);
    }, [dimensions]);

    /**
     * Handles the history state update when the selected title changes.
     */
    useEffect(() => {
        if (!selectedTitle) return;
        window.history.replaceState(null, "", `#${selectedTitle.id}`);
    }, [selectedTitle]);

    /**
     * Authentication check
     */
    if (!isAuthenticated) {
        return <JokerAccessForbidden />;
    } else {
        console.log("Access granted to LibraryTab");
    }

    return (
        <div className="h-full">
            {selectedTitle && (
                <SingleTitleModal
                    open={Boolean(selectedTitle)}
                    titleContent={selectedTitle?.name ?? null}
                    secondaryFn={() => handleCreateJob()}
                    cancelFn={() => {
                        setSelectedTitle(null);
                        window.history.replaceState(null, "#", " ");
                    }}
                    content={selectedTitle}
                    VITE_API_HOST={VITE_API_HOST}
                    VITE_API_PORT={VITE_API_PORT}
                />
            )}

            <div className="flex w-full justify-center p-2">
                <button
                    disabled={loading}
                    type="submit"
                    className="secondary-button"
                    onClick={!loading ? refreshCatalog : undefined}
                    style={{
                        outline: loading ? "none" : undefined,
                        minWidth: "4rem",
                        minHeight: "3rem",
                    }}
                >
                    {loading ? (
                        <div className="loader-foreground" />
                    ) : (
                        <RefreshButtonIcon />
                    )}
                </button>
            </div>

            <div
                className="titles-grid"
                // to trigger the layout update when window dimensions change, we need to subtract 30 from the width hooked
                style={{ margin: "0 auto", maxWidth: dimensions[0] - 30 }}
            >
                {loading ? (
                    <div className="text-center p-4">
                        <p>Loading...</p>
                    </div>
                ) : !isLibraryEmpty ? (
                    titles.length === 0 ? (
                        <div className="text-center p-4">
                            <p>Finalizing...</p>
                        </div>
                    ) : (
                        titles.map((title) => (
                            <TitleGridItem
                                key={title.id}
                                title={title}
                                setSelectedTitle={() => setSelectedTitle(title)}
                                VITE_API_HOST={VITE_API_HOST}
                                VITE_API_PORT={VITE_API_PORT}
                            />
                        ))
                    )
                ) : (
                    <div className="text-center p-4">
                        <p>No title found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
