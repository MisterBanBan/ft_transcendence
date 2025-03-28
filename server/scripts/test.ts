console.log("Script activated")

document.getElementById("submit").addEventListener("click", async (event) => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;
    let errorSpan = document.getElementById("error-global");

    document.querySelectorAll(".error-message").forEach(errorSpan => errorSpan.innerHTML = "");

    try {
        const response = await fetch("http://localhost:3000/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, cpassword }),
        });

        const data = await response.json();

        errorSpan = document.getElementById("error-" + data.type);

        errorSpan.innerHTML = "";

        console.log("Réponse du serveur:", data);
        console.log("Type de data.error:", typeof data.error);
        console.log("Est-ce un tableau ?", Array.isArray(data.error));

        if (!response.ok) {
            errorSpan.innerHTML = data.error.map(err => `${err}<br>`).join("");
            return;
        }

        console.log("Erreur insérée dans errorSpan:", errorSpan.innerHTML);
    } catch (err) {
        console.error("Erreur réseau", err);
        errorSpan.style.display = "block";
        errorSpan.innerHTML = `<span>Erreur de connexion au serveur.</span>`;
    }
});