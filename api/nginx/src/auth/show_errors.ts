export async function showError(response: any) {
    document.querySelectorAll(".error-message").forEach(errorSpan => errorSpan.innerHTML = "");

    const data = await response.json();

    const errorSpan: HTMLElement | null = document.getElementById("error-" + data.type);

    if (errorSpan == null) {
        // TODO error
        return;
    }

    errorSpan.innerHTML = "";

    if (!response.ok)
        errorSpan.innerHTML = data.error.map((err: string) => `${err}<br>`).join("");
}