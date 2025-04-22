import {showError} from "./show_errors.js";

const submitButton = document.getElementById("submit-signup");

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
	cpassword: string;
}

async function submitForm() {
    const emailInput = document.getElementById("email-signup") as HTMLInputElement;
    const passwordInput = document.getElementById("password-signup") as HTMLInputElement;
    const cpasswordInput = document.getElementById("cpassword") as HTMLInputElement;
    let errorSpan = document.getElementById("error-global-signup") as HTMLTextAreaElement;

	const email = emailInput.value;
	const password = passwordInput.value;
	const cpassword = cpasswordInput.value;
	const auth = { email, password, cpassword } as Payload;

    try {
        const response = await fetch("https://localhost:8443/auth/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(auth)
        });

        await showError(response, "up");

    } catch (err) {
        console.error("Erreur réseau", err);
        errorSpan.style.display = "block";
        errorSpan.innerHTML = `<span>Erreur de connexion au serveur.</span>`;
    }
}