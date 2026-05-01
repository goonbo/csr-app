export const fmtDate = (iso: string, long = true): string => {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', long
    ? { month: 'long', day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric' });
};
