'use client'
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Route Error:', error)
  }, [error])
 
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center justify-center gap-4 text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Something went wrong!</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          An unexpected error occurred while trying to process your request. We've taken note of this issue.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button 
            onClick={() => reset()} 
            className="rounded-lg w-full sm:w-auto px-8"
          >
            Try again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="rounded-lg w-full sm:w-auto px-8"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
