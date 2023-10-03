const convertDateToSlashFormat = (datetime: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Tokyo",
  };

  const japaneseDateTime = new Intl.DateTimeFormat("ja-JP", options).format(
    new Date(datetime)
  );

  return japaneseDateTime;
};
export default convertDateToSlashFormat;
