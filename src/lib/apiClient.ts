import { API_BASE_URL, API_TIMEOUT_MS } from "@/constants/config";

export class ApiError extends Error {
    status: number;
    detail: unknown;

    constructor(status: number, detail: unknown) {
        const message =
            typeof detail === "string" ? detail : `API error (status ${status})`;
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.detail = detail;
    }
}

async function apiFetch<T>(
    path: string,
    init?: RequestInit,
    timeoutMs: number = API_TIMEOUT_MS
): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...init,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers as Record<string, string>),
            },
        });

        if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new ApiError(response.status, body?.detail ?? body);
        }

        return (await response.json()) as T;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        if ((error as Error).name === "AbortError") {
            throw new ApiError(0, "Request timeout");
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
}

export default apiFetch;