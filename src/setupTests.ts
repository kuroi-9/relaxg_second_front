import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";
import { beforeAll, afterEach, afterAll } from "vitest";

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock localStorage pour les tests JSDOM
const localStorageMock = (function () {
    let store: { [key: string]: string } = {};
    return {
        getItem: function (key: string) {
            return store[key] || null;
        },
        setItem: function (key: string, value: string) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        },
        removeItem: function (key: string) {
            delete store[key];
        },
    };
})();
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });
