import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import type { Book } from "../../types";

async function fetchBooksByBookseriesTitle(
    bookseries_title: string,
): Promise<Book[]> {
    try {
        const response = await axiosInstance.get(
            `/library/bookseries/books/${bookseries_title}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching books by bookseries title:", error);
        throw error;
    }
}

export function BookseriesBooks({
    bookseries_title,
}: {
    bookseries_title: string;
}) {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetchBooksByBookseriesTitle(bookseries_title).then(setBooks);
    }, [bookseries_title]);

    return (
        <div
            className={`bookseries-books ${
                books.length > 16
                    ? "grid grid-cols-2 gap-4 p-4 w-full"
                    : "flex flex-col items-start gap-4 p-4 w-full"
            }`}
        >
            {books.length === 0 && (
                <div className="min-h-16 text-center w-full">Loading...</div>
            )}

            {books
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((book, index) => (
                    <div key={index} className="border p-2 h-min w-full">
                        <p>{book.title}</p>
                    </div>
                ))}
        </div>
    );
}
