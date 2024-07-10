import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const ManageFooter = () => {
  const { signOut } = useClerk();
  return (
    <div className={"border-t bg-card mt-10"}>
      <div className={"container flex w-full justify-end gap-6 py-8"}>
        <Button
          variant={"destructive"}
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default ManageFooter;
