"use client";

import { Stack, Typography } from "@mui/material";
import { Entry } from "@/types/entry";

export function EntryHistory({ entries }: { entries: Entry[] }) {
  const grouped = entries.reduce<Record<string, Entry[]>>(
    (acc, e) => {
      const date = e.date.slice(0, 10);
      acc[date] = acc[date] || [];
      acc[date].push(e);
      return acc;
    },
    {}
  );

  const grandTotal = entries.reduce(
    (sum, e) => sum + e.hours,
    0
  );

  return (
    <Stack spacing={3}>
      {Object.entries(grouped).map(([date, list]) => {
        const dailyTotal = list.reduce(
          (sum, e) => sum + e.hours,
          0
        );

        const exceedsLimit = dailyTotal > 24;

        return (
          <div key={date}>
            <Typography
              variant="h6"
              color={exceedsLimit ? "error" : "text.primary"}
            >
              {date} — {dailyTotal}h
            </Typography>

            {exceedsLimit && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mb: 1 }}
              >
                ⚠️ Daily limit exceeded (max 24 hours per day)
              </Typography>
            )}

            {list.map((e) => (
              <Typography key={e.id}>
                {e.project} | {e.hours}h | {e.description}
              </Typography>
            ))}
          </div>
        );
      })}

      <Typography variant="h5">
        Grand Total: {grandTotal}h
      </Typography>
    </Stack>
  );
}
