import { createClient } from '@supabase/supabase-js'
import { UserRole } from '../types'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function makeAdmin(email: string) {
  // Get user by email
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (fetchError) {
    console.error('Error fetching user:', fetchError)
    process.exit(1)
  }

  if (!users) {
    console.error('User not found')
    process.exit(1)
  }

  // Update user role to admin
  const { error: updateError } = await supabase
    .from('users')
    .update({ role: UserRole.ADMIN })
    .eq('email', email)

  if (updateError) {
    console.error('Error updating user:', updateError)
    process.exit(1)
  }

  console.log(`Successfully updated user ${email} to admin role`)
}

// Get email from command line argument
const email = process.argv[2]
if (!email) {
  console.error('Please provide an email address')
  console.error('Usage: ts-node make-admin.ts <email>')
  process.exit(1)
}

makeAdmin(email).catch(console.error)
