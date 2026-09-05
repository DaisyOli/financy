/** Lado do avatar depois do processamento. Suficiente para telas retina. */
const AVATAR_SIZE = 256;
const JPEG_QUALITY = 0.85;

/** Recusa arquivos absurdos antes mesmo de ler, para não travar o navegador. */
const MAX_INPUT_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

/**
 * Reduz a imagem escolhida a um quadrado de 256px e devolve uma data URL.
 *
 * O corte é central: a foto preenche o círculo do avatar sem deformar,
 * independentemente de ser retrato ou paisagem. Redimensionar aqui evita
 * enviar megabytes ao servidor e mantém o campo do banco pequeno.
 */
export function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      reject(new Error("Escolha uma imagem PNG, JPEG ou WebP."));
      return;
    }

    if (file.size > MAX_INPUT_BYTES) {
      reject(new Error("A imagem é muito grande. Escolha um arquivo de até 10 MB."));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_SIZE;
      canvas.height = AVATAR_SIZE;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Não foi possível processar a imagem."));
        return;
      }

      // Recorta o maior quadrado central antes de reduzir.
      const side = Math.min(image.width, image.height);
      const offsetX = (image.width - side) / 2;
      const offsetY = (image.height - side) / 2;

      context.drawImage(
        image,
        offsetX,
        offsetY,
        side,
        side,
        0,
        0,
        AVATAR_SIZE,
        AVATAR_SIZE,
      );

      // JPEG mantém o arquivo pequeno; PNG dobraria de tamanho aqui.
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível ler a imagem."));
    };

    image.src = objectUrl;
  });
}
