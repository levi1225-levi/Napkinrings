// ============================================================
// CHAVRUTA — COMPLETE QUESTION BANK
// lib/questions.ts
//
// Source: Grade 10 Rabbinics, TanenbaumCHAT 2025-2026
// Study guide + class worksheets only. No external content.
//
// TOPIC TAGS:
//   vocab               — all vocabulary terms
//   written_oral_torah  — Written vs. Oral Torah
//   chain_transmission  — Pirkei Avot 1:1, chain of transmission
//   rambam_exodus       — Exodus 24:12, Rambam's intro to Mishneh Torah
//   rabbi_yehudah       — Rabbi Yehudah HaNasi, 5 reasons, Mishnah compilation
//   mishnah_structure   — Sedarim, Masachtot, Mishnah organization
//   tanaim_amoraim      — Tana'im, Amoraim, who said what
//   gemara_style        — Mishnah vs. Gemara style
//   two_talmuds         — Bavli vs. Yerushalmi
//   law_codes           — Mishneh Torah, Shulchan Aruch, why codes were needed
//   responsa            — She'elot u'Teshuvot
//   tefillin            — Oral Law & Tefillin example
//   milk_meat           — Oral Law & Milk and Meat example
//   saadiah_rambam      — Rambam vs. Rav Saadiah Gaon
//   six_orders          — Six Orders of the Mishnah (demo, not main test)
//
// DIFFICULTY:
//   1 = straightforward recall
//   2 = requires understanding
//   3 = nuanced / easy to confuse
// ============================================================
export type QuestionType = "mc" | "tf" | "fib" | "match" | "sa" | "order";
export type TopicTag =
  | "vocab"
  | "written_oral_torah"
  | "chain_transmission"
  | "rambam_exodus"
  | "rabbi_yehudah"
  | "mishnah_structure"
  | "tanaim_amoraim"
  | "gemara_style"
  | "two_talmuds"
  | "law_codes"
  | "responsa"
  | "tefillin"
  | "milk_meat"
  | "saadiah_rambam"
  | "six_orders";
export interface MCQuestion {
  id: string;
  type: "mc";
  topic: TopicTag;
  difficulty: 1 | 2 | 3;
  onMainTest: boolean;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}
export interface TFQuestion {
  id: string;
  type: "tf";
  topic: TopicTag;
  difficulty: 1 | 2 | 3;
  onMainTest: boolean;
  question: string;
  isTrue: boolean;
  explanation: string;
  hint?: string;
}
export interface FIBQuestion {
  id: string;
  type: "fib";
  topic: TopicTag;
  difficulty: 1 | 2 | 3;
  onMainTest: boolean;
  // Use ___ to mark each blank
  question: string;
  blanks: string[];
  acceptableAnswers: string[][];
  explanation: string;
  hint?: string;
}
export interface MatchQuestion {
  id: string;
  type: "match";
  topic: TopicTag;
  difficulty: 1 | 2 | 3;
  onMainTest: boolean;
  question: string;
  pairs: { left: string; right: string }[];
  explanation: string;
}
export interface OrderQuestion {
  id: string;
  type: "order";
  topic: TopicTag;
  difficulty: 1 | 2 | 3;
  onMainTest: boolean;
  question: string;
  items: string[]; // correct order
  explanation: string;
  hint?: string;
}
export interface SAQuestion {
  id: string;
  type: "sa";
  topic: TopicTag;
  difficulty: 1 | 2 | 3;
  onMainTest: boolean;
  question: string;
  keyPoints: string[];
  modelAnswer: string;
  hint?: string;
}
export type AnyQuestion =
  | MCQuestion
  | TFQuestion
  | FIBQuestion
  | MatchQuestion
  | OrderQuestion
  | SAQuestion;
