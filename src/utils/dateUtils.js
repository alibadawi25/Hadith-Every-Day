export function calculateHadithIndex(hadiths, dayOffset) {
  const hadithsStartDate = new Date("2024-12-31");
  const today = new Date();
  const offsetDate = new Date(today);
  offsetDate.setDate(today.getDate() + dayOffset);

  // Days since start date
  const daySinceStart = Math.floor(
    (offsetDate - hadithsStartDate) / (1000 * 60 * 60 * 24)
  );

  // Safely wrap around hadiths
  const index =
    hadiths.length > 0
      ? ((daySinceStart % hadiths.length) + hadiths.length) % hadiths.length
      : 0;

  return { index, offsetDate };
}

export function formatDates(offsetDate) {
  const gregorianString = offsetDate.toLocaleDateString("en-GB");

  const hijriDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(offsetDate);

  return { gregorianString, hijriDate };
}
