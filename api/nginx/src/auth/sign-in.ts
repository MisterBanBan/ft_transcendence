import {showError} from "./show_errors.js";

interface payload {
    email: string;
    password: string;
}

const submitButton = document.getElementById("submit");

if (submitButton) {
    submitButton.addEventListener("click", async (event) => {
        await submitForm();
        console.log("Button clicked");
    });
} else {
    console.error("Submit button not found!");
}

async function submitForm() {

    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    let errorSpan = document.getElementById("error-global") as HTMLTextAreaElement;

    const email: string = emailInput.value;
    const password: string = passwordInput.value;
    const body: payload = {email, password};

    try {
        const response = await fetch("http://localhost:3000/sign-in", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        });

        const jsonResponse: payload = await response.json();
        await showError(jsonResponse);

    } catch (err) {
        console.error("Erreur réseau", err);
        errorSpan.style.display = "block";
        errorSpan.innerHTML = `<span>Erreur de connexion au serveur.</span>`;
    }
}