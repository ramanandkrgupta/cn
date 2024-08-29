export default function ForbiddenLayout({ children }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        {children}
      </div>
    );
  }