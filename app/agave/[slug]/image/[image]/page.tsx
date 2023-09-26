import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { slug: string; image: string };
  searchParams: {};
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    openGraph: {
      title: "agave",
      description: "test",
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
