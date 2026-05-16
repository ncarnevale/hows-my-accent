// MVP: single hardcoded Spanish passage (rolled R, ñ, ll, soft/hard G, etc.)

/** Collapses source line-wraps into flowing text; blank lines become paragraph breaks. */
export function formatPassageText(text: string): string {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim()
    )
    .join("\n\n");
}

export const MVP_PASSAGE = {
  id: "lam-intro",
  text: `
    Queridos amigos, quiero contarles una historia. Un día regresando de mi trabajo, vi un
    perro que estaba corriendo rápido junto al ferrocarril. Giramos a la izquierda y oí a
    una chica gritar con alegría el nombre de su amigo Miguel. El cielo estaba nublado y la
    calle estaba tranquila. Esta historia no tiene ningún sentido, pero debería ayudarles con
    la pronunciación.
  `,
};

export const MVP_PASSAGE_DISPLAY = formatPassageText(MVP_PASSAGE.text);
