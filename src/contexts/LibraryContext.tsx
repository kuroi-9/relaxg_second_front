import React, { useState, useEffect, useMemo } from "react";
import LibraryService from "../services/libraryService";
import { type Bookserie, type Book } from "../types";
import LibraryContext from "./LibraryContextDefinition";

const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [bookseries, setBookseries] = useState<Bookserie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await LibraryService.getBooks();
                setBooks(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBookseries = async () => {
            try {
                const response = await LibraryService.getBookseries();
                setBookseries(response);
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
        }),
        [books, bookseries, loading],
    );

    return (
        <LibraryContext.Provider value={value}>
            {children}
        </LibraryContext.Provider>
    );
};

export default LibraryProvider;
