import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="mt-2 text-[var(--muted)]">That track or page does not exist.</p>
      <Link href="/" className="mt-6 inline-block text-[var(--accent)] underline-offset-4 hover:underline">
        Home
      </Link>
    </main>
  );
}
