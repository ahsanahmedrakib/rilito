type WithToObject = { toObject?: () => Record<string, unknown> };

export function toPlain<T>(doc: unknown): T {
  const source =
    typeof (doc as WithToObject)?.toObject === "function"
      ? (doc as Required<WithToObject>).toObject()
      : (doc as Record<string, unknown>);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, createdAt, updatedAt, ...rest } = source;
  return rest as T;
}

export function toProductPlain(doc: unknown) {
  const p = toPlain<Record<string, unknown>>(doc);
  return { ...p, reviews: [] as never[] };
}
