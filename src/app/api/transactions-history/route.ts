import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OverviewQuerySchema } from "@/schema/overview";
import prisma from "@/lib/prisma";
import { getFormatterForCurrency } from "@/lib/helpers";

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 });
  }

  const transactions = await getTransactionsHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  );
  console.log(transactions);
  return Response.json(transactions);
}

export type GetTransactionHistoryReturnType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;
async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const userPreferences = await prisma.userPreferences.findUnique({
    where: { userId },
  });
  if (!userPreferences) {
    throw new Error("user settings not found");
  }

  const formatter = getFormatterForCurrency(userPreferences.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  console.log(transactions);
  console.log(transactions);
  return transactions.map((t) => ({
    ...t,
    formattedAmount: formatter.format(t.amount),
  }));
}
