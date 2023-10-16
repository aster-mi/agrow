import Link from "next/link";
import Image from "next/image";
import { UserType } from "../type/UserType";
import buildImageUrl from "../utils/buildImageUrl";

type Props = {
  user?: UserType;
};

const UserView = ({ user }: Props) => {
  return (
    <>
      {user && (
        <Link href={`/user/${user.publicId}`}>
          <div className="flex flex-row w-full overflow-hidden m-1">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-1">
              <Image
                src={buildImageUrl(user.image!)}
                alt="User avatar"
                className="w-full h-full object-cover"
                height={32}
                width={32}
              />
            </div>
            <div>
              <div className="text-gray-400 text-xs">@{user.publicId}</div>
              <div className="text-xs">{user.name}</div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default UserView;
