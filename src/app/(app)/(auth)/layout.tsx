export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-hopper-beige-light/20 py-12 px-4">
      {children}
    </div>
  );
}
