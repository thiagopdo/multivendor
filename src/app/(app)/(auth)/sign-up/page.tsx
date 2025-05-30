import type { ReactNode } from "react";

import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

interface Props {
  children: ReactNode;
}

export default function SignUpPage(children: Props) {
  return <SignUpView />;
}
