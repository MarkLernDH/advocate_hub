import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function makeAdmin(email) {
  // Get user by email
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user:', fetchError)
    process.exit(1)
  }

  let userId

  if (!users || users.length === 0) {
    console.log('User not found, creating new user...')
    // Get auth user first
    const { data: authUser } = await supabase.auth.admin.getUserByEmail(email)
    
    if (!authUser?.user) {
      console.error('User not found in auth system')
      process.exit(1)
    }

    userId = authUser.user.id
    
    // Create user record
    const { error: createError } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email: email,
        role: 'ADMIN',
        points: 0,
        tier: 'BRONZE',
        is_active: true
      }])

    if (createError) {
      console.error('Error creating user:', createError)
      process.exit(1)
    }
    
    console.log('Created new admin user')
  } else {
    userId = users[0].id
    // Update existing user role to admin
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'ADMIN' })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user:', updateError)
      process.exit(1)
    }
    
    console.log('Updated existing user to admin role')
  }

  console.log(`Successfully set ${email} as admin`)
}

// Get email from command line argument
const email = process.argv[2]
if (!email) {
  console.error('Please provide an email address')
  console.error('Usage: node make-admin.mjs <email>')
  process.exit(1)
}

makeAdmin(email).catch(console.error)
