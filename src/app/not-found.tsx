import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center justify-center gap-4 text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <FileQuestion className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Page Not Found</h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            The page you are looking for doesn't exist or has been moved. Check the URL and try again.
          </p>
        </div>
        <div className="mt-4 w-full sm:w-auto">
          <Link href="/">
            <Button className="w-full sm:w-auto rounded-lg gap-2 px-8">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
