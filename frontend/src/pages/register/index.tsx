import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { AuthDivider, AuthLayout, FormError } from "../../components/layout/auth-layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { REGISTER } from "../../graphql/auth";
import { getErrorMessage } from "../../lib/error-message";

/** Espelha as regras do backend; ele continua sendo a autoridade final. */
const registerSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome completo."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const [createAccount, { loading }] = useMutation(REGISTER);

  async function onSubmit(values: RegisterForm) {
    setServerError(null);

    try {
      await createAccount({ variables: { data: values } });
      // Sem onboarding extra: o cadastro leva direto ao login
      // (CLAUDE.md seção 13).
      navigate("/", { replace: true, state: { justRegistered: true } });
    } catch (error) {
      setServerError(getErrorMessage(error, "Não foi possível criar a conta."));
    }
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Comece a controlar suas finanças ainda hoje">
      {serverError && <FormError message={serverError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input
          label="Nome completo"
          autoComplete="name"
          placeholder="Seu nome completo"
          icon={<User />}
          error={formState.errors.name?.message}
          {...register("name")}
        />

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
          autoComplete="new-password"
          placeholder="Digite sua senha"
          icon={<Lock />}
          revealable
          helperText="A senha deve ter no mínimo 8 caracteres"
          error={formState.errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>

      <AuthDivider />

      <div className="text-center">
        <p className="mb-4 text-gray-600">Já tem uma conta?</p>
        <Button
          variant="secondary"
          fullWidth
          icon={<LogIn className="size-5" />}
          onClick={() => navigate("/")}
        >
          Fazer login
        </Button>
      </div>
    </AuthLayout>
  );
}
