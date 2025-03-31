"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var Router = /** @class */ (function () {
    function Router(routes) {
        var _this = this;
        this.routes = routes;
        var app = document.getElementById("app");
        if (!app)
            throw new Error("Element not found");
        this.appDiv = app;
        this.bindLinks();
        /*Cette ligne ajoute un écouteur pour l'événement popstate sur l'objet window. L'événement popstate est déclenché lorsque l'utilisateur utilise les boutons Back ou Forward du navigateur. Lorsque cet événement se produit, la méthode updatePage() est appelée pour mettre à jour le contenu affiché en fonction de l'URL courante, assurant ainsi que l'application réagit correctement aux changements de l'historique sans recharger la page. */
        window.addEventListener("popstate", function () { return _this.updatePage(); });
    }
    /*Intercepte les clics*/
    Router.prototype.bindLinks = function () {
        var _this = this;
        document.body.addEventListener("click", function (event) {
            /*seul les liens avec data-link <a href="/home" data-link>Accueil</a>  closest permet de remonter a lelement de datalink*/
            var target = event.target.closest("[data-link]");
            if (target) {
                event.preventDefault();
                var url = target.getAttribute("href");
                if (url) {
                    _this.navigateTo(url);
                }
            }
        });
    };
    Router.prototype.navigateTo = function (url) {
        history.pushState(null, "", url);
        this.updatePage();
    };
    Router.prototype.updatePage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var path, route, content, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = window.location.pathname;
                        route = this.routes.find(function (r) { return r.path === path; }) ||
                            this.routes.find(function (r) { return r.path === "*"; });
                        if (!route) return [3 /*break*/, 5];
                        document.title = route.title;
                        content = route.template;
                        if (!(typeof content === "function")) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, content()];
                    case 2:
                        content = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        content = "<p>Error failed to up this page </p>";
                        return [3 /*break*/, 4];
                    case 4:
                        this.appDiv.innerHTML = content;
                        // Charger dynamiquement le module si on est sur la page d'accueil
                        if (window.location.pathname === "/" && !window.hasLoadedScripts) {
                            window.hasLoadedScripts = true;
                            Promise.resolve().then(function () { return __importStar(require("../srcs/scripts/front/scripts.js")); }).then(function (module) {
                                console.log("Module scripts.js chargé :", module);
                            })
                                .catch(function (error) {
                                console.error("Erreur lors du chargement du module:", error);
                            });
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        this.appDiv.innerHTML = "<h1>404 - Page not found</h1>";
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return Router;
}());
var routes = [
    {
        path: "/",
        title: "Acceuil",
        template: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, "<div class=\"fixed inset-0 w-full h-screen bg-[url('../srcs/img/fond_outside.jpg')] bg-cover bg-no-repeat bg-center -z-10\"></div>\n    <div id=\"player\" class=\"absolute w-64 h-64 bg-[url('../srcs/img/kodama_stop.png')] bg-contain bg-no-repeat\"></div>\n    <script type=\"module\" src=\"../srcs/scripts/front/scripts.js\"></script>\n            "];
                }
            });
        }); }
    },
    {
        path: "/about",
        title: "About",
        template: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, "\n            "];
                }
            });
        }); }
    },
    {
        path: "*",
        title: "404 - Page not found",
        template: "\n            "
    }
];
document.addEventListener("DOMContentLoaded", function () {
    var router = new Router(routes);
    router.updatePage();
});
