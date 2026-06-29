import "./globals.css";

export const metadata = {
  title: "Garage Remote",
  description: "Telecommande garage via Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
