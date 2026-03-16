import { EmojiType } from '@/types/enums';

export interface ReactionConfig {
  type: EmojiType;
  emoji: string;
  label: string;
}

export const REACTIONS: ReactionConfig[] = [
  { type: 'praying_hands', emoji: '\u{1F64F}', label: 'Pray' },
  { type: 'heart', emoji: '\u2764\uFE0F', label: 'Love' },
  { type: 'fire', emoji: '\u{1F525}', label: 'Fire' },
  { type: 'amen', emoji: '\u{1F64C}', label: 'Amen' },
  { type: 'cross', emoji: '\u271D\uFE0F', label: 'Cross' },
];

export const REACTION_EMOJI_MAP: Record<EmojiType, string> = {
  praying_hands: '\u{1F64F}',
  heart: '\u2764\uFE0F',
  fire: '\u{1F525}',
  amen: '\u{1F64C}',
  cross: '\u271D\uFE0F',
};