// ============================================================
// KNOWN CONFUSION PAIRS
// The adaptive engine should watch for these and trigger
// side-by-side drills when the user swaps them.
// ============================================================
export const confusionPairs: [string, string][] = [
  ["Mishnah", "Gemara"],
  ["Bavli", "Yerushalmi"],
  ["Mishneh Torah", "Shulchan Aruch"],
  ["Tana'im", "Amoraim"],
  ["Torah She-bichtav", "Torah She-b'al Peh"],
  ["Seder", "Masechet"],
  ["Daf", "Amud"],
  ["Rambam", "Rav Saadiah Gaon"],
  ["Baraita", "Mishnah"],
  ["Canon", "Apocrypha"],
];
export const questionBank: AnyQuestion[] = [
  // ================================================================
  // ██╗   ██╗ ██████╗  ██████╗ █████╗ ██████╗
  // ██║   ██║██╔═══██╗██╔════╝██╔══██╗██╔══██╗
  // ██║   ██║██║   ██║██║     ███████║██████╔╝
  // ╚██╗ ██╔╝██║   ██║██║     ██╔══██║██╔══██╗
  //  ╚████╔╝ ╚██████╔╝╚██████╗██║  ██║██████╔╝
  //   ╚═══╝   ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═════╝
  // SECTION 1: VOCABULARY & TERMS
  // ================================================================
  // ── MULTIPLE CHOICE ────────────────────────────────────────────
  {
    id: "v-mc-001", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "What does 'Halachah' (הלכה) literally mean?",
    options: ["The Law", "The path / the way", "The tradition", "The commandment"],
    correctIndex: 1,
    explanation: "Halachah literally means 'the way' or 'the path.' It is the Hebrew term for Jewish law.",
    hint: "Think of it as a road you walk on.",
  },
  {
    id: "v-mc-002", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "What is the Chumash (חומש)?",
    options: [
      "The entire Hebrew Bible including Prophets and Writings",
      "The Five Books of Moses in book form",
      "The Babylonian Talmud",
      "A Jewish prayer book",
    ],
    correctIndex: 1,
    explanation: "Chumash = the Five Books of Moses (Torah) in book form. The root word is 'chamesh,' meaning five.",
  },
  {
    id: "v-mc-003", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "The Tanach (תנ\"ך) is an acronym. What do the three letters stand for?",
    options: [
      "Torah, Nevi'im, Chumash",
      "Torah, Nevi'im, Ketuvim",
      "Talmud, Nevi'im, Ketuvim",
      "Torah, Nashim, Kodashim",
    ],
    correctIndex: 1,
    explanation: "ת = Torah, נ = Nevi'im (Prophets), ך = Ketuvim (Writings). Together = the complete Hebrew Bible.",
  },
  {
    id: "v-mc-004", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Why do Jews prefer 'Tanach' over 'Old Testament'?",
    options: [
      "Because 'Tanach' is shorter and easier to pronounce",
      "'Old Testament' is a Christian term implying there is also a 'New Testament'",
      "'Old Testament' includes extra books not in the Jewish Bible",
      "Because 'Tanach' is the more modern academic term",
    ],
    correctIndex: 1,
    explanation: "'Old Testament' is a Christian term used in contrast to the New Testament. Since Jews don't recognize a New Testament, they use the Hebrew term Tanach.",
    hint: "What does the word 'Old' imply must also exist?",
  },
  {
    id: "v-mc-005", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "What is the Brit HaChadashah (ברית החדשה)?",
    options: [
      "The Oral Torah",
      "The New Testament — the sacred scriptures of Christianity",
      "The covenant God made with Abraham",
      "The Mishnah",
    ],
    correctIndex: 1,
    explanation: "Brit HaChadashah literally means 'New Covenant' — it is the Christian New Testament. It is NOT part of the Jewish canon.",
  },
  {
    id: "v-mc-006", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What does 'extrapolate' mean in the context of Jewish law?",
    options: [
      "To translate the Torah from Hebrew into Aramaic",
      "To use what we know to derive or estimate what we don't know",
      "To write down oral traditions for the first time",
      "To dispute a ruling in the Talmud",
    ],
    correctIndex: 1,
    explanation: "To extrapolate = use known information to derive unknown information. The rabbis did this constantly — for example, 'no threshing on Shabbat' → 'no shucking corn' → 'no squeezing lemon into tea.'",
  },
  {
    id: "v-mc-007", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What is the 'Canon' of the Bible?",
    options: [
      "The commentary written by Rashi on the Torah",
      "A type of Jewish law derived from the Biblical text",
      "The definitive, official collection of books included in the Bible",
      "The oral traditions passed down from Moses",
    ],
    correctIndex: 2,
    explanation: "The Canon is the authoritative, official list of books accepted as part of the Bible. Books that did not make the cut are in the Apocrypha.",
  },
  {
    id: "v-mc-008", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What are the Apocrypha?",
    options: [
      "Books of the Oral Torah not recorded in the Mishnah",
      "Books whose divine origin was disputed and were not included in the Tanach",
      "The Aramaic translation of the Torah",
      "Commentaries on the Talmud written in the Middle Ages",
    ],
    correctIndex: 1,
    explanation: "The Apocrypha are books that 'didn't make the cut' for the Biblical canon because their divine origin was disputed. Some appear in the Christian Bible (e.g. Books of Maccabees).",
  },
  {
    id: "v-mc-009", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "What does it mean to 'codify' Jewish law?",
    options: [
      "To debate the meaning of a law in the Talmud",
      "To translate the Torah into another language",
      "To arrange laws into a formal, systematic order people can follow",
      "To memorize the Oral Torah",
    ],
    correctIndex: 2,
    explanation: "Codify = arrange laws into a clear, organized, systematic order. Rambam and Rabbi Karo both codified Jewish law.",
  },
  {
    id: "v-mc-010", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "The Mishnah was compiled by whom?",
    options: ["Rambam (Maimonides)", "Rabbi Joseph Karo", "Rabbi Yehudah HaNasi", "Moses"],
    correctIndex: 2,
    explanation: "Rabbi Yehudah HaNasi compiled the Mishnah around 200 CE.",
  },
  {
    id: "v-mc-011", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What is a 'Seder' (סדר) in the context of the Mishnah?",
    options: [
      "The Passover Seder meal",
      "One of the six major orders/divisions of the Mishnah",
      "A rabbinic court",
      "A Talmudic debate",
    ],
    correctIndex: 1,
    explanation: "In the Mishnah, a Seder = Order — one of the six major divisions. (The word also means the Passover meal, but here it means 'order.')",
    hint: "The word means 'order' — think of how the Mishnah is organized.",
  },
  {
    id: "v-mc-012", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "What is a Masechet (מסכת)?",
    options: [
      "One of the six major orders of the Mishnah",
      "A tractate — a smaller section within an order of the Mishnah",
      "A type of Talmudic commentary",
      "A prayer leader",
    ],
    correctIndex: 1,
    explanation: "A Masechet (tractate) is a sub-division within a Seder. Each of the 6 Sedarim contains multiple Masachtot.",
  },
  {
    id: "v-mc-013", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What is a Baraita (ברייתא)?",
    options: [
      "A teaching of a Tanna that WAS included in the Mishnah",
      "A teaching of a Tanna that was NOT included in the Mishnah",
      "A teaching of an Amora recorded in the Gemara",
      "A legal ruling by Rambam",
    ],
    correctIndex: 1,
    explanation: "A Baraita is a Tannaic teaching that Rabbi Yehudah HaNasi did NOT include in the Mishnah. The Gemara often cites them.",
    hint: "'Baraita' comes from a word meaning 'outside.'",
  },
  {
    id: "v-mc-014", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What does 'Shas' (ש\"ס) stand for?",
    options: [
      "Shulchan Aruch (The Set Table)",
      "Shishah Sedarim — the Six Orders",
      "She'elot u'Teshuvot (Responsa)",
      "Shema and Siddur",
    ],
    correctIndex: 1,
    explanation: "Shas = Shishah Sedarim (שישה סדרים) = Six Orders. It is also used as a name for the entire Talmud.",
  },
  {
    id: "v-mc-015", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "The Shulchan Aruch was written by whom?",
    options: ["Rambam (Maimonides)", "Rabbi Yehudah HaNasi", "Rabbi Joseph Karo", "Rav Saadiah Gaon"],
    correctIndex: 2,
    explanation: "The Shulchan Aruch was compiled by Rabbi Joseph Karo in 1565.",
  },
  {
    id: "v-mc-016", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What does 'Shulchan Aruch' literally mean?",
    options: ["The Oral Torah", "The Set Table", "The Written Law", "The Complete Code"],
    correctIndex: 1,
    explanation: "Shulchan Aruch = 'The Set Table' in Hebrew — implying a table already set with everything you need (all the laws clearly laid out).",
  },
  {
    id: "v-mc-017", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "What is the Mishneh Torah?",
    options: [
      "A commentary on the Mishnah written by the Amoraim",
      "Rambam's comprehensive code of Jewish law",
      "The Jerusalem Talmud",
      "A collection of responsa",
    ],
    correctIndex: 1,
    explanation: "The Mishneh Torah is Rambam's (Maimonides') law code, which organized ALL Talmudic law by topic in clear language.",
  },
  {
    id: "v-mc-018", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "What does She'elot u'Teshuvot (שאלות ותשובות) literally mean?",
    options: ["Laws and Statutes", "Questions and Answers", "Tractates and Orders", "Debates and Rulings"],
    correctIndex: 1,
    explanation: "She'elot u'Teshuvot literally = 'Questions and Answers' — the Hebrew name for Responsa literature.",
  },
  {
    id: "v-mc-019", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What is a Machloket (מחלוקת)?",
    options: [
      "A chapter of the Mishnah",
      "A rabbinical dispute or disagreement in the Talmud",
      "A type of Torah scroll",
      "A blessing before studying Torah",
    ],
    correctIndex: 1,
    explanation: "Machloket = a rabbinical dispute or disagreement. The Talmud is full of machloket — it often records both sides without giving a final ruling.",
  },
  {
    id: "v-mc-020", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What is a Daf (דף) in the Talmud?",
    options: [
      "One side of a page",
      "A chapter of the Mishnah",
      "A double-sided folio page",
      "A tractate",
    ],
    correctIndex: 2,
    explanation: "A Daf = a double-sided folio page in the Talmud. Each side of the Daf is called an Amud.",
  },
  {
    id: "v-mc-021", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "What is an Amud (עמוד) in the Talmud?",
    options: [
      "A double-sided folio page",
      "One side of a Daf",
      "A chapter in the Mishnah",
      "A section of the Torah",
    ],
    correctIndex: 1,
    explanation: "Amud = one side of a Daf. Each Daf has two Amudim: Amud Aleph (side A) and Amud Bet (side B).",
  },
  {
    id: "v-mc-022", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "What is Torah She-bichtav (תורה שבכתב)?",
    options: [
      "The Oral Torah",
      "The Written Torah — the text of the Five Books of Moses",
      "The Talmud",
      "The Mishnah",
    ],
    correctIndex: 1,
    explanation: "Torah She-bichtav = 'Torah that is in writing' = the Written Torah.",
  },
  {
    id: "v-mc-023", type: "mc", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "What is Torah She-b'al Peh (תורה שבעל פה)?",
    options: [
      "The Written Torah",
      "The Five Books of Moses",
      "The Oral Torah — the oral interpretation and traditions passed alongside the Written Torah",
      "The Shulchan Aruch",
    ],
    correctIndex: 2,
    explanation: "Torah She-b'al Peh = 'Torah that is on the mouth' = the Oral Torah.",
  },
  {
    id: "v-mc-024", type: "mc", topic: "vocab", difficulty: 3, onMainTest: true,
    question: "What is the difference between a Seder and a Masechet?",
    options: [
      "They are the same thing, just different words",
      "A Seder is a major division; a Masechet is a smaller sub-division (tractate) within a Seder",
      "A Masechet is a major division; a Seder is a smaller sub-division",
      "A Seder refers to the Talmud; a Masechet refers to the Mishnah only",
    ],
    correctIndex: 1,
    explanation: "There are 6 Sedarim (orders). Each Seder is divided into multiple Masachtot (tractates). Seder is larger; Masechet is smaller.",
  },
  {
    id: "v-mc-025", type: "mc", topic: "vocab", difficulty: 3, onMainTest: true,
    question: "Which of the following is NOT a category in the Tanach?",
    options: ["Torah", "Nevi'im (Prophets)", "Ketuvim (Writings)", "Gemara"],
    correctIndex: 3,
    explanation: "The Tanach has three parts: Torah, Nevi'im, Ketuvim. The Gemara is part of the Oral Torah (Talmud), not the Tanach.",
  },
  // ── TRUE / FALSE ───────────────────────────────────────────────
  {
    id: "v-tf-001", type: "tf", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "'Old Testament' is the preferred Jewish term for the Hebrew Bible.",
    isTrue: false,
    explanation: "False. Jews use 'Tanach.' 'Old Testament' is a Christian term contrasting with the New Testament.",
  },
  {
    id: "v-tf-002", type: "tf", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "The Tanach includes the Torah, Nevi'im (Prophets), and Ketuvim (Writings).",
    isTrue: true,
    explanation: "True. Tanach is the Hebrew acronym for these three sections.",
  },
  {
    id: "v-tf-003", type: "tf", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "The Chumash and the Torah refer to the same five books.",
    isTrue: true,
    explanation: "True. Chumash is simply the Torah (Five Books of Moses) in book form.",
  },
  {
    id: "v-tf-004", type: "tf", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "The Books of Maccabees are part of the Tanach.",
    isTrue: false,
    explanation: "False. The Books of Maccabees are Apocrypha — they appear in the Christian Bible but were not accepted into the Jewish Tanach canon.",
  },
  {
    id: "v-tf-005", type: "tf", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "A Baraita is a teaching of a Tanna that Rabbi Yehudah HaNasi included in the Mishnah.",
    isTrue: false,
    explanation: "False. A Baraita is a Tannaic teaching that was NOT included in the Mishnah. The word means 'outside.'",
  },
  {
    id: "v-tf-006", type: "tf", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "'Shas' can be used as a name for the entire Talmud.",
    isTrue: true,
    explanation: "True. Shas = Shishah Sedarim (Six Orders). It refers both to the Mishnah's structure and is commonly used as a name for the full Talmud.",
  },
  {
    id: "v-tf-007", type: "tf", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "The Shulchan Aruch was written by Rambam (Maimonides).",
    isTrue: false,
    explanation: "False. The Shulchan Aruch was written by Rabbi Joseph Karo. Rambam wrote the Mishneh Torah.",
  },
  {
    id: "v-tf-008", type: "tf", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "A Machloket in the Talmud means the rabbis reached a unanimous agreement.",
    isTrue: false,
    explanation: "False. Machloket means a rabbinical dispute or disagreement — the opposite of unanimous agreement.",
  },
  {
    id: "v-tf-009", type: "tf", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Torah She-b'al Peh literally means 'Torah that is on the mouth.'",
    isTrue: true,
    explanation: "True. 'B'al Peh' = 'on the mouth' — referring to oral transmission.",
  },
  {
    id: "v-tf-010", type: "tf", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "A Daf in the Talmud refers to one side of a page.",
    isTrue: false,
    explanation: "False. A Daf is a double-sided folio page. One side of the Daf is called an Amud.",
  },
  {
    id: "v-tf-011", type: "tf", topic: "vocab", difficulty: 3, onMainTest: true,
    question: "She'elot u'Teshuvot is another name for Responsa literature.",
    isTrue: true,
    explanation: "True. She'elot u'Teshuvot = Questions and Answers = Responsa.",
  },
  {
    id: "v-tf-012", type: "tf", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "The Apocrypha are books included in both the Tanach and the Christian Bible.",
    isTrue: false,
    explanation: "False. The Apocrypha were NOT accepted into the Tanach canon — their divine origin was disputed. Some do appear in the Christian Bible.",
  },
  // ── FILL IN THE BLANK ──────────────────────────────────────────
  {
    id: "v-fib-001", type: "fib", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Halachah (הלכה) literally means 'the ___ or the ___.'",
    blanks: ["path", "way"],
    acceptableAnswers: [["path", "way", "road"], ["way", "path", "road"]],
    explanation: "Halachah = the way / the path — Hebrew term for Jewish law.",
  },
  {
    id: "v-fib-002", type: "fib", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "The Tanach is an acronym for ___, ___, and ___.",
    blanks: ["Torah", "Nevi'im", "Ketuvim"],
    acceptableAnswers: [["torah"], ["nevi'im", "neviim", "prophets"], ["ketuvim", "writings"]],
    explanation: "T-N-K: Torah + Nevi'im (Prophets) + Ketuvim (Writings).",
  },
  {
    id: "v-fib-003", type: "fib", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "She'elot u'Teshuvot means '___ and ___.'",
    blanks: ["Questions", "Answers"],
    acceptableAnswers: [["questions"], ["answers"]],
    explanation: "She'elot = questions; Teshuvot = answers/responses.",
  },
  {
    id: "v-fib-004", type: "fib", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "Shulchan Aruch means 'The ___ ___' in English.",
    blanks: ["Set", "Table"],
    acceptableAnswers: [["set", "prepared", "arranged"], ["table"]],
    explanation: "Shulchan = table; Aruch = set/prepared.",
  },
  {
    id: "v-fib-005", type: "fib", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "The ___ ___ was written by Rambam, while the ___ ___ was written by Rabbi Joseph Karo.",
    blanks: ["Mishneh Torah", "Shulchan Aruch"],
    acceptableAnswers: [["mishneh torah"], ["shulchan aruch"]],
    explanation: "Two major law codes: Mishneh Torah (Rambam) and Shulchan Aruch (Rabbi Karo).",
  },
  {
    id: "v-fib-006", type: "fib", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Torah She-bichtav = '___ Torah.' Torah She-b'al Peh = '___ Torah.'",
    blanks: ["Written", "Oral"],
    acceptableAnswers: [["written"], ["oral"]],
    explanation: "Bichtav = in writing. B'al Peh = on the mouth.",
  },
  {
    id: "v-fib-007", type: "fib", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "A ___ is a major division of the Mishnah, while a ___ is a smaller tractate within it.",
    blanks: ["Seder", "Masechet"],
    acceptableAnswers: [["seder", "order"], ["masechet", "tractate", "masechta"]],
    explanation: "6 Sedarim, each divided into Masachtot (tractates).",
  },
  {
    id: "v-fib-008", type: "fib", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "A ___ is a double-sided Talmud page, while an ___ is one side of that page.",
    blanks: ["Daf", "Amud"],
    acceptableAnswers: [["daf", "folio", "page"], ["amud", "side"]],
    explanation: "Each Daf has two Amudim: Aleph (A) and Bet (B).",
  },
  {
    id: "v-fib-009", type: "fib", topic: "vocab", difficulty: 3, onMainTest: true,
    question: "Books whose divine origin was disputed and that were not accepted into the Tanach are called the ___.",
    blanks: ["Apocrypha"],
    acceptableAnswers: [["apocrypha"]],
    explanation: "The Apocrypha = the books that 'didn't make the cut' for the Jewish biblical canon.",
  },
  // ── MATCHING ──────────────────────────────────────────────────
  {
    id: "v-match-001", type: "match", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "Match each term to its definition.",
    pairs: [
      { left: "Halachah", right: "The path / Jewish law" },
      { left: "Chumash", right: "The Five Books of Moses in book form" },
      { left: "Tanach", right: "The full Hebrew Bible (Torah + Prophets + Writings)" },
      { left: "Brit HaChadashah", right: "The Christian New Testament" },
    ],
    explanation: "Core vocabulary for the Oral Law unit.",
  },
  {
    id: "v-match-002", type: "match", topic: "vocab", difficulty: 1, onMainTest: true,
    question: "Match each law code to its author.",
    pairs: [
      { left: "Mishneh Torah", right: "Rambam (Maimonides)" },
      { left: "Shulchan Aruch", right: "Rabbi Joseph Karo" },
      { left: "Mishnah", right: "Rabbi Yehudah HaNasi" },
    ],
    explanation: "Each of these foundational texts was compiled by a different rabbi.",
  },
  {
    id: "v-match-003", type: "match", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Match each term to its correct description.",
    pairs: [
      { left: "Daf", right: "A double-sided folio page in the Talmud" },
      { left: "Amud", right: "One side of a Daf" },
      { left: "Masechet", right: "A tractate — sub-division of a Seder" },
      { left: "Seder", right: "One of the six major divisions of the Mishnah" },
    ],
    explanation: "Structural terms used to navigate the Mishnah and Talmud.",
  },
  {
    id: "v-match-004", type: "match", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Match each Hebrew term to its English translation.",
    pairs: [
      { left: "Torah She-bichtav", right: "Written Torah" },
      { left: "Torah She-b'al Peh", right: "Oral Torah" },
      { left: "Machloket", right: "Rabbinic dispute / disagreement" },
      { left: "Baraita", right: "Tannaic teaching not in the Mishnah" },
    ],
    explanation: "Core Hebrew terms for the unit.",
  },
  {
    id: "v-match-005", type: "match", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Match each text to its correct category.",
    pairs: [
      { left: "Tanach", right: "Written Torah" },
      { left: "Mishnah", right: "Oral Torah" },
      { left: "Gemara", right: "Oral Torah" },
      { left: "Apocrypha", right: "Books NOT in the Tanach canon" },
    ],
    explanation: "Categorizing Jewish texts.",
  },
  // ================================================================
  // SECTION 2: WRITTEN vs. ORAL TORAH
  // ================================================================
  {
    id: "wot-mc-001", type: "mc", topic: "written_oral_torah", difficulty: 1, onMainTest: true,
    question: "According to Jewish tradition, when were BOTH the Written and Oral Torah given to Moses?",
    options: [
      "Written Torah at Sinai; Oral Torah at the Tabernacle 40 years later",
      "Both were given to Moses at Mount Sinai simultaneously",
      "The Oral Torah developed naturally over centuries after the Written Torah",
      "The Written Torah first; the Oral Torah was revealed to the Prophets later",
    ],
    correctIndex: 1,
    explanation: "According to tradition (as stated by Rambam), both the Written AND Oral Torah were given to Moses at Mount Sinai.",
  },
  {
    id: "wot-mc-002", type: "mc", topic: "written_oral_torah", difficulty: 2, onMainTest: true,
    question: "What problem with the Written Torah makes the Oral Torah necessary?",
    options: [
      "The Written Torah was written in a language no longer understood",
      "The prescriptions for daily life are often cryptic, vague, or completely indecipherable on their own",
      "The Written Torah contradicts itself in almost every chapter",
      "The Written Torah was too long for the average person to read",
    ],
    correctIndex: 1,
    explanation: "From class: 'The prescriptions for daily life found in the Bible are often cryptic, vague, and even contradictory. Some are completely indecipherable on their own.' The Oral Torah explains them.",
  },
  {
    id: "wot-mc-003", type: "mc", topic: "written_oral_torah", difficulty: 1, onMainTest: true,
    question: "What role does the Oral Torah play in relation to the Written Torah?",
    options: [
      "It replaces the Written Torah for modern Jews",
      "It contradicts the Written Torah where the Written Torah is unclear",
      "It explains, interprets, and expands upon the laws in the Written Torah",
      "It is a collection of stories about Biblical heroes",
    ],
    correctIndex: 2,
    explanation: "The Oral Torah explains and expands upon the laws in the Written Torah, filling in gaps and providing practical guidance for daily life.",
  },
  {
    id: "wot-mc-004", type: "mc", topic: "written_oral_torah", difficulty: 2, onMainTest: true,
    question: "Why was the Oral Torah originally kept oral (not written down)?",
    options: [
      "Because parchment was too expensive",
      "Because Moses commanded it stay oral forever",
      "It was passed down orally until fear of its loss led to it being committed to writing",
      "Because the Romans would have burned any written version",
    ],
    correctIndex: 2,
    explanation: "The Oral Torah was passed down orally until the fear of it being lost — due to persecution, exile, and dispersal — led to its being written down.",
  },
  {
    id: "wot-mc-005", type: "mc", topic: "written_oral_torah", difficulty: 1, onMainTest: true,
    question: "For Orthodox Jews, how binding is the Oral Torah compared to the Written Torah?",
    options: [
      "The Written Torah is more binding; the Oral Torah is optional",
      "The obligations in the Oral Law are equally as binding as those in the Written Torah",
      "The Oral Torah is more binding than the Written Torah",
      "Neither is legally binding — both are spiritual guidelines",
    ],
    correctIndex: 1,
    explanation: "From class: 'For Orthodox Jews, the obligations recorded in the Oral Law are as binding as those recorded in the Written Torah.'",
  },
  {
    id: "wot-mc-006", type: "mc", topic: "written_oral_torah", difficulty: 3, onMainTest: true,
    question: "According to the class reading, what is the Reform Jewish view of the Oral Torah?",
    options: [
      "It is equally binding as the Written Torah",
      "It is more important than the Written Torah",
      "It is the product of human beings and therefore not halachically binding",
      "It should be memorized but not practiced",
    ],
    correctIndex: 2,
    explanation: "From class: 'Reform Judaism does not accept the binding nature of Jewish law, or halachah, seeing the Oral Law as the product of human beings.'",
  },
  {
    id: "wot-mc-007", type: "mc", topic: "written_oral_torah", difficulty: 2, onMainTest: true,
    question: "Which of the following is the BEST example of the Oral Torah filling in a gap in the Written Torah?",
    options: [
      "The Torah says 'God created the world in 6 days' — the Oral Torah explains what God said each day",
      "The Torah says 'do not do melacha on Shabbat' — the Oral Torah defines the 39 categories of melacha",
      "The Torah says 'love your neighbor' — the Oral Torah says who counts as a neighbor",
      "The Torah names all the Israelite tribes — the Oral Torah gives their population counts",
    ],
    correctIndex: 1,
    explanation: "The Torah prohibits 'melacha' (work) on Shabbat but doesn't define it. The Oral Torah (Mishnah) gives a specific list of 39 forbidden categories.",
  },
  {
    id: "wot-tf-001", type: "tf", topic: "written_oral_torah", difficulty: 1, onMainTest: true,
    question: "According to traditional Jewish belief, only the Written Torah was given at Mount Sinai.",
    isTrue: false,
    explanation: "False. According to tradition, both Written and Oral Torah were given at Sinai simultaneously.",
  },
  {
    id: "wot-tf-002", type: "tf", topic: "written_oral_torah", difficulty: 1, onMainTest: true,
    question: "The Mishnah and Gemara are considered part of the Oral Torah tradition.",
    isTrue: true,
    explanation: "True. The Talmud (Mishnah + Gemara) is the primary written record of the Oral Torah.",
  },
  {
    id: "wot-tf-003", type: "tf", topic: "written_oral_torah", difficulty: 2, onMainTest: true,
    question: "According to the class reading, modern Jewish religious life would be 'unrecognizable' without the Oral Torah.",
    isTrue: true,
    explanation: "True. From class: 'Among modern Jews, religious life would be unrecognizable without the traditions recorded in the Oral Law.'",
  },
  {
    id: "wot-fib-001", type: "fib", topic: "written_oral_torah", difficulty: 2, onMainTest: true,
    question: "Torah She-bichtav means '___ Torah,' while Torah She-b'al Peh means '___ Torah.'",
    blanks: ["Written", "Oral"],
    acceptableAnswers: [["written"], ["oral"]],
    explanation: "She-bichtav = in writing. She-b'al Peh = on the mouth.",
  },
  {
    id: "wot-fib-002", type: "fib", topic: "written_oral_torah", difficulty: 2, onMainTest: true,
    question: "The Oral Torah was kept ___ until the fear of it being ___ led to writing it down.",
    blanks: ["oral", "lost"],
    acceptableAnswers: [["oral", "verbal", "unwritten"], ["lost", "forgotten", "lost forever"]],
    explanation: "It was an oral tradition for centuries until Rabbi Yehudah compiled the Mishnah.",
  },
  // ================================================================
  // SECTION 3: CHAIN OF TRANSMISSION
  // ================================================================
  {
    id: "chain-mc-001", type: "mc", topic: "chain_transmission", difficulty: 1, onMainTest: true,
    question: "What is the source text that describes the chain of transmission of the Oral Torah?",
    options: ["Exodus 24:12", "Pirkei Avot 1:1", "Deuteronomy 6:8", "Genesis 1:1"],
    correctIndex: 1,
    explanation: "Pirkei Avot (Ethics of the Fathers) 1:1 gives the chain: Moses → Joshua → Elders → Prophets → Men of the Great Assembly.",
  },
  {
    id: "chain-mc-002", type: "mc", topic: "chain_transmission", difficulty: 1, onMainTest: true,
    question: "According to Pirkei Avot 1:1, who directly received the Torah from Moses?",
    options: ["The Elders", "The Prophets", "Joshua", "The Men of the Great Assembly"],
    correctIndex: 2,
    explanation: "Pirkei Avot 1:1: 'Moses received the Torah at Sinai and transmitted it to Joshua.'",
  },
  {
    id: "chain-mc-003", type: "mc", topic: "chain_transmission", difficulty: 2, onMainTest: true,
    question: "According to Pirkei Avot 1:1, what is the correct order of transmission after Joshua?",
    options: [
      "Joshua → Prophets → Elders → Men of the Great Assembly",
      "Joshua → Elders → Prophets → Men of the Great Assembly",
      "Joshua → Men of the Great Assembly → Elders → Prophets",
      "Joshua → Elders → Men of the Great Assembly → Prophets",
    ],
    correctIndex: 1,
    explanation: "The correct order: Joshua → Elders → Prophets → Men of the Great Assembly.",
  },
  {
    id: "chain-mc-004", type: "mc", topic: "chain_transmission", difficulty: 2, onMainTest: true,
    question: "Who received the Torah from the Prophets, according to Pirkei Avot 1:1?",
    options: [
      "The Zugot (pairs of sages)",
      "The Tanna'im",
      "The Men of the Great Assembly",
      "Rabbi Yehudah HaNasi",
    ],
    correctIndex: 2,
    explanation: "The prophets transmitted the Torah to the Men of the Great Assembly (Anshei Knesset HaGedolah).",
  },
  {
    id: "chain-mc-005", type: "mc", topic: "chain_transmission", difficulty: 2, onMainTest: true,
    question: "The 'Zugot' who appear in the chain of transmission were:",
    options: [
      "Individual scholars who each held office alone",
      "Pairs of leading sages who led each generation together",
      "Three senior rabbis forming a court",
      "The disciples of Rabbi Yehudah HaNasi",
    ],
    correctIndex: 1,
    explanation: "Zugot = pairs. After the Men of the Great Assembly, the tradition was passed through pairs (Zugot) of leading sages.",
  },
  {
    id: "chain-mc-006", type: "mc", topic: "chain_transmission", difficulty: 1, onMainTest: true,
    question: "Who is the final recipient in the chain of transmission described in class?",
    options: ["Rambam", "Rav Saadiah Gaon", "Rabbi Joseph Karo", "Rabbi Yehudah HaNasi"],
    correctIndex: 3,
    explanation: "The chain ends with Rabbi Yehudah HaNasi, who compiled the Mishnah around 200 CE.",
  },
  {
    id: "chain-mc-007", type: "mc", topic: "chain_transmission", difficulty: 2, onMainTest: true,
    question: "Why was it important for the rabbis to establish an unbroken chain from the Oral Torah to Mount Sinai?",
    options: [
      "To prove the Mishnah was written in Hebrew, not Aramaic",
      "To show that rabbinic traditions were not merely human creations but traced their authority back to God at Sinai",
      "To explain why there are two Talmuds",
      "To show that Rambam was the greatest rabbi of all time",
    ],
    correctIndex: 1,
    explanation: "From class: establishing the chain showed that rabbinic traditions 'were not merely human creations, but traced their authority back to Sinai,' giving them divine authority.",
  },
  {
    id: "chain-mc-008", type: "mc", topic: "chain_transmission", difficulty: 3, onMainTest: true,
    question: "What logical problem arises from the claim that Moses received ALL the Oral Torah at Sinai?",
    options: [
      "How could Moses have written the entire Torah alone?",
      "How could discussions of rabbis from centuries later have been received by Moses at Sinai?",
      "Why didn't Joshua write the Oral Torah down immediately?",
      "Why do the Bavli and Yerushalmi disagree with each other?",
    ],
    correctIndex: 1,
    explanation: "From class: 'How is it possible that the discussions of Rabbis that took place centuries later were received by Moses at Mount Sinai?' This is the fundamental tension in the chain claim.",
  },
  {
    id: "chain-tf-001", type: "tf", topic: "chain_transmission", difficulty: 1, onMainTest: true,
    question: "According to Pirkei Avot 1:1, Moses transmitted the Torah directly to the Prophets.",
    isTrue: false,
    explanation: "False. Moses → Joshua → Elders → Prophets. The Elders come before the Prophets.",
  },
  {
    id: "chain-tf-002", type: "tf", topic: "chain_transmission", difficulty: 2, onMainTest: true,
    question: "The purpose of establishing the chain of transmission was to show that the Oral Torah's authority originated from God at Sinai.",
    isTrue: true,
    explanation: "True. The chain connects the rabbis' authority all the way back to the divine revelation at Sinai.",
  },
  {
    id: "chain-tf-003", type: "tf", topic: "chain_transmission", difficulty: 2, onMainTest: true,
    question: "The chain of transmission ends with the Amoraim.",
    isTrue: false,
    explanation: "False. As described in class, the chain ends with Rabbi Yehudah HaNasi, who was a Tanna.",
  },
  {
    id: "chain-order-001", type: "order", topic: "chain_transmission", difficulty: 2, onMainTest: true,
    question: "Put the following groups in the correct order of transmission according to Pirkei Avot 1:1 (first to last):",
    items: [
      "Moses",
      "Joshua",
      "The Elders",
      "The Prophets",
      "The Men of the Great Assembly",
      "The Zugot",
      "The Tanna'im",
      "Rabbi Yehudah HaNasi",
    ],
    explanation: "This is the full chain of transmission from Pirkei Avot 1:1 extended to the compilation of the Mishnah.",
  },
  {
    id: "chain-fib-001", type: "fib", topic: "chain_transmission", difficulty: 2, onMainTest: true,
    question: "According to Pirkei Avot 1:1, Moses received the Torah at ___ and transmitted it to ___.",
    blanks: ["Sinai", "Joshua"],
    acceptableAnswers: [["sinai", "mount sinai"], ["joshua"]],
    explanation: "The opening line of Pirkei Avot.",
  },
  {
    id: "chain-fib-002", type: "fib", topic: "chain_transmission", difficulty: 2, onMainTest: true,
    question: "The chain of transmission established that rabbinic traditions were not merely ___ creations, but traced their authority back to ___.",
    blanks: ["human", "Sinai"],
    acceptableAnswers: [["human", "human beings", "man-made"], ["sinai", "mount sinai", "god", "the giving of the torah"]],
    explanation: "This is the main purpose of establishing the chain — to ground rabbinic authority in divine revelation.",
  },
  // ================================================================
  // SECTION 4: RAMBAM & EXODUS 24:12
  // ================================================================
  {
    id: "ram-mc-001", type: "mc", topic: "rambam_exodus", difficulty: 2, onMainTest: true,
    question: "What does Exodus 24:12 say that Rambam uses to prove the Oral Torah was given at Sinai?",
    options: [
      "'And Moses went up to God, and the LORD called to him from the mountain'",
      "'And I will give you the tablets of stone, and the Torah, and the commandment'",
      "'These are the statutes and laws you shall observe in the land'",
      "'Love the LORD your God with all your heart'",
    ],
    correctIndex: 1,
    explanation: "Exodus 24:12: 'And I will give you the tablets of stone, and the Torah, and the commandment (v'hamitzvah).' Rambam argues 'Torah' = Written Torah; 'commandment' = Oral Torah.",
  },
  {
    id: "ram-mc-002", type: "mc", topic: "rambam_exodus", difficulty: 2, onMainTest: true,
    question: "In Rambam's interpretation of Exodus 24:12, what does the word 'Torah' (התורה) refer to?",
    options: [
      "The Oral Torah",
      "The Written Torah — the Five Books of Moses",
      "The entire Talmud",
      "Both Written and Oral Torah together",
    ],
    correctIndex: 1,
    explanation: "Rambam interprets 'Torah' in Exodus 24:12 as referring to the Written Torah (the Five Books).",
  },
  {
    id: "ram-mc-003", type: "mc", topic: "rambam_exodus", difficulty: 2, onMainTest: true,
    question: "In Rambam's interpretation of Exodus 24:12, what does 'v'hamitzvah' (וְהַמִּצְוָה — the commandment) refer to?",
    options: [
      "The Ten Commandments specifically",
      "The Written Torah",
      "The Oral Torah — the explanations and interpretations passed orally",
      "The commandment to love God",
    ],
    correctIndex: 2,
    explanation: "Rambam interprets 'v'hamitzvah' (the commandment) as the Oral Torah — the oral explanations of how to carry out the written laws.",
  },
  {
    id: "ram-mc-004", type: "mc", topic: "rambam_exodus", difficulty: 3, onMainTest: true,
    question: "What is the main point Rambam makes by citing Exodus 24:12?",
    options: [
      "That Moses was the only person to ever receive a direct revelation from God",
      "That the Oral Torah was given to Moses at Sinai together with the Written Torah, not invented later",
      "That the tablets of stone are the most important part of the Torah",
      "That the Written Torah must always be read alongside its Aramaic translation",
    ],
    correctIndex: 1,
    explanation: "Rambam uses Exodus 24:12 to argue that both Written and Oral Torah were given at Sinai — the Oral Torah is not a later human invention.",
  },
  {
    id: "ram-tf-001", type: "tf", topic: "rambam_exodus", difficulty: 2, onMainTest: true,
    question: "Rambam interprets 'v'hamitzvah' (the commandment) in Exodus 24:12 as referring to the Written Torah.",
    isTrue: false,
    explanation: "False. Rambam interprets 'Torah' = Written Torah, and 'v'hamitzvah' = Oral Torah.",
  },
  {
    id: "ram-tf-002", type: "tf", topic: "rambam_exodus", difficulty: 2, onMainTest: true,
    question: "Rambam's citation of Exodus 24:12 is meant to support the idea that the Oral Torah was given at Sinai.",
    isTrue: true,
    explanation: "True. Rambam uses this verse to ground the Oral Torah's authority in the Sinai revelation alongside the Written Torah.",
  },
  {
    id: "ram-fib-001", type: "fib", topic: "rambam_exodus", difficulty: 3, onMainTest: true,
    question: "In Exodus 24:12, Rambam interprets 'הַתּוֹרָה' (the Torah) as the ___ Torah, and 'וְהַמִּצְוָה' (the commandment) as the ___ Torah.",
    blanks: ["Written", "Oral"],
    acceptableAnswers: [["written"], ["oral"]],
    explanation: "This is the core of Rambam's interpretation of Exodus 24:12.",
  },
  // ================================================================
  // SECTION 5: RABBI YEHUDAH HANASI & THE MISHNAH
  // ================================================================
  {
    id: "ry-mc-001", type: "mc", topic: "rabbi_yehudah", difficulty: 1, onMainTest: true,
    question: "Approximately when did Rabbi Yehudah HaNasi compile the Mishnah?",
    options: ["Around 500 BCE", "Around 70 CE", "Around 200 CE", "Around 500 CE"],
    correctIndex: 2,
    explanation: "Rabbi Yehudah HaNasi compiled the Mishnah around 200 CE (Common Era).",
  },
  {
    id: "ry-mc-002", type: "mc", topic: "rabbi_yehudah", difficulty: 1, onMainTest: true,
    question: "What did Rabbi Yehudah HaNasi compile?",
    options: ["The Gemara", "The Mishnah", "The Shulchan Aruch", "The Babylonian Talmud"],
    correctIndex: 1,
    explanation: "Rabbi Yehudah HaNasi compiled the Mishnah, which was the first major written collection of the Oral Torah.",
  },
  {
    id: "ry-mc-003", type: "mc", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "Which of the following is one of Rambam's five reasons that led Rabbi Yehudah HaNasi to write down the Oral Torah?",
    options: [
      "The number of disciples was growing rapidly and more teachers were needed",
      "The number of disciples was declining",
      "The Roman government had officially banned writing Hebrew",
      "The Written Torah had been destroyed and needed to be reconstructed",
    ],
    correctIndex: 1,
    explanation: "One of the 5 reasons: the number of disciples was declining (fewer people learning Torah properly).",
  },
  {
    id: "ry-mc-004", type: "mc", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "Which is another of the five reasons Rabbi Yehudah compiled the Oral Torah?",
    options: [
      "The Oral Torah was already written down in Babylon",
      "Rabbi Yehudah wanted to prove the Oral Torah was human-made",
      "Fresh calamities kept occurring, making it harder to maintain the tradition",
      "The number of disciples was growing too large to teach orally",
    ],
    correctIndex: 2,
    explanation: "One of the 5 reasons: fresh calamities kept occurring, distracting the community from learning and threatening continuity.",
  },
  {
    id: "ry-mc-005", type: "mc", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "Why did the expanding Roman government make writing down the Oral Torah necessary?",
    options: [
      "The Romans required all religious texts to be written in Latin",
      "Roman persecution and oppression threatened the survival of Torah study",
      "The Romans offered money to anyone who could provide a written Torah",
      "Roman roads made it easier to distribute written books",
    ],
    correctIndex: 1,
    explanation: "Roman persecution and oppression threatened Jewish survival and disrupted the ability to maintain oral transmission across generations.",
  },
  {
    id: "ry-mc-006", type: "mc", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "How did the dispersal/exile of Jews make writing down the Oral Torah necessary?",
    options: [
      "Jews in different countries spoke different languages and needed a translation",
      "Jews scattered to distant lands could no longer gather to learn from the same teachers",
      "Dispersed Jews wanted to forget the Oral Torah entirely",
      "The Torah was only allowed to be taught in the Land of Israel",
    ],
    correctIndex: 1,
    explanation: "As Jews dispersed to different places, they could no longer easily pass down the oral tradition from teacher to student. A written text could travel with them.",
  },
  {
    id: "ry-mc-007", type: "mc", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "The fifth reason Rabbi Yehudah compiled the Oral Torah was that he felt a portable ___ was needed.",
    options: ["prayer book", "handbook", "commentary", "scroll"],
    correctIndex: 1,
    explanation: "Rambam states that Rabbi Yehudah felt the community needed a portable handbook — a written guide people could carry and consult anywhere.",
  },
  {
    id: "ry-mc-008", type: "mc", topic: "rabbi_yehudah", difficulty: 3, onMainTest: true,
    question: "All five of Rambam's reasons for Rabbi Yehudah writing down the Oral Torah share a common theme. What is it?",
    options: [
      "Rabbi Yehudah wanted to become famous as a Torah scholar",
      "The oral tradition was at risk of being lost due to historical circumstances",
      "Rabbi Yehudah disagreed with how Joshua had transmitted the Torah",
      "The Roman government required all religious laws to be in writing",
    ],
    correctIndex: 1,
    explanation: "All five reasons relate to the danger of the Oral Torah being lost — fewer disciples, calamities, persecution, exile, and dispersal all threatened the chain of transmission.",
  },
  {
    id: "ry-tf-001", type: "tf", topic: "rabbi_yehudah", difficulty: 1, onMainTest: true,
    question: "Rabbi Yehudah HaNasi compiled the Mishnah around 200 CE.",
    isTrue: true,
    explanation: "True. The Mishnah was compiled around 200 CE by Rabbi Yehudah HaNasi.",
  },
  {
    id: "ry-tf-002", type: "tf", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "According to Rambam, one reason Rabbi Yehudah wrote down the Oral Torah was that the number of disciples was increasing rapidly.",
    isTrue: false,
    explanation: "False. It was the opposite — the number of disciples was DECLINING, making oral transmission increasingly precarious.",
  },
  {
    id: "ry-tf-003", type: "tf", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "The dispersal of Jews to many lands made maintaining oral transmission more difficult.",
    isTrue: true,
    explanation: "True. With Jews scattered across distant lands, they could no longer reliably pass down oral traditions from master to student.",
  },
  {
    id: "ry-fib-001", type: "fib", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "Rabbi Yehudah HaNasi compiled the ___ around 200 CE.",
    blanks: ["Mishnah"],
    acceptableAnswers: [["mishnah"]],
    explanation: "The Mishnah was the first major written collection of the Oral Torah.",
  },
  {
    id: "ry-fib-002", type: "fib", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "Rambam gives ___ reasons that led Rabbi Yehudah to write down the Oral Torah.",
    blanks: ["five", "5"],
    acceptableAnswers: [["five", "5"]],
    explanation: "Rambam lists exactly five reasons in his Introduction to the Mishneh Torah.",
  },
  {
    id: "ry-sa-001", type: "sa", topic: "rabbi_yehudah", difficulty: 2, onMainTest: true,
    question: "List Rambam's five reasons that led Rabbi Yehudah HaNasi to compile and write down the Oral Torah.",
    keyPoints: [
      "The number of disciples was declining",
      "Fresh calamities kept occurring",
      "The Roman government was expanding / increasing persecution",
      "Jews were dispersing / being exiled to distant lands",
      "A portable handbook was needed",
    ],
    modelAnswer:
      "According to Rambam, Rabbi Yehudah HaNasi wrote down the Oral Torah for five reasons: (1) the number of disciples learning Torah was declining; (2) fresh calamities kept occurring, disrupting Torah study; (3) the Roman government was becoming increasingly powerful and oppressive; (4) Jews were dispersing and being exiled to distant lands; and (5) Rabbi Yehudah felt the community needed a portable handbook they could use anywhere.",
    hint: "Think: who's learning? What's happening externally? Where are Jews going? What does everyone need?",
  },
  // ================================================================
  // SECTION 6: MISHNAH STRUCTURE
  // ================================================================
  {
    id: "ms-mc-001", type: "mc", topic: "mishnah_structure", difficulty: 1, onMainTest: true,
    question: "How many major orders (Sedarim) does the Mishnah have?",
    options: ["4", "5", "6", "7"],
    correctIndex: 2,
    explanation: "The Mishnah is divided into six Sedarim (orders): Zera'im, Mo'ed, Nashim, Nezikin, Kodashim, Tohorot.",
  },
  {
    id: "ms-mc-002", type: "mc", topic: "mishnah_structure", difficulty: 1, onMainTest: true,
    question: "The Mishnah is organized into six ___?",
    options: ["Masachtot (Tractates)", "Sedarim (Orders)", "Dafim (Pages)", "Amudin (Sides)"],
    correctIndex: 1,
    explanation: "The six top-level divisions of the Mishnah are called Sedarim (Orders). Each Seder contains multiple Masachtot.",
  },
  {
    id: "ms-mc-003", type: "mc", topic: "mishnah_structure", difficulty: 2, onMainTest: true,
    question: "What is the relationship between a Seder and a Masechet in the Mishnah?",
    options: [
      "They are the same thing",
      "A Seder is one of six major divisions; a Masechet is a smaller tractate within a Seder",
      "A Masechet is one of six major divisions; a Seder is a smaller sub-division",
      "A Seder refers to a Talmudic discussion; a Masechet refers to a Mishnaic law",
    ],
    correctIndex: 1,
    explanation: "There are 6 Sedarim. Each Seder contains multiple Masachtot (tractates). Seder is bigger; Masechet is smaller.",
  },
  {
    id: "ms-tf-001", type: "tf", topic: "mishnah_structure", difficulty: 1, onMainTest: true,
    question: "The Mishnah is divided into six major orders called Sedarim.",
    isTrue: true,
    explanation: "True. There are exactly six Sedarim in the Mishnah.",
  },
  {
    id: "ms-tf-002", type: "tf", topic: "mishnah_structure", difficulty: 2, onMainTest: true,
    question: "Each Seder of the Mishnah focuses on a single specific law.",
    isTrue: false,
    explanation: "False. Each Seder focuses on a broad TOPIC AREA (e.g., agriculture, festivals, women's law, damages). It contains many laws within multiple Masachtot.",
  },
  {
    id: "ms-match-001", type: "match", topic: "mishnah_structure", difficulty: 2, onMainTest: false,
    question: "Match each Seder to its topic area.",
    pairs: [
      { left: "Zera'im (Seeds)", right: "Agricultural laws and prayers" },
      { left: "Mo'ed (Festivals)", right: "Sabbath and holiday laws" },
      { left: "Nashim (Women)", right: "Marriage, divorce, and family law" },
      { left: "Nezikin (Damages)", right: "Civil and criminal law" },
      { left: "Kodashim (Holy Things)", right: "Temple service and sacrifices" },
      { left: "Tohorot (Purities)", right: "Ritual purity and impurity laws" },
    ],
    explanation: "The Six Orders of the Mishnah and their general subject areas.",
  },
  // ================================================================
  // SECTION 7: TANA'IM & AMORAIM
  // ================================================================
  {
    id: "ta-mc-001", type: "mc", topic: "tanaim_amoraim", difficulty: 1, onMainTest: true,
    question: "What are the Tana'im (תנאים)?",
    options: [
      "Rabbis whose teachings are recorded in the Gemara",
      "Rabbis whose teachings are recorded in the Mishnah",
      "Pairs of leading sages who led each generation",
      "Disciples of Rambam",
    ],
    correctIndex: 1,
    explanation: "Tana'im (singular: Tanna) = the rabbis from the period of the Mishnah (roughly 10–220 CE). Their teachings are recorded in the Mishnah.",
    hint: "'Tanna' relates to the same root as 'Mishnah' — both mean to repeat/teach.",
  },
  {
    id: "ta-mc-002", type: "mc", topic: "tanaim_amoraim", difficulty: 1, onMainTest: true,
    question: "What are the Amoraim (אמוראים)?",
    options: [
      "Rabbis whose teachings appear in the Mishnah",
      "Rabbis whose teachings and discussions appear in the Gemara",
      "The first five generations of Torah scholars after Moses",
      "Rabbis who compiled the Shulchan Aruch",
    ],
    correctIndex: 1,
    explanation: "Amoraim (singular: Amora) = the rabbis from the period after the Mishnah (roughly 220–500 CE). Their discussions are recorded in the Gemara.",
    hint: "Amora comes from the Aramaic for 'speaker' or 'interpreter.'",
  },
  {
    id: "ta-mc-003", type: "mc", topic: "tanaim_amoraim", difficulty: 2, onMainTest: true,
    question: "In the Talmud, who are the Tana'im and who are the Amoraim?",
    options: [
      "Tana'im wrote the Gemara; Amoraim wrote the Mishnah",
      "Tana'im wrote the Mishnah; Amoraim discussed and commented on it in the Gemara",
      "Both groups wrote the Gemara at the same time",
      "Tana'im are earlier Amoraim — there is no real difference",
    ],
    correctIndex: 1,
    explanation: "Tana'im = Mishnah period (teachings recorded in the Mishnah). Amoraim = Gemara period (their discussions of the Mishnah are recorded in the Gemara).",
  },
  {
    id: "ta-mc-004", type: "mc", topic: "tanaim_amoraim", difficulty: 3, onMainTest: true,
    question: "Can an Amora disagree with a Tanna?",
    options: [
      "Yes — an Amora can freely overrule any Tannaic ruling",
      "No — an Amora generally cannot disagree with a Tanna; Tannaic rulings have greater authority",
      "Only if the Amora is older than the Tanna",
      "Only with permission from the Sanhedrin",
    ],
    correctIndex: 1,
    explanation: "In the Talmud, an Amora generally cannot overrule a Tanna's ruling. Tanna'im have greater authority because they were closer in time to the original revelation.",
  },
  {
    id: "ta-tf-001", type: "tf", topic: "tanaim_amoraim", difficulty: 1, onMainTest: true,
    question: "The Tana'im are the rabbis whose teachings appear in the Mishnah.",
    isTrue: true,
    explanation: "True. Tana'im = Mishnah-era rabbis.",
  },
  {
    id: "ta-tf-002", type: "tf", topic: "tanaim_amoraim", difficulty: 1, onMainTest: true,
    question: "The Amoraim are the rabbis whose teachings appear in the Gemara.",
    isTrue: true,
    explanation: "True. Amoraim = Gemara-era rabbis.",
  },
  {
    id: "ta-tf-003", type: "tf", topic: "tanaim_amoraim", difficulty: 2, onMainTest: true,
    question: "The Tana'im came AFTER the Amoraim historically.",
    isTrue: false,
    explanation: "False. The Tana'im came BEFORE the Amoraim. Tana'im period: ~10–220 CE. Amoraim period: ~220–500 CE.",
  },
  {
    id: "ta-match-001", type: "match", topic: "tanaim_amoraim", difficulty: 1, onMainTest: true,
    question: "Match each group to the text they appear in.",
    pairs: [
      { left: "Tana'im", right: "Mishnah" },
      { left: "Amoraim", right: "Gemara" },
      { left: "Rabbi Yehudah HaNasi", right: "Compiled the Mishnah" },
    ],
    explanation: "Tana'im → Mishnah. Amoraim → Gemara.",
  },
  {
    id: "ta-fib-001", type: "fib", topic: "tanaim_amoraim", difficulty: 1, onMainTest: true,
    question: "The ___ are the rabbis whose teachings appear in the Mishnah, while the ___ are the rabbis whose discussions appear in the Gemara.",
    blanks: ["Tana'im", "Amoraim"],
    acceptableAnswers: [["tana'im", "tanaim", "tannaim"], ["amoraim"]],
    explanation: "Core distinction: Tana'im = Mishnah. Amoraim = Gemara.",
  },
  // ================================================================
  // SECTION 8: GEMARA STYLE
  // ================================================================
  {
    id: "gs-mc-001", type: "mc", topic: "gemara_style", difficulty: 2, onMainTest: true,
    question: "How does the style of the Mishnah differ from the Gemara?",
    options: [
      "The Mishnah is long and discursive; the Gemara is short and concise",
      "The Mishnah is concise and gives rulings directly; the Gemara is a flowing discussion that debates and expands",
      "The Mishnah is written in Aramaic; the Gemara is in Hebrew",
      "The Mishnah contains stories; the Gemara contains only laws",
    ],
    correctIndex: 1,
    explanation: "The Mishnah is terse, code-like, and gives direct rulings. The Gemara is a flowing, discursive discussion — it debates, asks questions, tells stories, and expands on the Mishnah.",
  },
  {
    id: "gs-mc-002", type: "mc", topic: "gemara_style", difficulty: 2, onMainTest: true,
    question: "What language(s) is the Gemara written in?",
    options: [
      "Hebrew only",
      "Aramaic only",
      "A mix of Hebrew and Aramaic",
      "Greek and Hebrew",
    ],
    correctIndex: 2,
    explanation: "The Gemara is written in a mix of Hebrew and Aramaic (the everyday language of Jews in that period).",
  },
  {
    id: "gs-mc-003", type: "mc", topic: "gemara_style", difficulty: 2, onMainTest: true,
    question: "How does the Gemara BUILD on the Mishnah?",
    options: [
      "The Gemara replaces the Mishnah with updated laws",
      "The Gemara discusses, debates, and analyzes Mishnaic rulings — asking why, how, and what the law means in new situations",
      "The Gemara corrects mistakes in the Mishnah",
      "The Gemara translates the Mishnah into Aramaic",
    ],
    correctIndex: 1,
    explanation: "The Gemara takes Mishnaic rulings as its starting point and discusses them in depth — debating their meaning, citing other sources, telling stories, and applying them to new situations.",
  },
  {
    id: "gs-mc-004", type: "mc", topic: "gemara_style", difficulty: 1, onMainTest: true,
    question: "Together, the Mishnah and the Gemara form the:",
    options: ["Tanach", "Talmud", "Shulchan Aruch", "Torah She-bichtav"],
    correctIndex: 1,
    explanation: "Mishnah + Gemara = Talmud. This is the basic structure of the Talmud.",
  },
  {
    id: "gs-tf-001", type: "tf", topic: "gemara_style", difficulty: 2, onMainTest: true,
    question: "The Mishnah is written in a flowing, conversational style with lots of debate and stories.",
    isTrue: false,
    explanation: "False. That describes the Gemara. The Mishnah is terse and code-like — it gives direct rulings without much explanation.",
  },
  {
    id: "gs-tf-002", type: "tf", topic: "gemara_style", difficulty: 1, onMainTest: true,
    question: "The Talmud consists of the Mishnah and the Gemara together.",
    isTrue: true,
    explanation: "True. Talmud = Mishnah + Gemara.",
  },
  {
    id: "gs-match-001", type: "match", topic: "gemara_style", difficulty: 1, onMainTest: true,
    question: "Match each text to its style/characteristic.",
    pairs: [
      { left: "Mishnah", right: "Concise, terse rulings written in Hebrew" },
      { left: "Gemara", right: "Flowing discussion in Hebrew and Aramaic" },
      { left: "Talmud", right: "Mishnah + Gemara combined" },
      { left: "Baraita", right: "Tannaic teaching not included in the Mishnah" },
    ],
    explanation: "Understanding what each text is and how it reads.",
  },
  {
    id: "gs-fib-001", type: "fib", topic: "gemara_style", difficulty: 1, onMainTest: true,
    question: "The ___ is concise and gives direct rulings, while the ___ discusses and debates those rulings in depth.",
    blanks: ["Mishnah", "Gemara"],
    acceptableAnswers: [["mishnah"], ["gemara"]],
    explanation: "Core stylistic difference between the two components of the Talmud.",
  },
  // ================================================================
  // SECTION 9: THE TWO TALMUDS
  // ================================================================
  {
    id: "tt-mc-001", type: "mc", topic: "two_talmuds", difficulty: 1, onMainTest: true,
    question: "What are the two Talmuds?",
    options: [
      "The Mishnah Talmud and the Gemara Talmud",
      "The Babylonian Talmud (Bavli) and the Jerusalem Talmud (Yerushalmi)",
      "The Written Talmud and the Oral Talmud",
      "The Rambam Talmud and the Karo Talmud",
    ],
    correctIndex: 1,
    explanation: "There are two Talmuds: the Bavli (Babylonian Talmud) and the Yerushalmi (Jerusalem/Palestinian Talmud).",
  },
  {
    id: "tt-mc-002", type: "mc", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "Why are there two Talmuds instead of one?",
    options: [
      "The first Talmud was destroyed by the Romans, so a second was made",
      "Two different Jewish communities (one in Babylon, one in the Land of Israel) compiled their own Gemara on the Mishnah",
      "Rambam and Rabbi Karo each wrote their own Talmud",
      "The Mishnah was written twice — once in Hebrew and once in Aramaic",
    ],
    correctIndex: 1,
    explanation: "After the destruction of the Temple, major Jewish communities existed in both Babylon and the Land of Israel. Each produced its own Gemara on the Mishnah, resulting in two Talmuds.",
  },
  {
    id: "tt-mc-003", type: "mc", topic: "two_talmuds", difficulty: 1, onMainTest: true,
    question: "The Babylonian Talmud is also called the:",
    options: ["Yerushalmi", "Bavli", "Mishneh Torah", "Shas Bavli"],
    correctIndex: 1,
    explanation: "Bavli = Babylonian (from Bavel = Babylon). The Bavli was compiled in Babylon.",
  },
  {
    id: "tt-mc-004", type: "mc", topic: "two_talmuds", difficulty: 1, onMainTest: true,
    question: "The Jerusalem (Palestinian) Talmud is also called the:",
    options: ["Bavli", "Yerushalmi", "Talmud Kodesh", "Jerusalem Mishnah"],
    correctIndex: 1,
    explanation: "Yerushalmi = Jerusalem. The Yerushalmi was compiled in the Land of Israel.",
  },
  {
    id: "tt-mc-005", type: "mc", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "What do the Bavli and the Yerushalmi have in common?",
    options: [
      "They were both compiled in Babylon at the same time",
      "Both are based on the same Mishnah — they just have different Gemarot",
      "Both are written entirely in Aramaic",
      "They were both compiled by Rabbi Yehudah HaNasi",
    ],
    correctIndex: 1,
    explanation: "Both Talmuds use the same Mishnah as their foundation — they differ in their Gemara (the rabbinic discussion of the Mishnah).",
  },
  {
    id: "tt-mc-006", type: "mc", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "Which Talmud is generally considered the more authoritative one?",
    options: [
      "The Yerushalmi (Jerusalem Talmud)",
      "The Bavli (Babylonian Talmud)",
      "They are considered completely equal in authority",
      "Neither — the Mishnah alone is considered authoritative",
    ],
    correctIndex: 1,
    explanation: "The Bavli (Babylonian Talmud) is considered more authoritative. It is more comprehensive, better edited, and was compiled later (benefiting from more scholarly review).",
  },
  {
    id: "tt-mc-007", type: "mc", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "When someone says 'the Talmud' without specifying, which one are they referring to?",
    options: [
      "The Yerushalmi (Jerusalem Talmud)",
      "The Bavli (Babylonian Talmud)",
      "Both equally",
      "Whichever is more convenient",
    ],
    correctIndex: 1,
    explanation: "When Jews say 'the Talmud' without qualification, they generally mean the Bavli (Babylonian Talmud).",
  },
  {
    id: "tt-mc-008", type: "mc", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "Approximately when was the Babylonian Talmud (Bavli) compiled?",
    options: ["Around 70 CE", "Around 200 CE", "Around 400 CE", "Around 500 CE"],
    correctIndex: 3,
    explanation: "The Bavli was compiled around 500 CE (it is later than the Yerushalmi, which was compiled around 400 CE).",
  },
  {
    id: "tt-mc-009", type: "mc", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "Approximately when was the Jerusalem Talmud (Yerushalmi) compiled?",
    options: ["Around 200 CE", "Around 400 CE", "Around 500 CE", "Around 700 CE"],
    correctIndex: 1,
    explanation: "The Yerushalmi was compiled around 400 CE — about a century before the Bavli.",
  },
  {
    id: "tt-tf-001", type: "tf", topic: "two_talmuds", difficulty: 1, onMainTest: true,
    question: "The Babylonian Talmud is called the Bavli.",
    isTrue: true,
    explanation: "True. Bavli = Babylonian.",
  },
  {
    id: "tt-tf-002", type: "tf", topic: "two_talmuds", difficulty: 1, onMainTest: true,
    question: "The Jerusalem Talmud is called the Yerushalmi.",
    isTrue: true,
    explanation: "True. Yerushalmi = Jerusalem/of Jerusalem.",
  },
  {
    id: "tt-tf-003", type: "tf", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "The Bavli and Yerushalmi are based on different versions of the Mishnah.",
    isTrue: false,
    explanation: "False. Both are based on the same Mishnah. They differ only in their Gemara.",
  },
  {
    id: "tt-tf-004", type: "tf", topic: "two_talmuds", difficulty: 1, onMainTest: true,
    question: "When people refer to 'the Talmud' without specifying, they generally mean the Babylonian Talmud.",
    isTrue: true,
    explanation: "True. 'The Talmud' = the Bavli by default.",
  },
  {
    id: "tt-tf-005", type: "tf", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "The Jerusalem Talmud is considered more authoritative than the Babylonian Talmud.",
    isTrue: false,
    explanation: "False. The Bavli (Babylonian Talmud) is considered more authoritative — it is more comprehensive and better edited.",
  },
  {
    id: "tt-fib-001", type: "fib", topic: "two_talmuds", difficulty: 1, onMainTest: true,
    question: "The two Talmuds are the ___ (Babylonian) and the ___ (Jerusalem/Palestinian).",
    blanks: ["Bavli", "Yerushalmi"],
    acceptableAnswers: [["bavli", "babylonian talmud"], ["yerushalmi", "jerusalem talmud", "palestinian talmud"]],
    explanation: "Bavli = Babylonian. Yerushalmi = Jerusalem.",
  },
  {
    id: "tt-fib-002", type: "fib", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "Both Talmuds are based on the same ___, but have different ___.",
    blanks: ["Mishnah", "Gemara"],
    acceptableAnswers: [["mishnah"], ["gemara", "gemarot", "discussions", "commentary"]],
    explanation: "One Mishnah; two different Gemarot = two different Talmuds.",
  },
  {
    id: "tt-match-001", type: "match", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "Match each Talmud to its characteristic.",
    pairs: [
      { left: "Bavli", right: "Compiled in Babylon, ~500 CE, more authoritative" },
      { left: "Yerushalmi", right: "Compiled in the Land of Israel, ~400 CE" },
      { left: "Both Talmuds", right: "Based on the same Mishnah" },
      { left: "'The Talmud' (unspecified)", right: "Always refers to the Bavli" },
    ],
    explanation: "Key facts about the two Talmuds.",
  },
  {
    id: "tt-sa-001", type: "sa", topic: "two_talmuds", difficulty: 2, onMainTest: true,
    question: "Why are there two Talmuds? What are the components of each? What do they have in common and how are they different? Which is considered authoritative and why?",
    keyPoints: [
      "Two Talmuds because two major Jewish communities (Babylon and Land of Israel) each compiled their own Gemara",
      "Both consist of Mishnah + Gemara",
      "Both are based on the same Mishnah",
      "They have different Gemarot (discussions)",
      "Bavli is compiled ~500 CE in Babylon; Yerushalmi ~400 CE in the Land of Israel",
      "The Bavli is more authoritative — more comprehensive and better edited",
      "'The Talmud' without qualification = the Bavli",
    ],
    modelAnswer:
      "There are two Talmuds because after the destruction of the Second Temple, two major Jewish communities (one in Babylon and one in the Land of Israel) each compiled their own Gemara based on the Mishnah. Both Talmuds have the same structure: Mishnah + Gemara. What they have in common is that they are both based on the same Mishnah. They differ in their Gemara — the discussion of the Mishnah in each community. The Babylonian Talmud (Bavli) was compiled around 500 CE; the Jerusalem Talmud (Yerushalmi) around 400 CE. The Bavli is generally considered the more authoritative Talmud because it is more comprehensive and better edited. When people say 'the Talmud' without specifying, they almost always mean the Bavli.",
  },
  // ================================================================
  // SECTION 10: LAW CODES
  // ================================================================
  {
    id: "lc-mc-001", type: "mc", topic: "law_codes", difficulty: 2, onMainTest: true,
    question: "Why was it necessary for Rambam and Rabbi Karo to create law codes?",
    options: [
      "Because the Mishnah was written in a language people no longer understood",
      "Because the Talmud is vast, disorganized, and scatters conflicting opinions — codes organize laws by topic and give clear rulings",
      "Because the Written Torah had been lost and needed to be reconstructed",
      "Because Jews in different countries needed translations in their local languages",
    ],
    correctIndex: 1,
    explanation: "From the teacher's sample answer: 'The Talmud contains thousands of rabbinic discussions...that often flow randomly from one topic to another. Different and even conflicting opinions...are scattered in multiple places. Law codes organize the laws by topic and offer clear guidance on what people are expected to do.'",
  },
  {
    id: "lc-mc-002", type: "mc", topic: "law_codes", difficulty: 1, onMainTest: true,
    question: "What is the Mishneh Torah?",
    options: [
      "A commentary on the Mishnah written by the Amoraim",
      "Rambam's comprehensive code of all Jewish law organized by topic",
      "The Jerusalem Talmud",
      "A collection of responsa",
    ],
    correctIndex: 1,
    explanation: "The Mishneh Torah is Rambam's law code — a comprehensive, topically organized guide to all of Jewish law.",
  },
  {
    id: "lc-mc-003", type: "mc", topic: "law_codes", difficulty: 1, onMainTest: true,
    question: "To the present day, which law code remains the authoritative guide to traditional Jewish practice?",
    options: ["The Mishneh Torah", "The Shulchan Aruch", "The Bavli", "The Mishnah"],
    correctIndex: 1,
    explanation: "From the teacher's sample answer: 'To the present day, the Shulchan Aruch remains the authoritative guide to traditional Jewish practice.'",
  },
  {
    id: "lc-mc-004", type: "mc", topic: "law_codes", difficulty: 2, onMainTest: true,
    question: "What problem with the Talmud made law codes like the Mishneh Torah necessary?",
    options: [
      "The Talmud was written in Aramaic, which most Jews no longer spoke",
      "The Talmud was extremely expensive to produce",
      "Talmudic discussions flow randomly from topic to topic, and conflicting opinions are scattered throughout",
      "The Talmud contained errors that needed to be corrected",
    ],
    correctIndex: 2,
    explanation: "The Talmud's lack of topical organization and its recording of conflicting opinions without clear rulings made it impractical for everyday guidance — hence the need for codes.",
  },
  {
    id: "lc-tf-001", type: "tf", topic: "law_codes", difficulty: 1, onMainTest: true,
    question: "The Shulchan Aruch remains the authoritative guide to traditional Jewish practice today.",
    isTrue: true,
    explanation: "True. From the teacher's sample answer directly.",
  },
  {
    id: "lc-tf-002", type: "tf", topic: "law_codes", difficulty: 2, onMainTest: true,
    question: "Law codes like the Mishneh Torah were written because the Talmud was too difficult to understand.",
    isTrue: false,
    explanation: "False (or at least incomplete). The main problem was organization — the Talmud is disorganized, scatters laws by topic randomly, and records conflicting opinions without giving clear rulings.",
  },
  {
    id: "lc-fib-001", type: "fib", topic: "law_codes", difficulty: 2, onMainTest: true,
    question: "Law codes like the Mishneh Torah and Shulchan Aruch organize laws by ___ and offer clear ___ on what people are expected to do.",
    blanks: ["topic", "guidance"],
    acceptableAnswers: [["topic", "subject", "category"], ["guidance", "rulings", "instructions"]],
    explanation: "This is directly from the teacher's sample answer for the law codes essay question.",
  },
  {
    id: "lc-sa-001", type: "sa", topic: "law_codes", difficulty: 2, onMainTest: true,
    question: "Why was it necessary for rabbis such as Rambam or Joseph Karo to create codes such as the Mishneh Torah or the Shulchan Aruch?",
    keyPoints: [
      "The Talmud contains thousands of discussions that flow randomly from topic to topic",
      "Conflicting opinions on the same topic are scattered in multiple places",
      "Law codes organize laws by topic",
      "Law codes offer clear guidance/rulings on what people are expected to do",
      "The Shulchan Aruch remains authoritative today",
    ],
    modelAnswer:
      "The Talmud contains thousands of rabbinic discussions on a variety of subjects that often flow randomly from one topic to another. Different and even conflicting opinions on a particular topic of Jewish law are often scattered in multiple places within the Mishnah and/or Gemara. Law codes like Rambam's Mishneh Torah and Rabbi Karo's Shulchan Aruch are necessary in order to organize the laws by topic and offer clear guidance on what people are expected to do (or not do) in the course of their daily lives. To the present day, the Shulchan Aruch remains the authoritative guide to traditional Jewish practice.",
    hint: "Think about how the Talmud is structured and what problems that creates for someone who just wants to know: 'What am I supposed to do?'",
  },
  // ================================================================
  // SECTION 11: RESPONSA (SHE'ELOT U'TESHUVOT)
  // ================================================================
  {
    id: "resp-mc-001", type: "mc", topic: "responsa", difficulty: 1, onMainTest: true,
    question: "What is the Hebrew term for Responsa literature?",
    options: ["Machloket", "She'elot u'Teshuvot", "Baraita", "Mishneh Torah"],
    correctIndex: 1,
    explanation: "She'elot u'Teshuvot = Questions and Answers = Responsa.",
  },
  {
    id: "resp-mc-002", type: "mc", topic: "responsa", difficulty: 2, onMainTest: true,
    question: "What are Responsa (She'elot u'Teshuvot)?",
    options: [
      "A prayer recited before studying Torah",
      "Written legal decisions given by rabbinic authorities in response to submitted questions",
      "The oral debates recorded in the Talmud",
      "A type of Passover Haggadah",
    ],
    correctIndex: 1,
    explanation: "Responsa are written rabbinic rulings given in response to questions about Jewish law. They cover everything from ancient to ultra-modern topics.",
  },
  {
    id: "resp-mc-003", type: "mc", topic: "responsa", difficulty: 2, onMainTest: true,
    question: "According to class, Responsa literature can address modern topics such as:",
    options: [
      "Only agricultural laws and Temple service",
      "Only Shabbat and holiday laws",
      "Everything from immunizations to escalators on Shabbat",
      "Only marriage and divorce",
    ],
    correctIndex: 2,
    explanation: "From the BimBam video: Responsa 'cover everything from immunizations to gambling to escalators' — showing how Jewish law continues to develop.",
  },
  {
    id: "resp-tf-001", type: "tf", topic: "responsa", difficulty: 1, onMainTest: true,
    question: "She'elot u'Teshuvot is another name for Responsa literature.",
    isTrue: true,
    explanation: "True. She'elot = questions; Teshuvot = answers/responses.",
  },
  {
    id: "resp-fib-001", type: "fib", topic: "responsa", difficulty: 1, onMainTest: true,
    question: "She'elot u'Teshuvot means '___ and ___.'",
    blanks: ["Questions", "Answers"],
    acceptableAnswers: [["questions"], ["answers", "responses"]],
    explanation: "She'elot = questions. Teshuvot = answers/responses.",
  },
  // ================================================================
  // SECTION 12: ORAL LAW & TEFILLIN
  // ================================================================
  {
    id: "tef-mc-001", type: "mc", topic: "tefillin", difficulty: 1, onMainTest: true,
    question: "What does the Written Torah say about Tefillin?",
    options: [
      "It specifies black leather boxes, four passages, and exact placement on arm and head",
      "It says to bind the words as a sign on your hand and as frontlets between your eyes — but gives no further details",
      "It says to wear a special garment on your arm every morning",
      "It says to pray three times a day with a special item",
    ],
    correctIndex: 1,
    explanation: "The Written Torah (Devarim 6:8) says 'bind them as a sign on your hand and as frontlets between your eyes' — but does NOT say what object to use, what's inside it, how to make it, or exactly where to wear it.",
  },
  {
    id: "tef-mc-002", type: "mc", topic: "tefillin", difficulty: 2, onMainTest: true,
    question: "Which of the following details about Tefillin comes from the ORAL Torah (not the written)?",
    options: [
      "'Bind them as a sign on your hand'",
      "'As frontlets between your eyes'",
      "Black leather boxes containing four specific Torah passages written on parchment",
      "'These words which I command you today shall be on your heart'",
    ],
    correctIndex: 2,
    explanation: "The Oral Torah specifies: black leather boxes, the four specific passages inside (Kadesh, V'haya ki yeviacha, Shema, V'haya im shamoa), placement on the left arm near the heart, placement on the head between the eyes, and specific knots/straps.",
  },
  {
    id: "tef-mc-003", type: "mc", topic: "tefillin", difficulty: 2, onMainTest: true,
    question: "How many Torah passages are contained inside the Tefillin boxes, according to the Oral Law?",
    options: ["2", "3", "4", "10"],
    correctIndex: 2,
    explanation: "The Oral Torah specifies four passages: Kadesh (Exodus 13:1-10), V'haya ki yeviacha (Exodus 13:11-16), Shema (Deuteronomy 6:4-9), and V'haya im shamoa (Deuteronomy 11:13-21).",
  },
  {
    id: "tef-mc-004", type: "mc", topic: "tefillin", difficulty: 3, onMainTest: true,
    question: "What is the most important lesson the Tefillin example teaches about the relationship between Written and Oral Torah?",
    options: [
      "The Written Torah is unnecessary — only the Oral Torah matters",
      "Without the Oral Torah, many Written Torah commandments would be impossible to observe because they lack practical details",
      "The Oral Torah was written down before the Written Torah",
      "Tefillin is only required for rabbis",
    ],
    correctIndex: 1,
    explanation: "The Tefillin example shows that without the Oral Torah's practical details, one could not actually observe the commandment. The Written Torah gives the 'what'; the Oral Torah gives the 'how.'",
  },
  {
    id: "tef-tf-001", type: "tf", topic: "tefillin", difficulty: 2, onMainTest: true,
    question: "The Written Torah specifies that Tefillin must be made from black leather.",
    isTrue: false,
    explanation: "False. The Written Torah only says to 'bind them as a sign.' The requirement for black leather boxes comes from the Oral Torah.",
  },
  {
    id: "tef-tf-002", type: "tf", topic: "tefillin", difficulty: 2, onMainTest: true,
    question: "The Oral Torah specifies which four Torah passages are placed inside the Tefillin boxes.",
    isTrue: true,
    explanation: "True. The Oral Torah identifies the four specific passages: Kadesh, V'haya ki yeviacha, Shema, and V'haya im shamoa.",
  },
  {
    id: "tef-fib-001", type: "fib", topic: "tefillin", difficulty: 2, onMainTest: true,
    question: "The Written Torah says to 'bind them as a ___ on your hand and as frontlets between your ___,' but does not specify what object to use or how to make it.",
    blanks: ["sign", "eyes"],
    acceptableAnswers: [["sign", "symbol", "reminder"], ["eyes"]],
    explanation: "This is the Written Torah verse (Devarim 6:8) that commands Tefillin — it is deliberately vague, requiring Oral Torah to explain.",
  },
  {
    id: "tef-sa-001", type: "sa", topic: "tefillin", difficulty: 2, onMainTest: true,
    question: "Explain how the Oral Law builds on what is found in the Written Law regarding the laws about Tefillin.",
    keyPoints: [
      "Written Torah says: 'bind them as a sign on your hand and as frontlets between your eyes' (Devarim 6:8)",
      "Written Torah does NOT specify what the object is, what is inside it, what material to use, or exactly where on the body",
      "Oral Torah specifies: black leather boxes",
      "Oral Torah specifies: four Torah passages inside (Kadesh, V'haya ki yeviacha, Shema, V'haya im shamoa)",
      "Oral Torah specifies: placement on the left arm (near the heart) for right-handed people",
      "Oral Torah specifies: placement on the head between the eyes",
      "Oral Torah specifies: specific knots and straps",
    ],
    modelAnswer:
      "The Written Torah (Deuteronomy 6:8) commands Jews to 'bind them as a sign on your hand and as frontlets between your eyes.' However, the Written Torah does not specify what object to use, what material it should be made of, what should go inside it, or exactly how and where to wear it. The Oral Torah fills in all of these details: Tefillin consist of black leather boxes containing parchment with four specific Torah passages written on them (Kadesh, V'haya ki yeviacha, the Shema, and V'haya im shamoa). The arm-Tefillin is placed on the left arm near the heart (for a right-handed person), and the head-Tefillin is placed between the eyes at the hairline. The straps and specific knots are also specified by the Oral Torah. Without the Oral Torah, the Written Torah commandment would be impossible to observe because there would be no way to know what it means in practice.",
    hint: "Start with the Written Torah verse. Then explain everything the Oral Torah adds.",
  },
  // ================================================================
  // SECTION 13: ORAL LAW & MILK AND MEAT
  // ================================================================
  {
    id: "mm-mc-001", type: "mc", topic: "milk_meat", difficulty: 1, onMainTest: true,
    question: "What does the Written Torah say about milk and meat?",
    options: [
      "It forbids eating any meat with any dairy product",
      "It says 'do not boil a kid in its mother's milk' — but gives no further detail",
      "It requires separate dishes for meat and dairy",
      "It requires a waiting period of six hours between meat and dairy",
    ],
    correctIndex: 1,
    explanation: "The Written Torah says 'You shall not boil a kid in its mother's milk' (Exodus 23:19, 34:26, and Deuteronomy 14:21 — it appears three times). It does not explain what this means in practice.",
  },
  {
    id: "mm-mc-002", type: "mc", topic: "milk_meat", difficulty: 2, onMainTest: true,
    question: "How many times does the prohibition 'do not boil a kid in its mother's milk' appear in the Written Torah?",
    options: ["Once", "Twice", "Three times", "Five times"],
    correctIndex: 2,
    explanation: "The verse appears three times: Exodus 23:19, Exodus 34:26, and Deuteronomy 14:21. The rabbis interpreted the repetition as signifying three separate prohibitions.",
  },
  {
    id: "mm-mc-003", type: "mc", topic: "milk_meat", difficulty: 2, onMainTest: true,
    question: "Which of the following is an Oral Torah extension of the milk and meat prohibition?",
    options: [
      "'Do not boil a kid in its mother's milk'",
      "Forbidding any combination of meat and dairy — not just a kid boiled in its own mother's milk",
      "Forbidding the eating of pork",
      "Requiring that animals be slaughtered in a specific way",
    ],
    correctIndex: 1,
    explanation: "The Oral Torah extends the Written Torah's specific prohibition to cover ALL combinations of meat and dairy, not just the narrow case of a baby goat in its own mother's milk.",
  },
  {
    id: "mm-mc-004", type: "mc", topic: "milk_meat", difficulty: 2, onMainTest: true,
    question: "According to the Oral Torah, what must be done about dishes and utensils used for meat and dairy?",
    options: [
      "They must be washed in the same way",
      "They must be kept completely separate — separate sets for meat and dairy",
      "They only need to be separated on Shabbat",
      "They can be shared as long as they are washed in between",
    ],
    correctIndex: 1,
    explanation: "The Oral Torah requires completely separate sets of dishes, pots, and utensils for meat and dairy.",
  },
  {
    id: "mm-mc-005", type: "mc", topic: "milk_meat", difficulty: 2, onMainTest: true,
    question: "The requirement to wait a period of time after eating meat before eating dairy comes from:",
    options: [
      "The Written Torah explicitly",
      "The Oral Torah — it is not specified in the Written Torah",
      "The Shulchan Aruch but not the Talmud",
      "Modern medical advice adapted into Jewish law",
    ],
    correctIndex: 1,
    explanation: "The Written Torah says nothing about waiting times. The requirement to wait between meat and dairy is an Oral Torah tradition.",
  },
  {
    id: "mm-tf-001", type: "tf", topic: "milk_meat", difficulty: 2, onMainTest: true,
    question: "The Written Torah forbids eating any combination of meat and dairy.",
    isTrue: false,
    explanation: "False. The Written Torah only says 'do not boil a kid in its mother's milk.' The broader prohibition of all meat-dairy combinations comes from the Oral Torah.",
  },
  {
    id: "mm-tf-002", type: "tf", topic: "milk_meat", difficulty: 2, onMainTest: true,
    question: "The requirement to use separate dishes for meat and dairy comes from the Oral Torah, not the Written Torah.",
    isTrue: true,
    explanation: "True. The Written Torah says nothing about separate dishes. This requirement is an Oral Torah tradition.",
  },
  {
    id: "mm-tf-003", type: "tf", topic: "milk_meat", difficulty: 2, onMainTest: true,
    question: "The phrase 'do not boil a kid in its mother's milk' appears once in the Torah.",
    isTrue: false,
    explanation: "False. It appears three times (Exodus 23:19, Exodus 34:26, Deuteronomy 14:21). The rabbis used each repetition to derive a separate prohibition.",
  },
  {
    id: "mm-fib-001", type: "fib", topic: "milk_meat", difficulty: 2, onMainTest: true,
    question: "The Written Torah says '___ ___ a kid in its mother's milk.' The Oral Torah extends this to forbid any combination of ___ and ___.",
    blanks: ["do not boil", "meat", "dairy"],
    acceptableAnswers: [["do not boil", "you shall not boil", "don't boil"], ["meat"], ["dairy", "milk", "dairy products"]],
    explanation: "The Written Torah has a narrow rule; the Oral Torah broadens it.",
  },
  {
    id: "mm-sa-001", type: "sa", topic: "milk_meat", difficulty: 2, onMainTest: true,
    question: "Explain how the Oral Law builds on what is found in the Written Law regarding the laws about the separation of milk and meat.",
    keyPoints: [
      "Written Torah: 'Do not boil a kid in its mother's milk' (appears three times)",
      "Written Torah gives no further detail beyond this one narrow prohibition",
      "Oral Torah extends it to: forbid ANY combination of meat and dairy",
      "Oral Torah adds: requirement for separate dishes and utensils for meat and dairy",
      "Oral Torah adds: a waiting period after eating meat before eating dairy",
    ],
    modelAnswer:
      "The Written Torah states 'Do not boil a kid in its mother's milk,' a phrase that appears three times (Exodus 23:19, 34:26, and Deuteronomy 14:21). On its own, this verse only prohibits one very specific act — cooking a young goat in its own mother's milk. The Oral Torah dramatically expands this into a comprehensive system: it forbids any combination of meat and dairy (not just a kid in its mother's milk), requires separate sets of dishes and utensils for meat and dairy foods, and adds a waiting period between eating meat and eating dairy. None of these additional requirements appear explicitly in the Written Torah — they come entirely from the Oral Torah tradition.",
    hint: "Start with what the Written Torah actually says. Then list what the Oral Torah adds.",
  },
  // ================================================================
  // SECTION 14: RAMBAM vs. RAV SAADIAH GAON
  // ================================================================
  {
    id: "sg-mc-001", type: "mc", topic: "saadiah_rambam", difficulty: 2, onMainTest: true,
    question: "What is Rambam's position on the origin and development of the Oral Torah?",
    options: [
      "The Oral Torah developed gradually through rabbinic interpretation over centuries",
      "The Oral Torah was given in its entirety to Moses at Sinai alongside the Written Torah",
      "The Oral Torah was invented by the Tanna'im to fill gaps in the Written Torah",
      "The Oral Torah was given to the Prophets, not to Moses",
    ],
    correctIndex: 1,
    explanation: "Rambam holds that the entire Oral Torah was given to Moses at Sinai. Rabbi Yehudah compiled it, but he did not create new law — he recorded what was already transmitted.",
  },
  {
    id: "sg-mc-002", type: "mc", topic: "saadiah_rambam", difficulty: 2, onMainTest: true,
    question: "What is Rav Saadiah Gaon's position on the development of the Oral Torah?",
    options: [
      "The Oral Torah was given in its entirety at Sinai and never developed after that",
      "The Oral Torah was revealed only to the Prophets, not to Moses",
      "The Oral Torah developed and evolved over time through rabbinic interpretation and extrapolation",
      "The Oral Torah is entirely a human invention with no divine basis",
    ],
    correctIndex: 2,
    explanation: "Saadiah Gaon holds that the Oral Torah developed over time — the rabbis used their knowledge of the Written Torah to derive and interpret new applications through each generation.",
  },
  {
    id: "sg-mc-003", type: "mc", topic: "saadiah_rambam", difficulty: 3, onMainTest: true,
    question: "What is the main point of DISAGREEMENT between Rambam and Saadiah Gaon?",
    options: [
      "Whether the Oral Torah was given at Sinai or developed over time",
      "Whether Jews should study Talmud or only the Written Torah",
      "Whether the Bavli or Yerushalmi is more authoritative",
      "Whether the Mishnah should be written down or kept oral",
    ],
    correctIndex: 0,
    explanation: "The core disagreement: Rambam = Oral Torah given entirely at Sinai (static divine origin). Saadiah = Oral Torah developed through human interpretation over generations.",
  },
  {
    id: "sg-mc-004", type: "mc", topic: "saadiah_rambam", difficulty: 3, onMainTest: true,
    question: "According to Rambam, when Rabbi Yehudah HaNasi compiled the Mishnah, what was he doing?",
    options: [
      "Creating new Jewish law based on the needs of his generation",
      "Recording and organizing oral traditions that had already been given at Sinai",
      "Interpreting the Written Torah in new ways",
      "Disagreeing with earlier rulings and updating them",
    ],
    correctIndex: 1,
    explanation: "According to Rambam, Rabbi Yehudah was not creating new law — he was recording oral traditions that traced all the way back to Sinai. The content was already there; he just wrote it down.",
  },
  {
    id: "sg-tf-001", type: "tf", topic: "saadiah_rambam", difficulty: 2, onMainTest: true,
    question: "Rambam and Rav Saadiah Gaon agree that the Oral Torah was given at Sinai.",
    isTrue: false,
    explanation: "False. This is their KEY disagreement. Rambam: given at Sinai. Saadiah: developed over time.",
  },
  {
    id: "sg-tf-002", type: "tf", topic: "saadiah_rambam", difficulty: 2, onMainTest: true,
    question: "Rav Saadiah Gaon believed the Oral Torah evolved over time through rabbinic interpretation.",
    isTrue: true,
    explanation: "True. Saadiah's position is that the Oral Torah developed through the generations via rabbinic learning and interpretation.",
  },
  {
    id: "sg-tf-003", type: "tf", topic: "saadiah_rambam", difficulty: 2, onMainTest: true,
    question: "According to Rambam, the rabbis invented the Oral Torah themselves based on their own reasoning.",
    isTrue: false,
    explanation: "False. Rambam believes the Oral Torah was received at Sinai. The rabbis transmitted it — they did not invent it.",
  },
  {
    id: "sg-match-001", type: "match", topic: "saadiah_rambam", difficulty: 2, onMainTest: true,
    question: "Match each position to the correct scholar.",
    pairs: [
      { left: "Oral Torah given entirely at Sinai alongside the Written Torah", right: "Rambam" },
      { left: "Oral Torah developed over time through rabbinic interpretation", right: "Rav Saadiah Gaon" },
    ],
    explanation: "Core comparison: Rambam = static (given at Sinai). Saadiah = dynamic (developed over time).",
  },
  {
    id: "sg-fib-001", type: "fib", topic: "saadiah_rambam", difficulty: 2, onMainTest: true,
    question: "Rambam believes the Oral Torah was given in its entirety at ___, while Saadiah Gaon believes it ___ over time.",
    blanks: ["Sinai", "developed"],
    acceptableAnswers: [["sinai", "mount sinai"], ["developed", "evolved", "grew", "changed"]],
    explanation: "The central distinction between the two positions.",
  },
  {
    id: "sg-sa-001", type: "sa", topic: "saadiah_rambam", difficulty: 2, onMainTest: true,
    question: "Compare Rambam's and Rav Saadiah Gaon's positions on the development of the Oral Torah.",
    keyPoints: [
      "Rambam: Oral Torah given in its entirety at Sinai alongside the Written Torah",
      "Rambam: Rabbi Yehudah recorded existing traditions — he did not create new law",
      "Saadiah Gaon: Oral Torah developed over time through rabbinic interpretation",
      "Saadiah: Rabbis derived new applications from the Written Torah across generations",
    ],
    modelAnswer:
      "Rambam and Rav Saadiah Gaon disagree on a fundamental question: was the Oral Torah given at Sinai, or did it develop over time? Rambam holds that the entire Oral Torah was revealed to Moses at Mount Sinai alongside the Written Torah. When Rabbi Yehudah HaNasi compiled the Mishnah, he was not creating new law — he was simply recording and organizing oral traditions that already traced their origin back to the Sinai revelation. Rav Saadiah Gaon, on the other hand, believes the Oral Torah developed gradually over generations. The rabbis used their knowledge of the Written Torah to interpret, extrapolate, and derive new legal applications as new situations arose. For Saadiah, the Oral Torah is not a static collection given all at once — it evolved through the work of the rabbis over many centuries.",
    hint: "Key contrast: Did it all come from Sinai (Rambam) or did it grow over time (Saadiah)?",
  },
  // ================================================================
  // SECTION 15: SIX ORDERS OF THE MISHNAH
  // (onMainTest: false — these are for the DEMO, not the main test)
  // ================================================================
  {
    id: "six-mc-001", type: "mc", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Which Seder of the Mishnah deals with agricultural laws and prayers?",
    options: ["Mo'ed", "Zera'im", "Nashim", "Nezikin"],
    correctIndex: 1,
    explanation: "Zera'im (Seeds) = agricultural laws, tithes, and prayers.",
  },
  {
    id: "six-mc-002", type: "mc", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Which Seder covers Shabbat and holiday laws?",
    options: ["Zera'im", "Nashim", "Mo'ed", "Tohorot"],
    correctIndex: 2,
    explanation: "Mo'ed (Appointed Times / Festivals) = Shabbat, holidays, and the Jewish calendar.",
  },
  {
    id: "six-mc-003", type: "mc", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Which Seder deals with marriage, divorce, and family law?",
    options: ["Nashim", "Nezikin", "Kodashim", "Mo'ed"],
    correctIndex: 0,
    explanation: "Nashim (Women) = marriage, divorce, and family law.",
  },
  {
    id: "six-mc-004", type: "mc", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Which Seder covers civil and criminal law, including damages?",
    options: ["Zera'im", "Tohorot", "Nashim", "Nezikin"],
    correctIndex: 3,
    explanation: "Nezikin (Damages) = civil and criminal law, courts, and torts.",
  },
  {
    id: "six-mc-005", type: "mc", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Which Seder covers Temple service and sacrifices?",
    options: ["Tohorot", "Kodashim", "Mo'ed", "Nezikin"],
    correctIndex: 1,
    explanation: "Kodashim (Holy Things) = Temple service, sacrifices, and sacred objects.",
  },
  {
    id: "six-mc-006", type: "mc", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Which Seder deals with ritual purity and impurity?",
    options: ["Tohorot", "Zera'im", "Nashim", "Kodashim"],
    correctIndex: 0,
    explanation: "Tohorot (Purities) = ritual purity and impurity laws.",
  },
  {
    id: "six-mc-007", type: "mc", topic: "six_orders", difficulty: 2, onMainTest: false,
    question: "What does 'Zera'im' mean in English?",
    options: ["Festivals", "Seeds", "Women", "Holy Things"],
    correctIndex: 1,
    explanation: "Zera'im = Seeds — referring to agricultural laws.",
  },
  {
    id: "six-mc-008", type: "mc", topic: "six_orders", difficulty: 2, onMainTest: false,
    question: "What does 'Mo'ed' mean in English?",
    options: ["Damages", "Women", "Appointed Times / Festivals", "Seeds"],
    correctIndex: 2,
    explanation: "Mo'ed = Appointed Times — referring to the Shabbat and Jewish holidays.",
  },
  {
    id: "six-mc-009", type: "mc", topic: "six_orders", difficulty: 2, onMainTest: false,
    question: "What does 'Nezikin' mean in English?",
    options: ["Holy Things", "Purities", "Women", "Damages"],
    correctIndex: 3,
    explanation: "Nezikin = Damages — referring to civil and criminal law.",
  },
  {
    id: "six-mc-010", type: "mc", topic: "six_orders", difficulty: 2, onMainTest: false,
    question: "What does 'Kodashim' mean in English?",
    options: ["Seeds", "Purities", "Holy Things", "Festivals"],
    correctIndex: 2,
    explanation: "Kodashim = Holy Things — referring to Temple-related laws.",
  },
  {
    id: "six-mc-011", type: "mc", topic: "six_orders", difficulty: 2, onMainTest: false,
    question: "What does 'Tohorot' mean in English?",
    options: ["Damages", "Purities", "Women", "Holy Things"],
    correctIndex: 1,
    explanation: "Tohorot = Purities — referring to ritual purity laws.",
  },
  {
    id: "six-mc-012", type: "mc", topic: "six_orders", difficulty: 2, onMainTest: false,
    question: "What does 'Nashim' mean in English?",
    options: ["Seeds", "Women", "Purities", "Appointed Times"],
    correctIndex: 1,
    explanation: "Nashim = Women — referring to laws of marriage, divorce, and family.",
  },
  {
    id: "six-tf-001", type: "tf", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Zera'im covers agricultural laws.",
    isTrue: true,
    explanation: "True. Zera'im (Seeds) = agricultural laws, tithes, and related prayers.",
  },
  {
    id: "six-tf-002", type: "tf", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Nashim deals with Temple service and sacrifices.",
    isTrue: false,
    explanation: "False. Nashim = women/family law. Temple service = Kodashim.",
  },
  {
    id: "six-tf-003", type: "tf", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Mo'ed covers laws about festivals and the Sabbath.",
    isTrue: true,
    explanation: "True. Mo'ed (Appointed Times) = Shabbat and holiday laws.",
  },
  {
    id: "six-tf-004", type: "tf", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Nezikin deals with ritual purity laws.",
    isTrue: false,
    explanation: "False. Nezikin = damages/civil and criminal law. Ritual purity = Tohorot.",
  },
  {
    id: "six-tf-005", type: "tf", topic: "six_orders", difficulty: 2, onMainTest: false,
    question: "Tohorot is the sixth and final Seder of the Mishnah.",
    isTrue: true,
    explanation: "True. The six Sedarim in order: Zera'im, Mo'ed, Nashim, Nezikin, Kodashim, Tohorot.",
  },
  {
    id: "six-match-001", type: "match", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Match each Seder to its English meaning.",
    pairs: [
      { left: "Zera'im", right: "Seeds" },
      { left: "Mo'ed", right: "Appointed Times / Festivals" },
      { left: "Nashim", right: "Women" },
      { left: "Nezikin", right: "Damages" },
      { left: "Kodashim", right: "Holy Things" },
      { left: "Tohorot", right: "Purities" },
    ],
    explanation: "The six orders of the Mishnah and their English meanings.",
  },
  {
    id: "six-match-002", type: "match", topic: "six_orders", difficulty: 1, onMainTest: false,
    question: "Match each Seder to its subject area.",
    pairs: [
      { left: "Zera'im", right: "Agricultural laws and tithes" },
      { left: "Mo'ed", right: "Shabbat and holiday laws" },
      { left: "Nashim", right: "Marriage, divorce, family law" },
      { left: "Nezikin", right: "Civil and criminal law" },
      { left: "Kodashim", right: "Temple service and sacrifices" },
      { left: "Tohorot", right: "Ritual purity and impurity" },
    ],
    explanation: "The six orders and their topic areas.",
  },
  {
    id: "six-order-001", type: "order", topic: "six_orders", difficulty: 2, onMainTest: false,
    question: "Put the Six Orders of the Mishnah in their correct order (first to last):",
    items: ["Zera'im", "Mo'ed", "Nashim", "Nezikin", "Kodashim", "Tohorot"],
    explanation: "The traditional order: Zera'im → Mo'ed → Nashim → Nezikin → Kodashim → Tohorot.",
  },
  {
    id: "six-fib-001", type: "fib", topic: "six_orders", difficulty: 2, onMainTest: false,
    question: "The Six Orders of the Mishnah are: ___, Mo'ed, ___, Nezikin, ___, Tohorot.",
    blanks: ["Zera'im", "Nashim", "Kodashim"],
    acceptableAnswers: [["zera'im", "zeraim"], ["nashim"], ["kodashim"]],
    explanation: "Fill in the three missing Sedarim in order.",
  },
  // ================================================================
  // SECTION 16: MIXED / CROSS-TOPIC QUESTIONS
  // (Tests ability to connect concepts across the unit)
  // ================================================================
  {
    id: "mix-mc-001", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Which of the following is the correct order from MOST general to MOST specific?",
    options: [
      "Masechet → Seder → Talmud",
      "Talmud → Seder → Masechet",
      "Seder → Talmud → Masechet",
      "Masechet → Talmud → Seder",
    ],
    correctIndex: 1,
    explanation: "Talmud (the whole thing) → Seder (one of six orders) → Masechet (a tractate within a Seder). Like: Bible → Book → Chapter.",
  },
  {
    id: "mix-mc-002", type: "mc", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Which of the following correctly pairs each text with its type?",
    options: [
      "Mishnah = Written Torah; Gemara = Oral Torah",
      "Shulchan Aruch = Written Torah; Mishnah = Oral Torah",
      "Mishnah = Oral Torah; Shulchan Aruch = Law Code derived from the Oral Torah",
      "Talmud = Written Torah; Tanach = Oral Torah",
    ],
    correctIndex: 2,
    explanation: "The Mishnah is part of the Oral Torah. The Shulchan Aruch is a law code based on the Oral Torah. The Tanach is the Written Torah.",
  },
  {
    id: "mix-mc-003", type: "mc", topic: "vocab", difficulty: 3, onMainTest: true,
    question: "A student says: 'I just finished learning the first Masechet of Seder Nashim in the Bavli.' What does this mean?",
    options: [
      "They finished a chapter about women in the Jerusalem Talmud",
      "They finished one tractate in the 'Women' order of the Babylonian Talmud",
      "They finished the entire 'Women' order of the Babylonian Talmud",
      "They finished studying the Shulchan Aruch's section on marriage law",
    ],
    correctIndex: 1,
    explanation: "Masechet = one tractate. Nashim = the 'Women' order. Bavli = Babylonian Talmud. So: one tractate within the Women's order of the Babylonian Talmud.",
  },
  {
    id: "mix-tf-001", type: "tf", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "The Gemara was written before the Mishnah.",
    isTrue: false,
    explanation: "False. The Mishnah was compiled first (c. 200 CE by Rabbi Yehudah HaNasi). The Gemara was compiled later — Yerushalmi c. 400 CE, Bavli c. 500 CE.",
  },
  {
    id: "mix-tf-002", type: "tf", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "The Shulchan Aruch is part of the Oral Torah.",
    isTrue: false,
    explanation: "False (or at least oversimplified). The Shulchan Aruch is a law code based on the Oral Torah — but it is not considered part of the Oral Torah itself. It is a medieval compilation.",
  },
  {
    id: "mix-tf-003", type: "tf", topic: "vocab", difficulty: 3, onMainTest: true,
    question: "The Talmud records both the opinions of the Tana'im (in the Mishnah) and the Amoraim (in the Gemara).",
    isTrue: true,
    explanation: "True. The Talmud = Mishnah (Tana'im) + Gemara (Amoraim).",
  },
  {
    id: "mix-match-001", type: "match", topic: "vocab", difficulty: 2, onMainTest: true,
    question: "Put the following texts in order from EARLIEST compilation to LATEST.",
    pairs: [
      { left: "1st (earliest)", right: "Mishnah (~200 CE)" },
      { left: "2nd", right: "Yerushalmi (~400 CE)" },
      { left: "3rd", right: "Bavli (~500 CE)" },
      { left: "4th (latest)", right: "Shulchan Aruch (1565 CE)" },
    ],
    explanation: "Chronological order: Mishnah → Yerushalmi → Bavli → Shulchan Aruch.",
  },
]; // end questionBank
// ================================================================
// ESSAY QUESTIONS
// (Used in Essay Builder mode)
// ================================================================
export interface EssayQuestion {
  id: string;
  topic: TopicTag;
  prompt: string;
  rubric: string[];
  modelAnswer: string;
}
export const essayQuestions: EssayQuestion[] = [
  {
    id: "essay-tefillin",
    topic: "tefillin",
    prompt: "Explain how the Oral Law builds on what is found in the Written Law regarding the laws about Tefillin.",
    rubric: [
      "States the relevant Written Torah verse (Deuteronomy 6:8 — 'bind them as a sign on your hand and as frontlets between your eyes')",
      "Notes that the Written Torah does NOT specify the object, material, contents, or exact placement",
      "Explains that the Oral Torah specifies: black leather boxes",
      "Explains that the Oral Torah specifies: four Torah passages inside (Kadesh, V'haya ki yeviacha, Shema, V'haya im shamoa)",
      "Explains that the Oral Torah specifies: placement on the left arm (near the heart) and on the head between the eyes",
      "Makes the broader point: without the Oral Torah, the Written Torah commandment would be impossible to fulfill",
    ],
    modelAnswer:
      "The Written Torah (Deuteronomy 6:8) commands Jews to 'bind them as a sign on your hand and as frontlets between your eyes.' However, this verse does not specify what object to use, what it should be made of, what should go inside it, or exactly where and how to wear it. The Oral Torah fills in all of these practical details: Tefillin consist of black leather boxes containing small scrolls of parchment. The Oral Torah specifies that four specific Torah passages are written on these scrolls: Kadesh (Exodus 13:1-10), V'haya ki yeviacha (Exodus 13:11-16), the Shema (Deuteronomy 6:4-9), and V'haya im shamoa (Deuteronomy 11:13-21). The Oral Torah further specifies that the arm-Tefillin is placed on the left arm near the heart, and the head-Tefillin is placed between the eyes at the hairline, with specific knots and straps. Without these Oral Torah details, the Written Torah commandment would be completely impossible to observe in practice.",
  },
  {
    id: "essay-milk-meat",
    topic: "milk_meat",
    prompt: "Explain how the Oral Law builds on what is found in the Written Law regarding the laws about the separation of milk and meat.",
    rubric: [
      "States the Written Torah verse: 'Do not boil a kid in its mother's milk' (appears three times)",
      "Notes that the Written Torah gives no further detail",
      "Explains that the Oral Torah extends the prohibition to any combination of meat and dairy",
      "Explains that the Oral Torah adds the requirement for separate dishes/utensils for meat and dairy",
      "Explains that the Oral Torah adds a waiting period between eating meat and dairy",
      "Makes the broader point: the Written Torah is narrow; the Oral Torah dramatically expands it",
    ],
    modelAnswer:
      "The Written Torah states 'Do not boil a kid in its mother's milk' — a phrase that appears three times (Exodus 23:19, 34:26, and Deuteronomy 14:21). On its own, this verse only prohibits one narrow act: cooking a young goat in its own mother's milk. The Oral Torah dramatically expands this into a comprehensive system of laws. First, it extends the prohibition to cover any combination of meat and dairy — not just a kid in its mother's milk. Second, the Oral Torah requires completely separate sets of dishes and utensils for meat and dairy foods. Third, it adds a waiting period between eating meat and eating dairy. None of these additional requirements appear in the Written Torah — they come entirely from the Oral Torah tradition. This example powerfully illustrates how the Oral Torah transforms a brief, narrow Written Torah prohibition into a detailed, practical system of law.",
  },
  {
    id: "essay-5-reasons",
    topic: "rabbi_yehudah",
    prompt: "List five reasons that led Rabbi Yehudah HaNasi to compile and write down the Oral Law.",
    rubric: [
      "The number of disciples was declining",
      "Fresh calamities kept occurring (disrupting Torah study)",
      "The Roman government was expanding / persecution was increasing",
      "Jews were being dispersed / exiled to distant lands",
      "A portable handbook was needed",
    ],
    modelAnswer:
      "According to Rambam, Rabbi Yehudah HaNasi wrote down the Oral Torah for five reasons: (1) The number of students learning Torah was declining, making reliable oral transmission increasingly difficult. (2) Fresh calamities kept occurring — ongoing persecution and upheaval disrupted Torah study and weakened the chain of transmission. (3) The Roman government was becoming increasingly powerful and oppressive, threatening the Jewish community's ability to maintain Torah study. (4) Jews were being dispersed and exiled to distant lands, making it impossible for them to gather and learn from the same teachers. (5) Rabbi Yehudah felt the Jewish people needed a portable handbook — a written text they could carry with them and consult regardless of where they were.",
  },
  {
    id: "essay-law-codes",
    topic: "law_codes",
    prompt: "Why was it necessary for rabbis such as Rambam or Joseph Karo to create codes such as the Mishneh Torah or the Shulchan Aruch?",
    rubric: [
      "The Talmud is vast and contains thousands of discussions",
      "Talmudic discussions flow randomly from topic to topic",
      "Conflicting/different opinions on the same topic are scattered throughout the Talmud",
      "Law codes organize laws by topic",
      "Law codes give clear guidance on what people are expected to do",
      "The Shulchan Aruch remains the authoritative guide to traditional Jewish practice today",
    ],
    modelAnswer:
      "The Talmud contains thousands of rabbinic discussions on a variety of subjects that often flow randomly from one topic to another. Different and even conflicting opinions on a particular topic of Jewish law are often scattered in multiple places within the Mishnah and/or Gemara. Law codes like Rambam's Mishneh Torah and Rabbi Karo's Shulchan Aruch are necessary in order to organize the laws by topic and offer clear guidance on what people are expected to do (or not do) in the course of their daily lives. To the present day, the Shulchan Aruch remains the authoritative guide to traditional Jewish practice.",
  },
];