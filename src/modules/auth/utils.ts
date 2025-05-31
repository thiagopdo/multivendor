import { cookies as getCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}

export async function generateAuthCookie({ prefix, value }: Props) {
  const cookies = await getCookies();

  cookies.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true,
    path: "/",
  });
}
