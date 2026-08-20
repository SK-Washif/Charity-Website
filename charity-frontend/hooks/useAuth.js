"use client";

import { useEffect, useState } from "react";
import { getCurrentAdmin } from "@/lib/auth";

export function useAuth() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentAdmin()
      .then((res) => setAdmin(res.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  return { admin, loading, isAuthenticated: !!admin };
}
