import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth } from "../../stores/auth";

export default function AdminGuard() {
  const auth = useStore($auth);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!auth.token) {
      window.location.href = "/auth/login";
      return;
    }
    if (auth.user?.rol !== "admin") {
      window.location.href = "/";
      return;
    }
    setChecked(true);
  }, [auth]);

  if (!checked) {
    return (
      <div class="flex items-center justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return null;
}
