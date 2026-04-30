import { Skeleton } from "@/components/ui/skeleton"

export function CourseSkeleton() {
  return (
    <div className="flex flex-col h-full bg-card rounded-[2.5rem] overflow-hidden border border-border/50">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="p-8 space-y-6 flex-grow flex flex-col">
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <div className="space-y-1">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-12 rounded-lg" />
        </div>
        <div className="pt-6 border-t border-primary/5 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-14 w-14 rounded-2xl" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl mt-6" />
      </div>
    </div>
  )
}
