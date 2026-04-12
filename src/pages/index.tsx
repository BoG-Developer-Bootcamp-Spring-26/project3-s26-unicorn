import Circle from "@/components/Circle";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <Circle />
            <div className="flex flex-col justify-center items-center pb-14">
                <p className="mt-48 font-bold text-[50px]">Login</p>
                <div className="w-[500px]">
                    <input
                        id="email"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="Email"
                    />
                    <input
                        id="password"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight text-black bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="password"
                        placeholder="Password"
                    />
                    <button
                        className="py-3 mt-12 w-full text-3xl font-bold text-white rounded-2xl hover:bg-red-800 bg-[#D21312]"
                        type="button"
                    >
                        Log in
                    </button>
                </div>
                <p className="mt-4 text-2xl">
                    Don't have an account?{" "}
                    <Link href="/create-account">
                        <b>Sign up</b>
                    </Link>
                </p>
            </div>
        </>
    );
}
