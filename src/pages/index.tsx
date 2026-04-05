export default function Home() {
    return (
        <>
            <svg>
                <circle></circle>
            </svg>
            <div className="flex flex-col justify-center items-center">
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
                        type="text"
                        placeholder="Password"
                    />
                </div>
            </div>
        </>
    );
}
