import Image from "next/image";

export default function NavBar() {
    return (
        <div className="flex sticky top-0 justify-start items-center h-20 bg-white shadow-md shadow-gray-200 border-b-gray-200">
            <Image
                src="/images/appLogo.png"
                width={83}
                height={50}
                alt={"logo"}
                className="mt-5 mb-5 ml-6 h-auto w-[6vw]"
            />
            <p className="font-bold text-[2rem]">Progress</p>
        </div>
    );
}
