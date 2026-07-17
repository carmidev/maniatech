import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * Revalidación bajo demanda: el admin llama a este endpoint cada vez que
 * crea/edita/archiva/elimina un producto o cambia stock, para que el
 * catálogo se regenere al instante en vez de esperar el revalidate de 30s.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/catalogo');
  revalidatePath('/');

  return NextResponse.json({ ok: true, revalidated: ['/catalogo', '/'], at: new Date().toISOString() });
}
