import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" className={`h-full antialiased`}>
            <Head />
            <body className="flex flex-col min-h-full">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
