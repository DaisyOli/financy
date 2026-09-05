import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppLayout } from "../../components/layout/app-layout";
import { FormError } from "../../components/layout/auth-layout";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/auth-context";
import { ME, type AuthUser } from "../../graphql/auth";
import { UPDATE_PROFILE } from "../../graphql/user";
import { getErrorMessage } from "../../lib/error-message";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome completo."),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user, signOut, refreshUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  // O usuário chega do contexto de forma assíncrona no primeiro carregamento.
  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  const [updateProfile, { loading }] = useMutation<{ updateProfile: AuthUser }>(
    UPDATE_PROFILE,
    { refetchQueries: [{ query: ME }] },
  );

  async function onSubmit(values: ProfileForm) {
    setServerError(null);
    setSaved(false);

    try {
      const result = await updateProfile({ variables: { data: values } });

      if (result.data) {
        // Atualiza o contexto para o header e o avatar refletirem na hora.
        refreshUser(result.data.updateProfile);
        setSaved(true);
      }
    } catch (error) {
      setServerError(getErrorMessage(error, "Não foi possível salvar as alterações."));
    }
  }

  return (
    <AppLayout>
      <Card className="mx-auto max-w-lg p-8">
        <div className="text-center">
          <Avatar name={user?.name ?? ""} size="lg" className="mx-auto" />
          <h1 className="mt-4 text-2xl font-bold text-gray-800">{user?.name}</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <hr className="my-8 border-gray-200" />

        {serverError && <FormError message={serverError} />}

        {saved && (
          <p
            role="status"
            className="mb-4 rounded-lg border border-success/30 bg-green-light px-3 py-2 text-sm text-green-dark"
          >
            Alterações salvas.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <Input
            label="Nome completo"
            icon={<User />}
            autoComplete="name"
            error={formState.errors.name?.message}
            {...register("name", { onChange: () => setSaved(false) })}
          />

          {/*
            O e-mail é a identidade de login e não pode ser alterado
            (CLAUDE.md seção 11.1). O campo é apenas informativo — a
            mutation do backend nem aceita esse dado.
          */}
          <Input
            label="E-mail"
            icon={<Mail />}
            value={user?.email ?? ""}
            helperText="O e-mail não pode ser alterado"
            disabled
            readOnly
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>

        <div className="mt-4">
          <Button
            variant="secondary"
            fullWidth
            icon={<LogOut className="size-5 text-danger" />}
            onClick={signOut}
          >
            Sair da conta
          </Button>
        </div>
      </Card>
    </AppLayout>
  );
}
