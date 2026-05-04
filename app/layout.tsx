import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import ParticleField from "@/components/ParticleField";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Blog",
  description: "Advanced Developer Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ParticleField />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
