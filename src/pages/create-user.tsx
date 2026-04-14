import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const initialForm: FormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
};

export default function CreateUserPage() {
    const [form, setForm] = useState<FormState>(initialForm);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch("/api/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = (await response.json()) as { error?: string; message?: string };

            if (!response.ok) {
                throw new Error(data.error || "Unable to create user.");
            }

            setSuccessMessage(data.message || "User created successfully.");
            setForm(initialForm);
            await router.push("/sign-in"); // Redirect to sign-in page after successful user creation. 
            
        } catch (submitError) {
            if (submitError instanceof Error) {
                setError(submitError.message);
            } else {
                setError("Unable to create user.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-zinc-50 px-4 py-10">
            <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-zinc-900">Create Account</h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-zinc-800">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={form.firstName}
                            onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-zinc-800">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={form.lastName}
                            onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-800">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-800">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(event) => setForm({ ...form, password: event.target.value })}
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
                        />
                    </div>

                    {error ? <p className="text-sm text-red-600">{error}</p> : null}
                    {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-500"
                    >
                        {isSubmitting ? "Creating..." : "Sign Up"}
                    </button>
                </form>
            </section>
        </main>
    );
}
