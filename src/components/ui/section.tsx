import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}

/**
 * Standard Section component for consistent spacing and layout across the platform.
 * Handles vertical padding, container centering, and internal vertical gaps.
 */
export function Section({ children, className, containerClassName, id }: SectionProps) {
  return (
    <section 
      id={id}
      className={cn("py-20 lg:py-32 relative overflow-hidden bg-background", className)}
    >
      <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24 relative z-10", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
