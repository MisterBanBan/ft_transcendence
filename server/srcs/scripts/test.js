"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
console.log("Script activated");
document.getElementById("submit").addEventListener("click", function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, cpassword, errorSpan, response, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = document.getElementById("email").value;
                password = document.getElementById("password").value;
                cpassword = document.getElementById("cpassword").value;
                errorSpan = document.getElementById("error-global");
                document.querySelectorAll(".error-message").forEach(function (errorSpan) { return errorSpan.innerHTML = ""; });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch("http://localhost:3000/sign-up", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: email, password: password, cpassword: cpassword }),
                    })];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                errorSpan = document.getElementById("error-" + data.type);
                errorSpan.innerHTML = "";
                console.log("Réponse du serveur:", data);
                console.log("Type de data.error:", typeof data.error);
                console.log("Est-ce un tableau ?", Array.isArray(data.error));
                if (!response.ok) {
                    errorSpan.innerHTML = data.error.map(function (err) { return "".concat(err, "<br>"); }).join("");
                    return [2 /*return*/];
                }
                console.log("Erreur insérée dans errorSpan:", errorSpan.innerHTML);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error("Erreur réseau", err_1);
                errorSpan.style.display = "block";
                errorSpan.innerHTML = "<span>Erreur de connexion au serveur.</span>";
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
