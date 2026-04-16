export default function Avatar({ name }: { name: string }) {
    const letter = name.charAt(0).toUpperCase();

    return (
        <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#D21312" />
            <text
                x="20"
                y="20"
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="18"
                fontWeight="bold"
            >
                {letter}
            </text>
        </svg>
    );
}
