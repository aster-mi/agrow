import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest,
  { params }: { params: { code: string } }
) {
  try{
    const slug = await getSlug(params.code);
    const path = new URL('/agave/' + slug, request.url);
    return NextResponse.redirect(path);
  } catch(e){
    return NextResponse.redirect( new URL('/', request.url));
  }
}

async function getSlug(code: string){
    const qrCode = await prisma.qrCode.findUniqueOrThrow({
    where: {
      code: code,
    },
    include:{
      agave: {
        select: {
          slug: true
        }
      },
    }
  });
  return qrCode.agave.slug;
}