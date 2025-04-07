import {showError} from "./show_errors.js";

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
    const cpasswordInput = document.getElementById("cpassword") as HTMLInputElement;
    let errorSpan = document.getElementById("error-global") as HTMLTextAreaElement;

    const email = emailInput.value;
    const password = passwordInput.value;
    const cpassword = cpasswordInput.value;

    try {
        const response = await fetch("http://localhost:3000/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, cpassword }),
        });

        await showError(response);

    } catch (err) {
        console.error("Erreur réseau", err);
        errorSpan.style.display = "block";
        errorSpan.innerHTML = `<span>Erreur de connexion au serveur.</span>`;
    }
}