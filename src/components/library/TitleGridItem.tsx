import type { Title } from "../../types";
import "../../index.css";

interface externalGridItemProps {
    VITE_API_HOST: string;
    VITE_API_PORT: string;
}

interface TitleGridItemProps {
    title: Title;
    setSelectedTitle: (title: Title) => void;
}

export const TitleGridItem: React.FC<
    TitleGridItemProps & externalGridItemProps
> = ({
    title,
    setSelectedTitle,
    VITE_API_HOST,
    VITE_API_PORT,
}: {
    title: Title;
    setSelectedTitle: (title: Title) => void;
    VITE_API_HOST: string;
    VITE_API_PORT: string;
}) => {
    return (
        <a
            key={title.id}
            className="border titles-grid-item mb-2.5 w-36 md:w-44"
            style={{}}
            onClick={() => {
                setSelectedTitle(title);
            }}
        >
            {title.cover_image && (
                <img
                    src={`http://${VITE_API_HOST}:${VITE_API_PORT}/api/library/titles/covers/?cover_path=${title.cover_image}`}
                    alt={`${title.name} cover`}
                    className="object-cover p-2"
                />
            )}
            <hr />
            <h2 className="titles-title hover:cursor-default">{title.name}</h2>
            {title.description && (
                <p className="text-sm text-gray-600 hover:cursor-default">
                    {title.description}
                </p>
            )}
        </a>
    );
};
