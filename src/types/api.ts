declare global {
    interface ParsedApiRequestQueryParams {
        endIndex: number;
        fields: string[];
        filter: Record<string, any>;
        limit: number;
        page: number;
        projection: Record<string, boolean>;
        skip: number;
        sort: Record<string, -1 | 1>;
    }
}

export {};
