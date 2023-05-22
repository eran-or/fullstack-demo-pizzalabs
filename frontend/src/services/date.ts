export const getFormatedDateTime = (d: Date)=>{
  
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const options:Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: localTimezone,
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(d))
}