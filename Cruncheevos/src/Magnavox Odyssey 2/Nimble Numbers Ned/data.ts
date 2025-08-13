import { byte, word, dword, upper4, lower4 } from '../../common/value.js';

// ---------------------------------------------------------------------------------------------------

export const ADDR = {
  voice_sample_related: byte(0x005),

  coarse_state: dword(0x0020),
  victory_flag:  byte(0x0020),

  number_level:  byte(0x0021),
  level_high:  upper4(0x0021),
  level_low:   lower4(0x0021),
  difficulty:    byte(0x0022),
  num_correct:   byte(0x0023),

  screen_id:     byte(0x0028),
  mult_function: word(0x002e),

  ned_state:     byte(0x0034),
  error_count:   byte(0x0036),

  numeric_input: (n: 10000 | 1000 | 100 | 10 | 1) => byte(0x00a6 + 4 - Math.log10(n)),
};
