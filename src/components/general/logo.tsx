import { PiggyBank } from "lucide-react";

const Logo = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <PiggyBank className="stroke h-9 w-9 stroke-amber-500 stroke-[1.5] hidden sm:block text-black" />
      <p className="bg-gradient-to-r from-amber-400  to-orange-500 bg-clip-text text-xl sm:text-2xl font-bold tracking-tighter text-transparent">
        Budget Tracker
      </p>
    </a>
  );
};
export default Logo;
