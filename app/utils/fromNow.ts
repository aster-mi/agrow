import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

const fromNow = (dateString: string | undefined) => {
  if (!dateString) return;
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ja });
};

export default fromNow;
