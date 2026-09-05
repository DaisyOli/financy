import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { AuthDivider, AuthLayout, FormError } from "../../components/layout/auth-layout";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/auth-context";
import { LOGIN, type AuthUser } from "../../graphql/auth";
import { getErrorMessage } from "../../lib/error-message";

const loginSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [remember, setRemember] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [login, { loading }] = useMutation<{
    login: { token: string; user: AuthUser };
  }>(LOGIN);

  async function onSubmit(values: LoginForm) {
    setServerError(null);

    try {
      const result = await login({ variables: { data: values } });

      if (result.data) {
        signIn(result.data.login.token, result.data.login.user, remember);
        navigate("/", { replace: true });
      }
    } catch (error) {
      // O backend é a autoridade final sobre a mensagem exibida.
      setServerError(getErrorMessage(error, "Não foi possível entrar."));
    }
  }

  return (
    <AuthLayout title="Fazer login" subtitle="Entre na sua conta para continuar">
      {serverError && <FormError message={serverError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="mail@exemplo.com"
          icon={<Mail />}
          error={formState.errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          icon={<Lock />}
          revealable
          error={formState.errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <Checkbox label="Lembrar-me" checked={remember} onCheckedChange={setRemember} />
          {/*
            Recuperação de senha não faz parte do escopo obrigatório
            (CLAUDE.md seção 25.1): o link é reproduzido, mas inativo.
          */}
          <span
            className="cursor-not-allowed text-sm font-medium text-brand-base"
            title="Recuperação de senha não faz parte desta versão"
          >
            Recuperar senha
          </span>
        </div>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <AuthDivider />

      <div className="text-center">
        <p className="mb-4 text-gray-600">Ainda não tem uma conta?</p>
        <Button
          variant="secondary"
          fullWidth
          icon={<UserPlus className="size-5" />}
          onClick={() => navigate("/register")}
        >
          Criar conta
        </Button>
      </div>
    </AuthLayout>
  );
}
