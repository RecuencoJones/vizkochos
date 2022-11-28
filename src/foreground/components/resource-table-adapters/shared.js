import { DateTime } from 'luxon';

export function formatAge(timestamp, locale) {
  const createdDate = DateTime.fromMillis(Date.parse(timestamp));

  return createdDate.toRelative({ style: 'short', locale });
}
