"use client";

import { useEffect } from "react";
import { getSession } from "@/lib/auth";

export default function Home() {
  useEffect(() => {
    const session = getSession();
    window.location.replace(session ? "/dashboard" : "/homepage.html");
  }, []);
  return null;
}
