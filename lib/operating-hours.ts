export function isWithinOperatingHours(date: Date, timezone: string, startHour: number, endHour: number) {
  const parts = new Intl.DateTimeFormat("en-US", {timeZone:timezone,hour:"2-digit",hourCycle:"h23"}).formatToParts(date);
  const hour=Number(parts.find(p=>p.type==="hour")?.value ?? 0);
  return hour>=startHour && hour<endHour;
}
