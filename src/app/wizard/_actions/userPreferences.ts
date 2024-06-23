"use server"

import {UpdateUserCurrencySchema} from "@/schema/userPreferences";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";

export default async function updateUserCurrency(currency: string){
    const parsedBody = UpdateUserCurrencySchema.safeParse({currency})

    if (!parsedBody.success) {
        throw parsedBody.error
    }

    const user = await currentUser()
    if (!user) redirect("/sign-in")

    return prisma.userPreferences.update({where: {userId: user.id}, data: {currency}})


}