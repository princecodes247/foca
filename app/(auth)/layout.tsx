import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Head from "next/head";
// import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Foca | Gallery</title>
      </Head>

      <Toaster closeButton richColors theme={"system"} />

      <div>{children}</div>
    </>
  );
}
