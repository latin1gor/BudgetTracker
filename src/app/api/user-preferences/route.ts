import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET (request: Request) {
    const user = await currentUser()

    if (!user){
        redirect('/sign-in')
    }

    let userPreferences = await prisma.userPreferences.findUnique({where: { userId: user.id }})

    if (!userPreferences){
        userPreferences = await prisma.userPreferences.create({data: {
            userId: user.id,
            currency: "UAH"
        }})
    }

    revalidatePath("/")
    return Response.json(userPreferences)
}