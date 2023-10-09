import Image from "next/image";
import image from "@/public/dotAgave.png";
export default function LoadingAnime() {
  return (
    <div
      className="absolute left-0 top-0 flex justify-center items-center backdrop-blur w-full h-full"
      style={{ zIndex: 1200 }}
      aria-label="読み込み中"
    >
      <div className="animate-bounce h-20 w-20">
        <Image src={image} alt="loading" width={200} height={200} />
      </div>
    </div>
  );
}
