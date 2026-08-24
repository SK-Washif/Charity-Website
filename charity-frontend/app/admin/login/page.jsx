import { SignIn } from "@clerk/nextjs";
import Stamp from "@/components/ui/Stamp";


export default function AdminLoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center text-center">
        <Stamp size={56} rotate={-6} lines={["ঐক্য", "তান"]} />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
          অ্যাডমিন লগইন
        </h1>
        <p className="mt-1 font-body text-sm text-ink-muted">
          ঐক্যতান ফাউন্ডেশন কনটেন্ট ম্যানেজমেন্ট
        </p>
      </div>

      <SignIn
        routing="hash"
        signUpUrl={null}
        fallbackRedirectUrl="/admin/dashboard"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border border-line rounded-sm bg-paper w-full",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            footerAction: "hidden",
            formButtonPrimary:
              "btn-marigold w-full justify-center normal-case",
          },
        }}
      />
    </div>
  );
}
