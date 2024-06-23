import CurrencyComboBox from "@/components/wizard/currency-combo-box";
import Logo from "@/components/general/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";


const Wizard = async () => {
    const user = await currentUser()

    if (!user) {
        redirect("/sign-in")
    }
    return (
      <div className="container flex max-w-2xl flex-col items-center justify-center gap-4">
        <div>
          <h1 className="text-center text-3xl">
            Welcome,{" "}
            <span className="ml-2 font-bold text-yellow-500">
              {user.firstName}! 👋
            </span>
          </h1>
          <h2 className="mt-4 text-center text-base text-muted-foreground">
            Let &apos;s get started by setting your currency
          </h2>
          <h3 className="mt-2 text-center text-sm text-muted-foreground">
            {" "}
            You can change this settings in any time.
          </h3>
        </div>
        <Separator />
        <Card className="w-full">
            <CardHeader><CardTitle>Currency</CardTitle>
            <CardDescription>Set your default currency for transactions</CardDescription></CardHeader>
            <CardContent> <CurrencyComboBox /> </CardContent>
        </Card>
        <Separator />
        <Button className="w-full" asChild><Link href={"/"}>I&apos;m done! Take me to dashboard</Link></Button>
        <div className="mt-8">
            <Logo />
        </div>
      </div>
    );
}

export default Wizard;