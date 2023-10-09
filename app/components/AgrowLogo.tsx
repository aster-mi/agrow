import Image from "next/image";
import A from "@/public/dotAgrow.png";
import grow from "@/public/dotGrow.png";
export default function AgrowLogo() {
  return (
    <div className="w-full">
      <div className="flex flex-row m-3">
        <Image src={A} width={500} alt="A" className="w-2/5" />
        <Image src={grow} width={500} alt="grow" className="w-3/5 mt-auto" />
      </div>
    </div>
  );
}
