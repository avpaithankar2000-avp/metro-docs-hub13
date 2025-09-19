// Supabase Edge Function: documents
// Endpoints:
// - POST /upload (multipart/form-data: file, title) -> creates document, parses text, summarizes via Gemini
// - GET /pending -> list pending documents (admin only)
// - POST /:id/approve { userIds: string[] } -> set status=approved and create assignments
// - GET /approved/:userId -> list approved docs for employee

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

const supabase = (await import('https://esm.sh/@supabase/supabase-js@2.45.4')).createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  { global: { headers: { Authorization: '' } } }
)

async function getAuthUser(req: Request) {
  // First, try normal Supabase JWT
  const authHeader = req.headers.get('Authorization')
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const { data, error } = await supabase.auth.getUser(token)
    if (!error) return data.user
  }
  // Fallback for local mock auth: accept x-mock-role and x-mock-user-id
  const mockRole = req.headers.get('x-mock-role')
  const mockUserId = req.headers.get('x-mock-user-id')
  if (mockRole && mockUserId) {
    return {
      id: mockUserId,
      user_metadata: { role: mockRole }
    } as any
  }
  return null
}

function isAdmin(user: any): boolean {
  const role = (user?.user_metadata as any)?.role
  return role === 'admin'
}

async function parsePdfToText(fileBytes: Uint8Array): Promise<string> {
  // Lightweight parsing fallback: rely on Gemini if pdf.js fails
  try {
    const pdfjs = await import('npm:pdfjs-dist@4.6.82')
    const pdfjsWorkerSrc = await import('npm:pdfjs-dist@4.6.82/build/pdf.worker.min.mjs')
    // @ts-ignore
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc
    // @ts-ignore
    const loadingTask = pdfjs.getDocument({ data: fileBytes })
    const pdf = await loadingTask.promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((it: any) => it.str).join(' ') + '\n'
    }
    return text.trim()
  } catch {
    return ''
  }
}

async function summarizeWithGemini(text: string): Promise<string> {
  if (!GEMINI_API_KEY) return ''
  const prompt = `Summarize this document and extract: date of issue, who issued it, to whom it is addressed, important details, important names, and any critical information. Return a concise, structured summary.\n\nDocument Text:\n${text.slice(0, 120_000)}`
  const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    })
  })
  if (!resp.ok) return ''
  const data = await resp.json()
  const textOut: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return textOut.trim()
}

async function handleUpload(req: Request, user: any): Promise<Response> {
  if (!isAdmin(user)) return new Response('Forbidden', { status: 403 })
  const form = await req.formData()
  const file = form.get('file') as File | null
  const title = (form.get('title') as string) || (file?.name ?? 'Untitled')
  if (!file) return new Response(JSON.stringify({ error: 'file required' }), { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)

  // Store in Supabase Storage
  const storagePath = `${crypto.randomUUID()}-${file.name}`
  const { data: uploadRes, error: uploadErr } = await supabase.storage
    .from('documents')
    .upload(storagePath, bytes, {
      contentType: file.type || 'application/pdf',
      upsert: false
    })
  if (uploadErr) return new Response(JSON.stringify({ error: uploadErr.message }), { status: 500 })
  const { data: publicUrl } = supabase.storage.from('documents').getPublicUrl(uploadRes.path)

  // Insert document row
  const { data: doc, error: insertErr } = await supabase
    .from('documents')
    .insert({ title, file_url: publicUrl.publicUrl, status: 'pending', created_by: user.id })
    .select('*')
    .single()
  if (insertErr || !doc) return new Response(JSON.stringify({ error: insertErr?.message }), { status: 500 })

  // Parse PDF text
  let parsedText = await parsePdfToText(bytes)
  if (!parsedText) {
    // As a fallback, keep empty parsed_text (Gemini will still summarize best-effort)
    parsedText = ''
  }
  await supabase.from('documents').update({ parsed_text: parsedText }).eq('id', doc.id)

  // Summarize
  const summary = await summarizeWithGemini(parsedText || `The document is at ${publicUrl.publicUrl}. Summarize based on its content.`)
  await supabase.from('documents').update({ summary }).eq('id', doc.id)

  return Response.json({ id: doc.id, title, file_url: publicUrl.publicUrl, status: 'pending' })
}

async function handlePending(req: Request, user: any): Promise<Response> {
  if (!isAdmin(user)) return new Response('Forbidden', { status: 403 })
  const { data, error } = await supabase
    .from('documents')
    .select('id,title,file_url,summary,status,created_at')
    .in('status', ['pending'])
    .order('created_at', { ascending: false })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return Response.json(data)
}

async function handleApprove(req: Request, user: any, id: string): Promise<Response> {
  if (!isAdmin(user)) return new Response('Forbidden', { status: 403 })
  const body = await req.json().catch(() => ({})) as { userIds?: string[] }
  const userIds = body.userIds ?? []

  const { error: upErr } = await supabase.from('documents').update({ status: 'approved' }).eq('id', id)
  if (upErr) return new Response(JSON.stringify({ error: upErr.message }), { status: 500 })

  if (userIds.length > 0) {
    const rows = userIds.map((uid) => ({ doc_id: id, user_id: uid }))
    const { error: insErr } = await supabase.from('document_assignments').insert(rows)
    if (insErr) return new Response(JSON.stringify({ error: insErr.message }), { status: 500 })
  }
  return Response.json({ ok: true })
}

async function handleApprovedForUser(_req: Request, _user: any, userId: string): Promise<Response> {
  // Employees fetch their approved, assigned docs. RLS ensures security.
  const { data, error } = await supabase
    .from('documents')
    .select('id,title,file_url,summary,status,created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  // Filter via assignments if RLS not restrictive enough for admin calls
  const { data: assigns } = await supabase
    .from('document_assignments')
    .select('doc_id,user_id')
    .eq('user_id', userId)
  const allowed = new Set((assigns ?? []).map((a: any) => a.doc_id))
  const filtered = (data ?? []).filter((d: any) => allowed.has(d.id))
  return Response.json(filtered)
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const pathname = url.pathname.replace(/^\/functions\/v1\/documents/, '') || '/'

  // Auth: forward bearer token to supabase client for RLS
  const authHeader = req.headers.get('Authorization')
  ;(supabase as any).rest.headers = { ...(supabase as any).rest.headers, Authorization: authHeader ?? '' }

  const user = await getAuthUser(req)

  if (req.method === 'POST' && pathname === '/upload') return handleUpload(req, user)
  if (req.method === 'GET' && pathname === '/pending') return handlePending(req, user)
  const approveMatch = pathname.match(/^\/(.*)\/approve$/)
  if (req.method === 'POST' && approveMatch) return handleApprove(req, user, approveMatch[1])
  const approvedForUser = pathname.match(/^\/approved\/(.*)$/)
  if (req.method === 'GET' && approvedForUser) return handleApprovedForUser(req, user, approvedForUser[1])

  return new Response('Not Found', { status: 404 })
})


