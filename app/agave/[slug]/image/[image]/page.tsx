import { AgaveType } from "@/app/type/AgaveType";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { slug: string; image: string };
  searchParams: {};
};

interface Detail {
  id: 256;
  url: string;
  agaveId: number;
  shotDate: string;
  agave: AgaveType;
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/agave/${params.slug}/image/${params.image}`
  );
  const detail = (await res.json()) as Detail;
  const shotDate = new Date(detail.shotDate);
  const formatShotDate = `${shotDate.getFullYear()}/${
    shotDate.getMonth() + 1
  }/${shotDate.getDate()}`;
  return {
    openGraph: {
      title: `${detail.agave.name + " 撮影: " + formatShotDate}`,
      description: `${detail.agave.description}`,
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/agave/${params.slug}`,
      siteName: "Agrow",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/agave/${params.image}.jpg`,
        },
      ],
      locale: "ja_JP",
      type: "website",
    },
  };
}

export default function Page({ params, searchParams }: Props) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/agave/${params.image}.jpg`}
        alt="pup"
        className="mt-4"
        width={500}
        height={500}
      />
      <Link
        href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/agave/${params.slug}`}
        className="rounded-xl px-1 ml-2 bg-white text-gray-700 m-4 p-2"
      >
        株を見に行く
      </Link>
    </div>
  );
}
