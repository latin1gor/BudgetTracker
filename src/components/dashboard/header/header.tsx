import { User } from "@clerk/backend";
import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "@/components/dashboard/header/transaction/create-transaction-dialog";
import Overview from "@/components/dashboard/overview/overview";

interface IProps {
  user: User;
}

const Header = ({ user }: IProps) => {
  return (
    <>
      <div className={"h-full bg-background"}>
        <div className={"border-b bg-card"}>
          <div
            className={
              "container flex flex-wrap items-center justify-between gap-6 py-8"
            }
          >
            <p className={"text-3xl font-bold"}> Hello {user.firstName}! 👋 </p>

            <div className={"flex items-center gap-3"}>
              <CreateTransactionDialog
                trigger={
                  <Button
                    variant={"outline"}
                    className={
                      "border-emerald-500 bg-emerald-950 hover:bg-emerald-700 text-white hover:text-white"
                    }
                  >
                    New income 😁
                  </Button>
                }
                type={"income"}
              />
              <CreateTransactionDialog
                trigger={
                  <Button
                    variant={"outline"}
                    className={
                      "border-rose-500 bg-rose-950 hover:bg-rose-700 text-white hover:text-white"
                    }
                  >
                    New expense 🤩
                  </Button>
                }
                type={"expense"}
              />
            </div>
          </div>
        </div>
        <Overview userPreferences={"1"} />
      </div>
    </>
  );
};

export default Header;
