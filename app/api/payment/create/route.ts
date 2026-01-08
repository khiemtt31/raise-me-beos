export async function POST() {
  return Response.json({ error: 'Route moved. Use Express server.' }, { status: 410 })
}