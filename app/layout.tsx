import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { EffectsLayer } from "@/components/EffectsLayer";

export const metadata: Metadata = {
  title: "L'Eclair de Calais",
  description: "Patisserie and boulangerie in Calais, France.",
  icons: {
    icon: "https://xtlchcjaksrnijakmnfv.supabase.co/storage/v1/object/public/media/favicon.png"
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <EffectsLayer />
        {children}
      </body>
    </html>
  );
}
