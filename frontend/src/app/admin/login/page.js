import Logo from "@/components/ui/Logo";
import LoginForm from "@/components/forms/LoginForm";

export const metadata = { title: "دخول المدير | DMT" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center gap-6 bg-pink-50 px-4 py-10">
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <LoginForm />
      </div>
    </main>
  );
}
