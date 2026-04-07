import { Skeleton } from "@/components/ui/skeleton";

export function AuthActionsSkeleton({
  isLandingPage,
}: {
  isLandingPage?: boolean;
}) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-2 md:gap-4">
        <Skeleton className="h-9 w-16" /> {/* Sign In placeholder */}
        {isLandingPage && (
          <Skeleton className="h-9 w-28" /> /* Get Started placeholder */
        )}
      </div>
      {/* Mobile - Generic placeholder that fits both avatar and hamburger area */}
      <div className="md:hidden">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </>
  );
}
