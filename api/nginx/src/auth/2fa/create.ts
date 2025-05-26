import {Component} from "../../component";

export class TFACreate implements Component {

	private submitButton = document.getElementById("submit");

	public init(): void {

		if (this.submitButton) {
			this.submitButton.addEventListener("click", async (event) => {
				await submit();
			});
		} else {
			console.error("Submit button not found!");
		}

		async function req() {
			try {
				const response = await fetch("/api/auth/2fa/create", {
					method: "GET",
					headers: {"Content-Type": "text/html"},
				});

				const dataUrl = await response.text();

				const imageElement = document.getElementById('qrCodeImage') as HTMLImageElement;

				if (imageElement) {
					imageElement.src = dataUrl;
				}

			} catch (err) {
				console.error("Error: ", err);
			}
		}

		async function submit() {
			const codeInput = document.getElementById("codeInput") as HTMLInputElement;

			const code: string = codeInput.value;

			try {
				const response = await fetch("/api/auth/2fa/create", {
					method: "POST",
					body: code,
				});

				console.log(response);

			} catch (err) {
				console.error("Error: ", err);
			}
		}

		req();
	}

	public destroy(): void {
	}
}
