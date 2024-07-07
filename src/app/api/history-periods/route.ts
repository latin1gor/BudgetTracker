import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const periods = await getHistoryPeriods(user.id);

  return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

const getHistoryPeriods = async (userId: string) => {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "asc",
    },
  });

  const years = result.map((i) => i.year);
  if (years.length === 0) {
    // Return the current year
    return [new Date().getFullYear()];
  }

  return years;
};
