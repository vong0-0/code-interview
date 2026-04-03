import { SiteHeader } from "@/components/common/site-header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader>
        <div className="max-w-7xl w-full mx-auto">
          <SiteHeader.Start>
            <h1>test</h1>
          </SiteHeader.Start>
        </div>
      </SiteHeader>
      {children}
    </>
  );
}
