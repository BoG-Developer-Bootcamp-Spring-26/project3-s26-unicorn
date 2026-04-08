export default function TextInput({
    id,
    placeholder,
}: {
    id: string;
    placeholder: string;
}) {
    return (
        <input
            id={id}
            className="py-1 px-1 mt-12 mr-3 w-full leading-tight bg-transparent appearance-none focus:outline-none border-b-[2.5px] border-[#D21312]"
            type="text"
            placeholder={placeholder}
        />
    );
}
