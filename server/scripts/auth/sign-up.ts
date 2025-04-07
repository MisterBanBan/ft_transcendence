import {showError} from "./show_errors";

document.getElementById("submit").addEventListener("click", async (event) => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;
    let errorSpan = document.getElementById("error-global");

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
});