import Image from "next/image";
import localImage from "@/public/noimage.jpg";
export default function NoImage() {
  return <Image src={localImage} width={100} height={75} alt="no image" />;
}
