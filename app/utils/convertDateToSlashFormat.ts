const convertDateToSlashFormat = (datetime: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  };

  const date = new Date(datetime);
  const currentYear = new Date().getFullYear();

  const japaneseMonth = new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
  }).format(date);
  const japaneseDay = new Intl.DateTimeFormat("ja-JP", {
    day: "numeric",
  }).format(date);

  if (date.getFullYear() !== currentYear) {
    // 年が現在の年と一致しない場合
    const yearOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
    };
    const japaneseYear = new Intl.DateTimeFormat("ja-JP", yearOptions).format(
      date
    );
    return `${japaneseYear}${japaneseMonth}${japaneseDay}`;
  } else {
    // 今年のデータの場合
    return `${japaneseMonth}${japaneseDay}`;
  }
};

export default convertDateToSlashFormat;
