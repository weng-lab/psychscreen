import type { Metadata } from "next";
import "../src/index.css";
import "../src/App.css";
// import "@weng-lab/psychscreen-ui-components/src/App.css";
import MuiXLicense from "../src/web/MuiXLicense";

export const metadata: Metadata = {
  title: "PsychSCREEN",
  description: "PsychSCREEN",
  icons: {
    icon: "/brain.png",
    apple: "/brain.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MuiXLicense />
      </body>
    </html>
  );
}
