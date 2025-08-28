import {errorPopup} from "../menuInsert/errorPopup.js";

export class ApiUtils {

    static showAlert(message: string): void {
        const mainDiv = document.getElementById("dynamic-content")

        if (mainDiv)
            mainDiv.insertAdjacentHTML("beforebegin", errorPopup(message))
        else
            alert(message);
    }
}
