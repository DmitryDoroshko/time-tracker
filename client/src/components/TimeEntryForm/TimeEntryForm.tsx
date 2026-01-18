"use client";

import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Entry } from "@/types/entry";
import type { FormErrors, FormState } from "@/types/form.ts";

const projects = [
  "Viso Internal",
  "Client A",
  "Client B",
  "Personal Development",
];

const MINIMUM_HOURS_IN_SINGLE_DAY = 0;
const MAXIMUM_HOURS_IN_SINGLE_DAY = 24;
const HOURS_INCREMENT = 0.25;

export function TimeEntryForm(
  {
    entries,
    onSave,
  }: {
    entries: Entry[];
    onSave: (data: FormState) => Promise<void>;
  }) {
  const [form, setForm] = useState<FormState>({
    date: new Date().toISOString(),
    project: "",
    hours: 0,
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function getDailyTotal(dateISO: string) {
    const dateKey = dateISO.slice(0, 10);

    return entries
      .filter((e) => e.date.slice(0, 10) === dateKey)
      .reduce((sum, e) => sum + e.hours, 0);
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    const dailyTotal = getDailyTotal(form.date);

    if (!form.project) {
      nextErrors.project = "Project is required";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required";
    }

    if (form.hours <= MINIMUM_HOURS_IN_SINGLE_DAY) {
      nextErrors.hours = "Hours must be greater than 0";
    }

    if (form.hours > MAXIMUM_HOURS_IN_SINGLE_DAY) {
      nextErrors.hours = "Cannot log more than 24 hours at once";
    }

    if (dailyTotal + form.hours > MAXIMUM_HOURS_IN_SINGLE_DAY) {
      nextErrors.dailyTotal =
        `Daily limit exceeded: ${dailyTotal}h already logged`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSave(form);

      setForm({
        date: new Date().toISOString(),
        project: "",
        hours: 0,
        description: "",
      });
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  }

  const dailyTotal = getDailyTotal(form.date);
  const remaining = Math.max(MINIMUM_HOURS_IN_SINGLE_DAY, MAXIMUM_HOURS_IN_SINGLE_DAY - dailyTotal);

  return (
    <Stack spacing={2}>
      <TextField
        type="date"
        label="Date"
        value={form.date.slice(0, 10)}
        slotProps={{
          inputLabel: {
            shrink: true,
          }
        }}
        onChange={(e) =>
          setForm({
            ...form,
            date: new Date(e.target.value).toISOString(),
          })
        }
      />

      <Typography variant="body2" color="text.secondary">
        Logged: {dailyTotal}h / 24h — Remaining: {remaining}h
      </Typography>

      {errors.dailyTotal && (
        <Typography color="error" variant="body2">
          {errors.dailyTotal}
        </Typography>
      )}

      <TextField
        select
        label="Project"
        value={form.project}
        error={!!errors.project}
        helperText={errors.project}
        onChange={(e) =>
          setForm({ ...form, project: e.target.value })
        }
      >
        {projects.map((p) => (
          <MenuItem key={p} value={p}>
            {p}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Hours"
        type="number"
        value={form.hours || ""}
        error={!!errors.hours}
        helperText={errors.hours}
        slotProps={{
          htmlInput: {
            min: MINIMUM_HOURS_IN_SINGLE_DAY,
            max: MAXIMUM_HOURS_IN_SINGLE_DAY,
            step: HOURS_INCREMENT,
          },
        }}
        onChange={(e) =>
          setForm({
            ...form,
            hours: Number(e.target.value),
          })
        }
      />

      <TextField
        label="Work description"
        multiline
        rows={3}
        value={form.description}
        error={!!errors.description}
        helperText={errors.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={submitting}
      >
        Save
      </Button>
    </Stack>
  );
}
