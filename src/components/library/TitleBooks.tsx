import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import type { Book } from "../../types";
import useWindowSize from "../../hooks/useWindowSize";

async function fetchBooksByTitleName(title_name: string): Promise<Book[]> {
    try {
        const response = await axiosInstance.get(
            `/library/titles/books/${title_name}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching books by title_name:", error);
        throw error;
    }
}

export function TitleBooks({
    title_name,
    percentages,
    gapless,
    padding,
}: {
    title_name: string;
    percentages: number[] | undefined;
    gapless: boolean;
    padding: number;
}) {
    const [books, setBooks] = useState<Book[]>([]);
    const dimensions = useWindowSize();

    useEffect(() => {
        fetchBooksByTitleName(title_name).then(setBooks);
    }, [title_name]);

    useEffect(() => {
        if (percentages !== undefined) {
            console.log(`${title_name} percentages:`, percentages);
        }
    }, [title_name, percentages]);

    useEffect(() => {
        console.log("Dimensions changed:", dimensions);
    }, [dimensions]);

    return (
        <div
            className={`titles-books ${
                books.length > 6
                    ? `md:grid md:grid-cols-2 md:w-full flex flex-col items-start ${gapless ? "md:gap-2" : "gap-4"} p-${padding} w-full`
                    : `flex flex-col items-start ${gapless ? "md:gap-2" : "gap-4"} p-${padding} w-full`
            }`}
        >
            {books.length === 0 && (
                <div className="min-h-16 text-center w-full">Loading...</div>
            )}

            {books
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((book, index) => (
                    <div
                        key={index}
                        className={`${gapless ? "grid grid-cols-[1fr_auto_5rem] gap-2" : "flex border justify-between"}  ${percentages ? "" : "justify-center"} items-center p-2 h-min w-full`}
                        style={
                            gapless
                                ? {
                                      borderBottom: "1px solid gray",
                                      borderLeft: "1px solid gray",
                                      borderRight: "1px solid gray",
                                      borderTop:
                                          window.innerWidth < 768
                                              ? index === 0
                                                  ? "1px solid gray"
                                                  : ""
                                              : "1px solid gray",
                                  }
                                : {}
                        }
                    >
                        <p
                            className={`book-name ${gapless ? " text-left" : ""}`}
                            style={
                                gapless
                                    ? {
                                          overflowX: "auto",
                                          whiteSpace: "nowrap",
                                      }
                                    : {}
                            }
                        >
                            {book.name}
                        </p>
                        {gapless ? (
                            <hr
                                className="border-r h-full"
                                style={{ borderColor: "gray" }}
                            />
                        ) : null}

                        {gapless && (
                            <div
                                style={{
                                    backgroundColor: "#171717",
                                    color: "white",
                                    minWidth: "5rem",
                                }}
                            >
                                {percentages
                                    ? percentages[index]
                                        ? `${percentages[index]}${" "}%`
                                        : "..."
                                    : "N/A"}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}
