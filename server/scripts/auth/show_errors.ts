export async function showError(response) {
    document.querySelectorAll(".error-message").forEach(errorSpan => errorSpan.innerHTML = "");

    const data = await response.json();

    const errorSpan = document.getElementById("error-" + data.type);

    errorSpan.innerHTML = "";

    if (!response.ok)
        errorSpan.innerHTML = data.error.map(err => `${err}<br>`).join("");
}