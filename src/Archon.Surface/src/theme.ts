// Applique le theme choisi par l'IA (ou l'utilisateur) en direct, via des variables CSS.
// Le theme est un JSON simple { accent, density } stocke cote coeur (settings ihm.theme).
export function applyTheme(themeJson: string | undefined): void {
  const root = document.documentElement;
  let accent = '';
  let density = '';

  if (themeJson) {
    try {
      const t = JSON.parse(themeJson) as { accent?: string; density?: string };
      accent = t.accent ?? '';
      density = t.density ?? '';
    } catch {
      /* theme illisible : on garde les valeurs par defaut */
    }
  }

  if (accent) root.style.setProperty('--accent', accent);
  else root.style.removeProperty('--accent');

  root.setAttribute('data-density', density || 'normal');
}
