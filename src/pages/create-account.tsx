import Circle from "@/components/Circle";

export default function CreateAccount() {
    return (
        <>
            <Circle />
            <div className="flex flex-col justify-center items-center">
                <p className="mt-48 font-bold text-[50px]">Create Account</p>
                <div className="w-[500px]">
                    <input
                        id="firstname"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="First Name"
                    />
                    <input
                        id="middlename"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="Middle Name"
                    />
                    <input
                        id="lastname"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="Last Name"
                    />
                    <input
                        id="email"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="Email"
                    />

                    <input
                        id="password"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight text-black bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="Password"
                    />
                    <input
                        id="confirmpassword"
                        className="py-1 px-1 mt-12 mr-3 w-full leading-tight text-black bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
                        type="text"
                        placeholder="Confirm Password"
                    />

                    <button
                        className="py-3 mt-12 w-full text-3xl font-bold text-white rounded-2xl hover:bg-red-800 bg-[#D21312]"
                        type="button"
                    >
                        Sign up
                    </button>
                </div>
                <p className="mt-4 text-2xl">
                    Don't have an account?{" "}
                    <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a">
                        <b>Sign up</b>
                    </a>
                </p>
            </div>
        </>
    );
}
