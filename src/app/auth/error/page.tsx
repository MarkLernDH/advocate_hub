import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { errorCodes, type ErrorCode, paths } from '@/lib/navigation'
import Link from 'next/link'

const errorMessages: Record<ErrorCode, string> = {
  [errorCodes.TOO_MANY_REDIRECTS]: 'Too many redirects detected. This might be due to a configuration issue.',
  [errorCodes.NO_PROFILE]: 'No user profile found. Please contact support.',
  [errorCodes.INVALID_ROLE]: 'You do not have permission to access this page.',
  [errorCodes.UNAUTHORIZED]: 'You must be logged in to access this page.'
}

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { code?: ErrorCode }
}) {
  const errorMessage = searchParams.code 
    ? errorMessages[searchParams.code] 
    : 'An error occurred. Please try again.'

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href={paths.auth.login}>Return to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
