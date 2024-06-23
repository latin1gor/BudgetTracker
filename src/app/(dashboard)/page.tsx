import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/dashboard/header/header";

const Page = async () => {
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }

  const userPreferences = await prisma.userPreferences.findUnique({where: {
    userId: user.id
    }})

  if (!userPreferences) {
    redirect("/wizard")
  }
  return <Header user={user} />

}

export default Page