import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">FinTrack</h1>
      <p className="text-xl mb-8">Personal Expense Management made simple.</p>
      
      <Link 
        href="/login" 
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Get Started
      </Link>
    </main>
  );
}