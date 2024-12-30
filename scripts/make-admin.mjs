import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function makeAdmin(email) {
  console.log('Checking for existing user...')
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
    console.log('User not found in database, checking auth system...')
    // Get auth user first
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers()
    
    const authUser = authUsers.find(u => u.email === email)
    
    if (authError) {
      console.error('Error checking auth system:', authError)
      process.exit(1)
    }

    if (!authUser) {
      console.error('User not found in auth system')
      process.exit(1)
    }

    userId = authUser.id
    console.log('Found user in auth system, creating database record...')
    
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
    console.log('Found existing user, updating to admin role...')
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
