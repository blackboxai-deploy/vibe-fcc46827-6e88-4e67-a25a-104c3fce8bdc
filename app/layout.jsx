export const metadata = {
  title: "Next.js Todo List",
  description: "A minimal todo list app built with Next.js",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          <h1 className="title">Todo List</h1>
          {children}
          <footer className="footer">Built with Next.js</footer>
        </main>
      </body>
    </html>
  );
}
