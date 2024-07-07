import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/dashboard/header/header";
import Overview from "@/components/dashboard/overview/overview";
import History from "@/components/dashboard/history/history";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userPreferences = await prisma.userPreferences.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userPreferences) {
    redirect("/wizard");
  }
  return (
    <div className={"h-full bg-background"}>
      <Header user={user} />
      <Overview userPreferences={userPreferences} />
      <History userPreferences={userPreferences} />
    </div>
  );
};

export default Page;
