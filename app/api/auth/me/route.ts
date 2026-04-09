import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type Role = "ADMIN" | "MEMBER";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, role: null });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role: Role = profile?.role === "ADMIN" ? "ADMIN" : "MEMBER";

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email ?? null,
      fullName: user.user_metadata?.full_name ?? null,
    },
    role,
  });
}
