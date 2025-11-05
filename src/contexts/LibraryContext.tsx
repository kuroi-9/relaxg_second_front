import React, { useState, useEffect, useMemo } from "react";
import LibraryService from "../services/libraryService";
import type { Bookserie, Book } from "../types";
import LibraryContext from "./LibraryContextDefinition";

const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [bookseries, setBookseries] = useState<Bookserie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLibraryEmpty, setIsLibraryEmpty] = useState<boolean>(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const fetchedBooks = await LibraryService.getBooks();
                setBooks(fetchedBooks ?? []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBookseries = async () => {
            try {
                const fetchedBookseries = await LibraryService.getBookseries();
                if (!fetchedBookseries || fetchedBookseries.length === 0) {
                    setIsLibraryEmpty(true);
                } else {
                    setBookseries(fetchedBookseries);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
        fetchBookseries();
    }, []);

    const value = useMemo(
        () => ({
            books,
            bookseries: bookseries,
            loading,
            isLibraryEmpty: isLibraryEmpty,
        }),
        [books, bookseries, loading, isLibraryEmpty],
    );

    return (
        <LibraryContext.Provider value={value}>
            {children}
        </LibraryContext.Provider>
    );
};

export default LibraryProvider;
