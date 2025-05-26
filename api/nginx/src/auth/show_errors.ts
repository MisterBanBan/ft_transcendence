export async function showError(response: JSON, extension: string, status: boolean) {
	document.querySelectorAll(`.error-message-${extension}`).forEach(errorSpan => errorSpan.innerHTML = "");

	let data
	if (response instanceof Response)
		data = await response.json();
	else
		data = response;

	const errorSpan: HTMLElement | null = document.getElementById(`error-${data.type}-${extension}`);

	if (errorSpan == null) {
		console.error("Can't display error message(s):", data.error);
		return;
	}

	errorSpan.innerHTML = "";

	if (!status)
		errorSpan.innerHTML = data.error.map((err: string) => `${err}<br>`).join("");
}