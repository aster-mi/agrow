import Image from "next/image";
import image from "@/public/dotAgave.png";
export default function LoadingAnime() {
  return (
    <div className="animate-bounce h-20 w-20">
      <Image src={image} alt="loading" width={200} height={200} />
    </div>
  );
}
