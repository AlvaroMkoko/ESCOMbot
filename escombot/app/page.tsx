import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 flex overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
