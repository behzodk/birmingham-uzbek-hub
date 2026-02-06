export const buildOutlookCalendarUrl = ({
  title,
  startIso,
  endIso,
  location = "",
  description = "",
}: {
  title: string;
  startIso: string;
  endIso: string;
  location?: string;
  description?: string;
}) => {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    startdt: startIso,
    enddt: endIso,
    subject: title,
    body: description,
    location,
    allday: "false",
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};
