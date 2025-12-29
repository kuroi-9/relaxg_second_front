import React, { useState, useEffect, useMemo, useCallback } from "react";
import LibraryService from "../services/libraryService";
import type { Title, Book } from "../types";
import LibraryContext from "./LibraryContextDefinition";

const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [titles, setTitles] = useState<Title[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLibraryEmpty, setIsLibraryEmpty] = useState<boolean>(false);

    const fetchBooks = async () => {
        try {
            const fetchedBooks = await LibraryService.getBooks();
            if (!fetchedBooks || fetchedBooks.length === 0) {
                setIsLibraryEmpty(true);
            } else {
                setBooks(fetchedBooks);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTitles = async () => {
        try {
            const fetchedTitles = await LibraryService.getTitles();
            if (!fetchedTitles || fetchedTitles.length === 0) {
                setIsLibraryEmpty(true);
            } else {
                setTitles(fetchedTitles);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const refreshCatalog = useCallback(async () => {
        try {
            await LibraryService.refreshCatalog();
            await fetchBooks();
            await fetchTitles();
            return true;
        } catch (error) {
            console.error("Error refreshing catalog:", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        fetchBooks();
        fetchTitles();
    }, []);

    const value = useMemo(
        () => ({
            books,
            titles: titles,
            loading,
            isLibraryEmpty: isLibraryEmpty,
            refreshCatalog,
        }),
        [books, titles, loading, isLibraryEmpty, refreshCatalog],
    );

    return (
        <LibraryContext.Provider value={value}>
            {children}
        </LibraryContext.Provider>
    );
};

export default LibraryProvider;
