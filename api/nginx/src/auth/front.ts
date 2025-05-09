export const auth =    {
    path: "/auth",
    title: "Authentication",
    template: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return `<div class="flex m-auto gap-8 w-4/5">

            <!-- Sign-in Form -->
            <div class="flex flex-col w-1/2 bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h2 class="text-white text-2xl mb-4">Sign In</h2>
                <div id="error-global-signin" class="text-red-500 text-sm mb-2"></div>

                <label for="email-signin" class="text-white">Email:</label>
                <div id="error-email-signin" class="text-red-500 text-sm mb-1"></div>
                <input type="text" id="email-signin" class="p-2 mb-3 rounded border border-gray-300" />

                <label for="password-signin" class="text-white">Password:</label>
                <div id="error-password-signin" class="text-red-500 text-sm mb-1"></div>
                <input type="password" id="password-signin" class="p-2 mb-4 rounded border border-gray-300" />

                <input type="button" id="submit-signin" value="Sign In"
                       class="bg-blue-600 hover:bg-blue-800 text-white py-2 rounded cursor-pointer" />
            </div>

            <!-- Sign-up Form -->
            <div class="flex flex-col w-1/2 bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h2 class="text-white text-2xl mb-4">Sign Up</h2>
                <div id="error-global-signup" class="text-red-500 text-sm mb-2"></div>

                <label for="email-signup" class="text-white">Email:</label>
                <div id="error-email-signup" class="text-red-500 text-sm mb-1"></div>
                <input type="text" id="email-signup" class="p-2 mb-3 rounded border border-gray-300" />

                <label for="password-signup" class="text-white">Password:</label>
                <div id="error-password-signup" class="text-red-500 text-sm mb-1"></div>
                <input type="password" id="password-signup" class="p-2 mb-3 rounded border border-gray-300" />

                <label for="cpassword" class="text-white">Confirm Password:</label>
                <input type="password" id="cpassword" class="p-2 mb-4 rounded border border-gray-300" />

                <input type="button" id="submit-signup" value="Sign Up"
                       class="bg-blue-600 hover:bg-blue-800 text-white py-2 rounded cursor-pointer" />
            </div>
        </div>

        <script type="module" src="/public/auth/sign-in.js"></script>
        <script type="module" src="/public/auth/sign-up.js"></script>`;
    }
}