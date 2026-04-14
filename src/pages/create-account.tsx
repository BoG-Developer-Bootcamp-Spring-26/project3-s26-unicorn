import Circle from "@/components/Circle";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateAccount() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState("");
    async function signUp() {
        if (!firstName) {
            return setMessage("First name required");
        }
        if (!lastName) {
            return setMessage("Last name required");
        }

        if (!email) {
            return setMessage("Email required");
        }
        if (!password) {
            return setMessage("Password required");
        }
        if (!cpassword) {
            return setMessage("Please confirm password");
        }
        if (password !== cpassword) {
            return setMessage("Passwords do not match");
        }
        if (!email || !password || !cpassword || password != cpassword) {
            return;
        }

        const res = await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName,
                middleName,
                lastName,
                email,
                password,
                admin: isAdmin,
            }),
        });

        if (res.ok) {
            router.push("/");
        } else {
            const data = await res.json();
            setMessage(data.message);
        }
    }
    return (
        <>
            <Circle />
            <div className="flex flex-col justify-center items-center pb-14">
                <p className="mt-48 font-bold text-[50px]">Create Account</p>
                <div className="w-[500px]">
                    <input
                        id="firstname"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        id="middlename"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="Middle Name"
                        onChange={(e) => setMiddleName(e.target.value)}
                    />
                    <input
                        id="lastname"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        id="email"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        id="password"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight text-black bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        id="confirmpassword"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight text-black bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setCpassword(e.target.value)}
                    />
                    <input
                        id="isAdmin"
                        className="mt-12 mr-1 w-4 h-4 cursor-pointer accent-[#D21312]"
                        type="checkbox"
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    <label
                        htmlFor="isAdmin"
                        className="text-sm font-medium select-none ms-2 text-heading"
                    >
                        Admin access
                    </label>
                    <button
                        className="py-3 mt-12 w-full text-3xl font-bold text-white rounded-2xl hover:bg-red-800 bg-[#D21312]"
                        type="button"
                        onClick={signUp}
                    >
                        Sign up
                    </button>
                    <div>{message}</div>
                </div>
                <p className="mt-4 text-2xl">
                    <Link href="/">
                        <b>Log in</b>
                    </Link>
                </p>
            </div>
        </>
    );
}
