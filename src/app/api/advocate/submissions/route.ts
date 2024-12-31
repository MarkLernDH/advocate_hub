import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const validateSubmission = (data: any) => {
  const { challengeId, content } = data
  
  if (!challengeId) throw new Error('Challenge ID is required')
  if (!content) throw new Error('Submission content is required')
  
  return { challenge_id: challengeId, content }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const validatedData = validateSubmission(json)

    const { data, error } = await supabase
      .from('submissions')
      .insert({
        ...validatedData,
        user_id: session.user.id,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Error',
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        challenge:challenges(title)
      `)
      .eq('user_id', session.user.id)
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
