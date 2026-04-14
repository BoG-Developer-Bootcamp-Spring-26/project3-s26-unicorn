import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

type FormState = {
    email: string;
    password: string;
};

const initialForm: FormState = {
    email: "",
    password: "",
};

export default function SignInPage() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/users/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(data.error || "Unable to sign in.");
            }

            setForm(initialForm);
            await router.push("/");
        } catch (submitError) {
            if (submitError instanceof Error) {
                setError(submitError.message);
            } else {
                setError("Unable to sign in.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#efefef] text-black">
            <div className="absolute bottom-[-90px] left-[-90px] h-[260px] w-[260px] rounded-full bg-[#e33b2f]" />

            <header className="border-b border-zinc-300 bg-[#efefef] shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
                <div className="flex items-center px-10 py-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-11 w-[74px] items-center justify-center rounded-xl bg-[#f44336] px-4">
                            <span className="text-xl leading-none text-white">🐾</span>
                        </div>
                        <span className="text-4xl font-extrabold tracking-tight text-black">Progress</span>
                    </div>
                </div>
            </header>

            <section className="relative z-10 flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-6 pb-24 pt-10">
                <div className="w-full max-w-[620px]">
                    <h1 className="mb-14 text-center text-7xl font-extrabold tracking-tight text-black">Login</h1>

                    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[620px]">
                        <div className="mb-10">
                            <label htmlFor="email" className="mb-2 block text-2xl font-normal text-zinc-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={(event) => setForm({ ...form, email: event.target.value })}
                                className="w-full border-0 border-b-[3px] border-[#db3a34] bg-transparent px-0 pb-2 pt-1 text-2xl text-black outline-none focus:border-[#db3a34] focus:ring-0"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="mb-2 block text-2xl font-normal text-zinc-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={form.password}
                                onChange={(event) => setForm({ ...form, password: event.target.value })}
                                className="w-full border-0 border-b-[3px] border-[#db3a34] bg-transparent px-0 pb-2 pt-1 text-2xl text-black outline-none focus:border-[#db3a34] focus:ring-0"
                            />
                        </div>

                        {error ? <p className="mb-5 text-center text-base text-red-600">{error}</p> : <div className="mb-5 h-6" />}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-[18px] bg-[#cf3127] px-6 py-4 text-3xl font-bold text-white transition hover:bg-[#bb2a21] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-2xl text-zinc-800">
                        Don&apos;t have an account?{" "}
                        <Link href="/create-user" className="font-extrabold text-black">
                            Sign up
                        </Link>
                    </p>
                </div>
            </section>

            <footer className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-[14px] leading-7 text-zinc-600">
                <p>Made with ♡ by Team Unicorn!!!</p>
                <p>© 2026 BOG Developer Bootcamp. All rights reserved.</p>
            </footer>
        </main>
    );
}
