import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginAction, registerAction } from "./actions";
import { LoginExperience } from "./login-experience";

type LoginPageProps = {
  searchParams: Promise<{ loginError?: string; registerError?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const cookieStore = await cookies();

  if (cookieStore.get("zero_user_id")?.value) {
    redirect("/");
  }

  return (
    <LoginExperience
      loginAction={loginAction}
      registerAction={registerAction}
      loginError={Boolean(query.loginError)}
      registerError={Boolean(query.registerError)}
    />
  );
}
