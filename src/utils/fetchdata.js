import { supabase } from './supabase'
import { getIndiaDate } from './intime'

export async function fetchLeaderboard(limit = 25) {
  const today = getIndiaDate()

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('created_at', today)
    .order('pushups', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Fetch error:', error.message)
    return []
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    reps: p.pushups,
    avatar: p.avatar_url || 'https://i.pravatar.cc/100?img=1',
    instagram: p.instagram || 'https://www.instagram.com',
  }))
}
