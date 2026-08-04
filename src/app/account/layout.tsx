// Example layout.tsx for the account section


export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="account-layout">
      <div className="main-content">
        <main className="content-area">
          {children} {/* The specific page content will be rendered here */}
        </main>
      </div>
    </div>
  );
}
