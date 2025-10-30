import { useLayoutEffect, useState } from "react";

/**
 * Custom hook that returns the current window size in an array.
 */
export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateWindowSize() {
            setWindowSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener("resize", updateWindowSize);
        updateWindowSize();
        return () => window.removeEventListener("resize", updateWindowSize);
    }, []);
    return windowSize;
}
