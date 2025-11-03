import imagesLoaded from "imagesloaded";
import Masonry from "masonry-layout";
import { useEffect, useRef, useState } from "react";
import JokerAccessForbidden from "../../../components/auth/JokerAccessForbidden";
import { useAuth } from "../../../hooks/useAuth";
import { useLibrary } from "../../../hooks/useLibrary";
import useWindowSize from "../../../hooks/useWindowSize";
import { Modal } from "../../../components/library/modal/Modal";
import "../../../index.css";
import type { Bookserie } from "../../../types";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function LibraryTab() {
    const { isAuthenticated } = useAuth();
    const { bookseries } = useLibrary();
    const dimensions = useWindowSize();
    const masonry = useRef<Masonry | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
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
        });
    }, [bookseries]);

    /**
     * A separate hook (useWindowSize) is necessary to handle the Masonry layout update when window dimensions change.
     */
    useEffect(() => {
        if (!masonry.current) return;
        console.log("Dimensions changed:", dimensions);
    }, [dimensions]);

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
            <Modal
                open={modalOpen}
                titleContent={<h1> {selectedBookseries?.title ?? null} </h1>}
                secondaryFn={() => setModalOpen(false)}
                cancelFn={() => setModalOpen(false)}
                content={
                    <>
                        {selectedBookseries?.cover_image && (
                            <img
                                src={`${VITE_API_URL}library/bookseries/covers/?cover_path=${selectedBookseries.cover_image}`}
                                alt={`${selectedBookseries.title} cover`}
                                className="w-9/12 md:w-2xs border"
                            />
                        )}
                    </>
                }
            />
            <div
                className="bookseries-grid"
                // to trigger the layout update when window dimensions change, we need to subtract 30 from the width hooked
                style={{ margin: "0 auto", maxWidth: dimensions[0] - 30 }}
            >
                {bookseries.length > 0 ? (
                    bookseries.map((bookserie) => (
                        <a
                            key={bookserie.id}
                            className="border bookseries-grid-item mb-2.5 w-2xs md:w-44"
                            style={{}}
                            onClick={() => {
                                setSelectedBookseries(bookserie);
                                setModalOpen(true);
                            }}
                        >
                            {bookserie.cover_image && (
                                <img
                                    src={`${VITE_API_URL}library/bookseries/covers/?cover_path=${bookserie.cover_image}`}
                                    alt={`${bookserie.title} cover`}
                                    className="object-cover p-2"
                                />
                            )}
                            <hr />
                            <h2 className="bookseries-title hover:cursor-default">
                                {bookserie.title}
                            </h2>
                            {bookserie.description && (
                                <p className="text-sm text-gray-600 hover:cursor-default">
                                    {bookserie.description}
                                </p>
                            )}
                        </a>
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
