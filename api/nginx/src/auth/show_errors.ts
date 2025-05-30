export async function showError(error: string, div: HTMLElement) {
	div.textContent = error;
}