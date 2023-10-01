import Image from "next/image";
import localImage from "@/public/noimage.jpg";
export default function NoImage() {
  return <Image src={localImage} width={200} height={200} alt="no image" />;
}
