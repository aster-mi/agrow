import Image from "next/image";
import localImage from "@/public/dotNoImage.png";
export default function NoImage() {
  return (
    <Image
      src={localImage}
      priority={true}
      width={500}
      height={500}
      alt="no image"
      className="w-full h-full object-cover bg-gray-300"
    />
  );
}
