import Image from "next/image";
import localImage from "@/public/dotAgrow.png";
export default function DummyImage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Image src={localImage} width={500} alt="agave" className="rounded-xl" />
    </div>
  );
}
