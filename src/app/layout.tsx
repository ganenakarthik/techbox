export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#09090b", color: "#ffffff", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
