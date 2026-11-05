import strings from './strings.json';
import type { Lang, Localized } from '../data/content';

export type Key = keyof typeof strings.en;

// Romanian must have every English key: a missing one fails the type check instead of showing English
strings.ro satisfies Record<Key, string>;

/** Translator for one language. `{name}` placeholders are filled from `vars`. */
export function useT(lang: Lang) {
  return (key: Key, vars: Record<string, string | number> = {}) =>
    Object.entries(vars).reduce<string>(
      (text, [name, value]) => text.replace(`{${name}}`, String(value)),
      strings[lang][key],
    );
}

/** A value that is either shared by both languages or given per language. */
export function pick(value: string | Localized, lang: Lang): string {
  return typeof value === 'string' ? value : value[lang];
}

/** Diacritics become their base letter (ș → s), so Romanian names keep readable anchors. */
export function slug(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
