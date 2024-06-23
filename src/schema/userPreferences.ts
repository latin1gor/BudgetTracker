import {z} from "zod";
import {currencies} from "@/lib/currencies";


export const UpdateUserCurrencySchema = z.object({
    currency: z.custom((value) => {
        const found = currencies.some(с => с.value === value)
        if (!found) {
            throw new Error(`invalid currency ${value}`)
        }
        return value
    })
})