import "./globals.css";

export const metadata = {
  title: "ShapeIt — Creative Tools Suite",
  description: "Premium card path animations and grainy shape generation in one beautiful app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
