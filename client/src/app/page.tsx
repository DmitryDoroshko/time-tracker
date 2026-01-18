"use client";

import { useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";
import { fetchEntries, createEntry } from "@/api/entries.ts";
import { Entry } from "@/types/entry.ts";
import { TimeEntryForm } from "@/components/TimeEntryForm/TimeEntryForm";
import { EntryHistory } from "@/components/EntryHistory/EntryHistory";
import { FormState } from "@/types/form.ts";

export default function Page() {
  const [entries, setEntries] = useState<Entry[]>([]);

  const loadEntries = async () => {
    setEntries(await fetchEntries());
  };

  const handleSave = async (data: FormState) => {
    await createEntry(data);
    loadEntries();
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return (
    <Container maxWidth="md">
      <Stack spacing={4} mt={4}>
        <TimeEntryForm
          entries={entries}
          onSave={handleSave}
        />
        <EntryHistory entries={entries} />
      </Stack>
    </Container>
  );
}
