import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Webhook moved. Use Express server.' }, { status: 410 })
}
