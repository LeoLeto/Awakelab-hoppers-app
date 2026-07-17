import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EmailVerificationGuard from "@/components/layout/EmailVerificationGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <EmailVerificationGuard />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
