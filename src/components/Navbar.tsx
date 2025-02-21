import Link from "next/link";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";
import { Button } from "./ui/button";
import { UserIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

async function Navbar() {
  const user = await currentUser();
  if (user) await syncUser();  // get the user and sync it with databasee 
 
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary font-mono tracking-wider">
              Socially
            </Link>
          </div>
          <div className="flex w-full items-center justify-end gap-2" >
            <DesktopNavbar username={user?.username} email={user?.emailAddresses[0]?.emailAddress} />
            {
              user ? (
                <div className="md:hidden" >
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                <Link
                href={`/profile/${
                  user?.username ?? user?.emailAddresses[0].emailAddress.split("@")[0]
                }`}
                >
                      <UserIcon className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="default">Sign In</Button>
                </SignInButton>
              )
            }
            <MobileNavbar />
            
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;