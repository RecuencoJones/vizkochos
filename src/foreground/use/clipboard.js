export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

export function useClipboard() {
  return { copyToClipboard };
}
