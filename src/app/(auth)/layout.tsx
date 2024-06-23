import Logo from "@/components/general/logo";
import { PropsWithChildren } from "react";

const Layout = ({children}: PropsWithChildren) => {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center">
        <Logo/>
        <div className="mt-12">{children}</div>
      </div>
    );
}

export default Layout