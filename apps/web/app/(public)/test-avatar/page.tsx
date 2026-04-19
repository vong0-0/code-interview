"use client";

import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarBadge } from "@/components/ui/avatar";

export default function TestAvatarPage() {
  const users = [
    { name: "John Doe", fallback: "JD", status: "online" },
    { name: "Alice Smith", fallback: "AS", status: "online" },
    { name: "Bob Johnson", fallback: "BJ", status: "offline" },
    { name: "Carol White", fallback: "CW", status: "online" },
    { name: "David Brown", fallback: "DB", status: "busy" },
  ];

  return (
    <div className="p-10 space-y-12 bg-zinc-950 min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avatar Group Test</h1>
        <p className="text-muted-foreground mt-2">Testing the new reusable and flexible AvatarGroup component.</p>
      </div>

      {/* Test Case 1: Images */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">1. With Images (Stacking)</h2>
        <div className="p-6 rounded-xl border border-border bg-card/50">
          <AvatarGroup max={4}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/leerob.png" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/evilrabbit.png" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/rauchg.png" />
              <AvatarFallback>GR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>+1</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </div>
      </section>

      {/* Test Case 2: Fallbacks & Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">2. Fallbacks & Status Badges</h2>
        <div className="p-6 rounded-xl border border-border bg-card/50">
          <AvatarGroup max={3}>
            {users.map((u) => (
              <Avatar key={u.name}>
                <AvatarFallback>{u.fallback}</AvatarFallback>
                {u.status === "online" && <AvatarBadge className="bg-green-500" />}
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </section>

      {/* Test Case 3: Different Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">3. Sizes (sm, default, lg)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card/50 space-y-4 text-center">
            <p className="text-sm font-medium">Small (sm)</p>
            <div className="flex justify-center">
              <AvatarGroup max={3} size="sm">
                {users.map((u) => (
                  <Avatar key={u.name}><AvatarFallback>{u.fallback}</AvatarFallback></Avatar>
                ))}
              </AvatarGroup>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-border bg-card/50 space-y-4 text-center">
            <p className="text-sm font-medium">Default</p>
            <div className="flex justify-center">
              <AvatarGroup max={3}>
                {users.map((u) => (
                  <Avatar key={u.name}><AvatarFallback>{u.fallback}</AvatarFallback></Avatar>
                ))}
              </AvatarGroup>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card/50 space-y-4 text-center">
            <p className="text-sm font-medium">Large (lg)</p>
            <div className="flex justify-center">
              <AvatarGroup max={3} size="lg">
                {users.map((u) => (
                  <Avatar key={u.name}><AvatarFallback>{u.fallback}</AvatarFallback></Avatar>
                ))}
              </AvatarGroup>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
