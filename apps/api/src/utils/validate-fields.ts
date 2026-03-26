export function validateRequiredFields(
  body: Record<string, unknown>,
  fields: string[],
): string | null {
  for (const field of fields) {
    if (
      body[field] === undefined ||
      body[field] === null ||
      body[field] === ""
    ) {
      return `${field} is required`;
    }
  }
  return null;
}
