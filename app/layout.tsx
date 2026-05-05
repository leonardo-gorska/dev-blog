import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import ParticleField from "@/components/ParticleField";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Blog — Leonardo Gorska",
  description: "Blog técnico sobre engenharia de software, arquiteturas cloud-native e alta performance.",
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
        <Provider>
          {children}
          <SiteFooter />
        </Provider>
      </body>
    </html>
  );
}

