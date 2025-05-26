import "./globals.css";

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "funroad, Inc",
	description: "Selling is fun",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${dmSans.className} antialiased`}>{children}</body>
		</html>
	);
}
