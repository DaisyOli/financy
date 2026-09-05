import { ValidationError } from "../errors/app-error.js";

/**
 * Limite do avatar já redimensionado pelo cliente. Base64 ocupa cerca de
 * 4/3 do binário, então 400 KB de texto equivalem a ~300 KB de imagem —
 * folga confortável para uma foto de 256px.
 */
const MAX_DATA_URL_LENGTH = 400_000;

const DATA_URL_PATTERN = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

/**
 * Valida a foto recebida. Aceitar data URL sem checagem permitiria injetar
 * SVG com script ou encher o banco, então o formato e o tamanho são
 * verificados no servidor, não só no navegador.
 */
export function validateAvatarDataUrl(value: string): string {
  const dataUrl = value.trim();

  if (!DATA_URL_PATTERN.test(dataUrl)) {
    throw new ValidationError("Envie uma imagem PNG, JPEG ou WebP válida.");
  }

  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    throw new ValidationError("A imagem é muito grande. Escolha uma foto menor.");
  }

  return dataUrl;
}
