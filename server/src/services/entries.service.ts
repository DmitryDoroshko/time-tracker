import { prisma } from "../prisma";

export async function getTotalHoursForDate(date: Date) {
  const result = await prisma.timeEntry.aggregate({
    where: { date },
    _sum: { hours: true },
  });

  return result._sum.hours ?? 0;
}

export async function createEntry(data: {
  date: Date;
  project: string;
  hours: number;
  description: string;
}) {
  const total = await getTotalHoursForDate(data.date);

  if (total + data.hours > 24) {
    throw new Error("Total hours per day cannot exceed 24");
  }

  return prisma.timeEntry.create({ data });
}

export async function getEntries() {
  return prisma.timeEntry.findMany({
    orderBy: { date: "desc" },
  });
}
