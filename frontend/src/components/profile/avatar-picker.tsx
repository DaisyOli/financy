import { useMutation } from "@apollo/client/react";
import { Camera, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { useAuth } from "../../contexts/auth-context";
import type { AuthUser } from "../../graphql/auth";
import { UPDATE_AVATAR } from "../../graphql/user";
import { getErrorMessage } from "../../lib/error-message";
import { ACCEPTED_IMAGE_TYPES, resizeImageToDataUrl } from "../../lib/resize-image";
import { Avatar } from "../ui/avatar";

interface AvatarPickerProps {
  user: AuthUser | null;
  onError: (message: string | null) => void;
}

/**
 * Foto do perfil. O arquivo é reduzido a 256px no próprio navegador antes
 * de subir, então o servidor recebe dezenas de KB em vez de megabytes.
 */
export function AvatarPicker({ user, onError }: AvatarPickerProps) {
  const { refreshUser } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [updateAvatar, { loading }] = useMutation<{ updateAvatar: AuthUser }>(UPDATE_AVATAR);
  const isBusy = isProcessing || loading;

  async function save(avatarDataUrl: string | null) {
    onError(null);

    try {
      const result = await updateAvatar({ variables: { avatarDataUrl } });

      if (result.data) {
        refreshUser(result.data.updateAvatar);
      }
    } catch (error) {
      onError(getErrorMessage(error, "Não foi possível salvar a foto."));
    }
  }

  async function handleFile(file: File) {
    setIsProcessing(true);
    onError(null);

    try {
      await save(await resizeImageToDataUrl(file));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Não foi possível ler a imagem.");
    } finally {
      setIsProcessing(false);
      // Permite reescolher o mesmo arquivo depois de um erro.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar name={user?.name ?? ""} imageUrl={user?.avatarDataUrl} size="lg" />

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="sr-only"
        aria-label="Escolher foto do perfil"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isBusy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium
                     text-brand-base transition-colors hover:bg-gray-100
                     disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <Camera className="size-4" />
          {isBusy ? "Enviando..." : user?.avatarDataUrl ? "Trocar foto" : "Adicionar foto"}
        </button>

        {user?.avatarDataUrl && (
          <button
            type="button"
            onClick={() => void save(null)}
            disabled={isBusy}
            aria-label="Remover foto"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium
                       text-gray-500 transition-colors hover:bg-gray-100 hover:text-danger
                       disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <Trash2 className="size-4" />
            Remover
          </button>
        )}
      </div>
    </div>
  );
}
