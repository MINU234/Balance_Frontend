import { Skeleton } from "@/components/ui/skeleton"

export default function GameLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        
        <Skeleton className="h-2 w-full" />
        
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    </div>
  )
}
