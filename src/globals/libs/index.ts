export function assertNotModifiedAndStripData<T extends { updatedAt: string }>(
    payload: T,
    document: { updatedAt: Date },
) {
    const { updatedAt, ...data } = payload;
    if (updatedAt !== document.updatedAt.toISOString()) throwApiError(409);
    return data;
}
