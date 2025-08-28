export async function validatePassword(password: string, confirm_password: string): Promise<string | null> {
	const minLength = 8;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecialChar = /[-+_~='!@#$%^&*(),.?":;{}|<>\[\]\\\/]/.test(password);
	const hasWhitespace = /\s/.test(password);
	const isLongEnough = password.length >= minLength;
	const samePassword = password === confirm_password

	const errors = [] as string[];
	if (hasWhitespace) errors.push("The password must not contain spaces.");
	if (!isLongEnough) errors.push("The password needs at least 8 characters.");
	if (!hasUpperCase) errors.push("The password needs at least 1 upper case.");
	if (!hasNumber) errors.push("The password needs at least 1 number.");
	if (!hasSpecialChar) errors.push("The password needs at least 1 special character.");
	if (!samePassword) errors.push("Passwords don't match.");

	if (errors.length > 0)
		return errors.join("\n");

	return null;
}