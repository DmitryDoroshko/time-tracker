import { prisma } from "../prisma";

export class EntriesService {
  static getTotalHoursForDate= async (date: Date) =>  {
    const result = await prisma.timeEntry.aggregate({
      where: { date },
      _sum: { hours: true },
    });

    return result._sum.hours ?? 0;
  }

  static createEntry = async (data: {
    date: Date;
    project: string;
    hours: number;
    description: string;
  }) => {
    const total = await this.getTotalHoursForDate(data.date);

    if (total + data.hours > 24) {
      throw new Error("Total hours per day cannot exceed 24");
    }

    return prisma.timeEntry.create({ data });
  }

  static getEntries = async () =>  {
    return prisma.timeEntry.findMany({
      orderBy: { date: "desc" },
    });
  }
}
