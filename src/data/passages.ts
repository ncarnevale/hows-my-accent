// MVP: single hardcoded Spanish passage (rolled R, ñ, ll, soft/hard G, etc.)

export const MVP_PASSAGE = {
  id: "lam-intro",
  text: `
    Queridos amigos, quiero contarles una historia. Un día regresando de mi trabajo, vi un
    perro que estaba corriendo rápido junto al ferrocarril. Giramos a la izquierda y oí a
    una chica gritar con alegría el nombre de su amigo Miguel. El cielo estaba nublado y la
    calle estaba tranquila. Esta historia no tiene ningún sentido, pero debería ayudarles con
    la pronunciación.
  `,
} as const;

export const PASSAGES = [MVP_PASSAGE] as const;
