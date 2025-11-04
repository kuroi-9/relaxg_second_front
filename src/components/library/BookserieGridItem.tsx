import type { Bookserie } from "../../types";
import "../../index.css";

interface externalGridItemProps {
    VITE_API_URL: string;
}

interface BookserieGridItemProps {
    bookserie: Bookserie;
    setSelectedBookseries: (bookserie: Bookserie) => void;
}

export const BookserieGridItem: React.FC<
    BookserieGridItemProps & externalGridItemProps
> = ({
    bookserie,
    setSelectedBookseries,
    VITE_API_URL,
}: {
    bookserie: Bookserie;
    setSelectedBookseries: (bookserie: Bookserie) => void;
    VITE_API_URL: string;
}) => {
    return (
        <a
            key={bookserie.id}
            className="border bookseries-grid-item mb-2.5 w-36 md:w-44"
            style={{}}
            onClick={() => {
                setSelectedBookseries(bookserie);
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
    );
};
