import { Metadata, ResolvingMetadata } from "next";

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

export default function Page() {
  return <></>;
}
