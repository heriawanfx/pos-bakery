// src/pages/LoginPage.tsx
import { type FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../stores/useAuthStore";
import { useToast } from "../components/ui/ToastProvider";
import { Lock, Mail } from "lucide-react";

interface LocationState {
  from?: Location;
}

export function LoginPage() {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const from = (location.state as LocationState | null)?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { user, error } = await login(email, password);

    if (user) {
      showToast({
        variant: "success",
        title: "Login berhasil",
        description: `Selamat datang ${user.email}`,
      });
      navigate(from, { replace: true });
    } else {
        showToast({
        variant: "error",
        title: "Login gagal",
        description: error?.message ?? "Email atau Password salah",
      });
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-sm">
        <Card className="p-5 space-y-4">
          <CardHeader
            title="Login Admin"
            description="Gunakan akun Supabase admin untuk mengakses PoS Bakery."
          />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Masuk..." : "Masuk"}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center mt-2">
                Demo: email <code>admin@admin.com</code>, password <code>admin</code>.
              </p>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
