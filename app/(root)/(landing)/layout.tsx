import Header from "./../components/header";
import Footer from "./../components/footer";
import { VisitTracker } from "./_components/visit-tracker";
// import ChatPopup from "./../components/chat-popup";
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <VisitTracker />
      {/* Header */}
      <Header />

      {children}
      {/* Footer */}
      {/* <ChatPopup /> Hide first bcs api bug */}
      <Footer />
    </div>
  );
}
