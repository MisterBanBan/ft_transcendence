import {showError} from "./show_errors.js";

const submitButton = document.getElementById("submit-signin");

if (submitButton) {
    submitButton.addEventListener("click", async (event) => {
        await submitForm();
        console.log("Button clicked");
    });
} else {
    console.error("Submit button not found!");
}

interface Payload {
    email: string;
    password: string;
}

async function submitForm() {

    const emailInput = document.getElementById("email-signin") as HTMLInputElement;
    const passwordInput = document.getElementById("password-signin") as HTMLInputElement;
    let errorSpan = document.getElementById("error-global-signin") as HTMLTextAreaElement;

    const email: string = emailInput.value;
    const password: string = passwordInput.value;
    const body = {email, password} as Payload;

    try {
        const response = await fetch("https://localhost:8443/auth/sign-in", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        });

        await showError(response, "in");

    } catch (err) {
        console.error("Erreur réseau", err);
        errorSpan.style.display = "block";
        errorSpan.innerHTML = `<span>Erreur de connexion au serveur.</span>`;
    }
}