import { ModeToggle } from "@/components/mode-taggle";
import { SignIn, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";


export default function Home() {



  return (

   <div>
  <UserButton afterSignOutUrl="/"/>

  <ModeToggle/>
   </div>
  );
}
