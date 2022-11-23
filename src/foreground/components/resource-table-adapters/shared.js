import { DateTime } from 'luxon';

export function formatAge(timestamp) {
  const createdDate = DateTime.fromMillis(Date.parse(timestamp));

  return createdDate.toRelative({ style: 'short' });
}
