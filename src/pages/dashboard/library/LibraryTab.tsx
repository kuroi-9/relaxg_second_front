import imagesLoaded from "imagesloaded";
import Masonry from "masonry-layout";
import { useEffect, useRef, useState } from "react";
import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { Modal } from "../../../components/library/modal/Modal";
import { useAuth } from "../../../hooks/useAuth";
import { useLibrary } from "../../../hooks/useLibrary";
import useWindowSize from "../../../hooks/useWindowSize";
import "../../../index.css";
import type { Bookserie } from "../../../types";
import { BookserieGridItem } from "../../../components/library/BookserieGridItem";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function LibraryTab() {
    const { isAuthenticated } = useAuth();
    const { bookseries } = useLibrary();
    const dimensions = useWindowSize();
    const masonry = useRef<Masonry | null>(null);
    const [selectedBookseries, setSelectedBookseries] =
        useState<Bookserie | null>(null);

    /**
     * Initialize Masonry layout when bookseries data is available, after the component mounts.
     */
    useEffect(() => {
        if (bookseries.length === 0) return;
        const grid = document.querySelector(".bookseries-grid");
        if (!grid) return;

        imagesLoaded(grid).on("progress", function () {
            // layout Masonry after each image loads
            masonry.current = new Masonry(grid, {
                itemSelector: ".bookseries-grid-item",
                gutter: 8,
                fitWidth: true, // allows the grid to fit the width of its container, ensuring centered alignment with auto margins
                transitionDuration: 0, // disables animations for instant layout updates
            });
            console.log("Images loaded, masonry layout initialized");
            if (window.location.hash) {
                const bookserieToBeSelected = bookseries.find(
                    (bookserie) =>
                        bookserie.id ===
                        Number(window.location.hash.replace("#", "")),
                );
                if (bookserieToBeSelected) {
                    setSelectedBookseries(bookserieToBeSelected);
                }
            }
        });
    });

    /**
     * A separate hook (useWindowSize) is necessary to handle the Masonry layout update when window dimensions change.
     */
    useEffect(() => {
        if (!masonry.current) return;
        console.log("Dimensions changed:", dimensions);
    }, [dimensions]);

    /**
     * Handles the history state update when the selected book series changes.
     */
    useEffect(() => {
        if (!selectedBookseries) return;
        window.history.replaceState(null, "", `#${selectedBookseries.id}`);
    }, [selectedBookseries]);

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
            {selectedBookseries && (
                <Modal
                    open={Boolean(selectedBookseries)}
                    titleContent={selectedBookseries?.title ?? null}
                    secondaryFn={() => setSelectedBookseries(null)}
                    cancelFn={() => {
                        setSelectedBookseries(null);
                        window.history.replaceState(null, "#", " ");
                    }}
                    content={selectedBookseries}
                    VITE_API_URL={VITE_API_URL}
                />
            )}

            <div
                className="bookseries-grid"
                // to trigger the layout update when window dimensions change, we need to subtract 30 from the width hooked
                style={{ margin: "0 auto", maxWidth: dimensions[0] - 30 }}
            >
                {bookseries.length > 0 ? (
                    bookseries.map((bookserie) => (
                        <BookserieGridItem
                            key={bookserie.id}
                            bookserie={bookserie}
                            setSelectedBookseries={() =>
                                setSelectedBookseries(bookserie)
                            }
                            VITE_API_URL={VITE_API_URL}
                        />
                    ))
                ) : (
                    <div className="text-center p-4">
                        <p>No book series found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
