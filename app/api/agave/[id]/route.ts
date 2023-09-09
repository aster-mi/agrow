import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(await getAgave(Number(params.id)));
}

async function getAgave(id: number){
    const agave = await prisma.agave.findUnique({
    where: {
      id: id,
    },
    include:{
      owner: {
        select: {
          username: true
        }
      },
      tags: true,
      agaveImages: true,
      children: true,
      qrCode: true,
      parent: true,
    }
  });
  return agave;
}
