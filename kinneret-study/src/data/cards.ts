export interface Card {
  id: string;
  category: string;
  hebrew?: string;
  transliteration: string;
  term: string;
  definition: string;
  extendedNotes: string;
  mnemonicHint: string;
  relatedCards: string[];
  tag: string;
}

export const cards: Card[] = [
  // ─── Core Concepts ───────────────────────────────────────────────
  {
    id: 'halachah',
    category: 'Core Concepts',
    hebrew: 'הֲלָכָה',
    transliteration: 'hah-lah-KHAH',
    term: 'Halachah',
    definition: 'The rules of Jewish life, based on the Torah and the rabbis\' teachings.',
    extendedNotes:
      'Halachah literally means "the way to walk" or "the path." It encompasses all of Jewish law — from biblical commandments to rabbinic enactments and customs. It governs daily life, Shabbat observance, dietary laws, prayer, and interpersonal ethics. Halachah is not static; it evolves through responsa literature and rabbinic rulings applied to new situations.',
    mnemonicHint:
      'Think "halachah" → "how to walk" — it tells you the path to walk in Jewish life.',
    relatedCards: ['torah-shebichtav', 'torah-shebalpe', 'shulchan-aruch', 'responsa'],
    tag: 'core',
  },
  {
    id: 'torah-shebichtav',
    category: 'Core Concepts',
    hebrew: 'תּוֹרָה שֶׁבִּכְתָב',
    transliteration: 'toh-RAH sheh-bikh-TAHV',
    term: 'Torah SheBichtav (Written Torah)',
    definition: 'The Written Torah — the Five Books of Moses (and the rest of the Hebrew Bible).',
    extendedNotes:
      'Torah SheBichtav refers primarily to the Chumash (Pentateuch), the five books believed to have been dictated by God to Moses at Sinai. In a broader sense, it includes all 24 books of the Tanach (Torah, Nevi\'im, Ketuvim). The Written Torah provides the foundational commandments but is considered incomplete without the Oral Torah to explain and apply it.',
    mnemonicHint:
      '"Bichtav" sounds like "biKTaV" — "in writing." The Torah that was written down.',
    relatedCards: ['torah-shebalpe', 'chumash', 'tanach'],
    tag: 'core',
  },
  {
    id: 'torah-shebalpe',
    category: 'Core Concepts',
    hebrew: 'תּוֹרָה שֶׁבְּעַל פֶּה',
    transliteration: 'toh-RAH sheh-beh-AHL PEH',
    term: 'Torah SheBa\'al Peh (Oral Torah)',
    definition: 'The Oral Torah — spoken teachings passed down from Sinai, later written in the Mishnah and Talmud.',
    extendedNotes:
      'According to rabbinic tradition, God gave Moses both a Written Torah and an Oral Torah at Sinai. The Oral Torah includes explanations of how to fulfill commandments (e.g., the details of tefillin, the prohibition of mixing milk and meat). It was transmitted orally for generations until Rabbi Yehudah HaNasi compiled the Mishnah around 200 CE, fearing it would be forgotten. The Talmud is the further elaboration of the Oral Torah.',
    mnemonicHint:
      '"Ba\'al Peh" = "by mouth." This Torah was spoken, not written — passed mouth to mouth.',
    relatedCards: ['torah-shebichtav', 'mishnah', 'talmud', 'tefillin-oral-law', 'milk-meat-oral-law'],
    tag: 'core',
  },

  // ─── Texts ───────────────────────────────────────────────────────
  {
    id: 'chumash',
    category: 'Texts',
    hebrew: 'חֻמָּשׁ',
    transliteration: 'khoo-MAHSH',
    term: 'Chumash',
    definition: 'The Five Books of Moses: Genesis, Exodus, Leviticus, Numbers, Deuteronomy.',
    extendedNotes:
      'The word "Chumash" comes from the Hebrew word "chamesh" meaning five. It contains the foundational narrative of creation, the patriarchs, the Exodus from Egypt, the giving of the Torah at Sinai, and the laws governing Israelite life. The Chumash is the core of the Written Torah and is read publicly in synagogue on a yearly cycle.',
    mnemonicHint:
      '"Chumash" sounds like "chamesh" (five) — the five books of Moses.',
    relatedCards: ['torah-shebichtav', 'tanach'],
    tag: 'texts',
  },
  {
    id: 'tanach',
    category: 'Texts',
    hebrew: 'תַּנַ״ךְ',
    transliteration: 'tah-NAKH',
    term: 'Tanach',
    definition: 'The Hebrew Bible: Torah + Prophets + Writings. 24 books total.',
    extendedNotes:
      'Tanach is the complete Jewish scripture comprising three sections: Torah (5 books), Nevi\'im (8 books of prophetic literature), and Ketuvim (11 books of writings including Psalms, Proverbs, Job, and the Five Megillot). The acronym T-N-K (TaNaKh) comes from the first letters of these three sections. Christians refer to it as the "Old Testament," but Jews consider this term inaccurate since there is no "new" testament in Judaism.',
    mnemonicHint:
      'T-N-K: Torah + Nevi\'im + Ketuvim = TaNaKh. Three sections, one acronym.',
    relatedCards: ['chumash', 'torah-shebichtav', 'canon'],
    tag: 'texts',
  },
  {
    id: 'mishnah',
    category: 'Texts',
    hebrew: 'מִשְׁנָה',
    transliteration: 'mish-NAH',
    term: 'Mishnah',
    definition: 'The first written collection of the Oral Torah, organized into six sections. Compiled around 200 CE.',
    extendedNotes:
      'The Mishnah (from the root "shanah," to repeat/study) is the foundational text of rabbinic Judaism. Rabbi Yehudah HaNasi (Judah the Prince) compiled it around 200 CE because the Oral Torah was in danger of being forgotten due to Roman persecution and the destruction of the Temple. It is organized into six orders (sedarim), 63 tractates (masekhtot), and contains the legal opinions of the Tana\'im (early sages). The Mishnah became the basis for the Talmud.',
    mnemonicHint:
      '"Mishnah" from "shanah" (to repeat) — oral teachings repeated and finally written down.',
    relatedCards: ['torah-shebalpe', 'tanaim', 'seder', 'masechet', 'gemara', 'talmud'],
    tag: 'texts',
  },
  {
    id: 'gemara',
    category: 'Texts',
    hebrew: 'גְּמָרָא',
    transliteration: 'geh-MAH-rah',
    term: 'Gemara',
    definition: 'Rabbinic discussion and analysis of the Mishnah. Mishnah + Gemara = Talmud.',
    extendedNotes:
      'The Gemara (from the Aramaic "gamar," to study/complete) is the extensive rabbinic discussion and analysis of the Mishnah. The Amora\'im (later sages, ~200–500 CE) debated, questioned, and elaborated on the Mishnah\'s teachings. The Gemara includes legal analysis, ethical teachings, stories (aggadah), and scriptural interpretation. Two versions exist: the Babylonian Gemara (more extensive) and the Jerusalem Gemara (earlier but less complete).',
    mnemonicHint:
      '"Gemara" from "gamar" (to complete) — it completes and explains the Mishnah.',
    relatedCards: ['mishnah', 'talmud', 'amoraim', 'bavli', 'yerushalmi'],
    tag: 'texts',
  },
  {
    id: 'talmud',
    category: 'Texts',
    hebrew: 'תַּלְמוּד',
    transliteration: 'TAHL-mood',
    term: 'Talmud',
    definition: 'The main text of rabbinic Judaism: Mishnah + Gemara. Two versions: Babylonian and Jerusalem.',
    extendedNotes:
      'The Talmud (from "lamad," to study) is the most important text in rabbinic Judaism after the Torah. It combines the Mishnah (compiled ~200 CE) with the Gemara (rabbinic analysis, ~500 CE). The Babylonian Talmud (Bavli) is larger, more widely studied, and considered more authoritative. The Jerusalem Talmud (Yerushalmi) was compiled earlier (~400 CE) in the Land of Israel. When people say "the Talmud" without qualification, they usually mean the Bavli.',
    mnemonicHint:
      'Talmud = Mishnah + Gemara. Think "Talmud" from "lamad" (to learn) — the great book of learning.',
    relatedCards: ['mishnah', 'gemara', 'bavli', 'yerushalmi', 'shas'],
    tag: 'texts',
  },
  {
    id: 'bavli',
    category: 'Texts',
    hebrew: 'בַּבְלִי',
    transliteration: 'BAHV-lee',
    term: 'Bavli (Babylonian Talmud)',
    definition: 'The Babylonian Talmud — the bigger, more widely studied version. Completed around 500 CE in modern-day Iraq.',
    extendedNotes:
      'The Bavli was produced in the great academies of Sura and Pumbedita in Babylonia. It is roughly three times the size of the Yerushalmi and covers 37 of the 63 Mishnah tractates. Its discussions are more elaborate, its logic more developed, and it incorporates more aggadic (narrative) material. The Bavli became the dominant legal authority in Judaism and is the basis for most halachic rulings.',
    mnemonicHint:
      '"Bavli" = "Babylonian." Bavel = Babylon. The bigger, more famous Talmud from Babylon.',
    relatedCards: ['talmud', 'yerushalmi', 'gemara', 'shas'],
    tag: 'texts',
  },
  {
    id: 'yerushalmi',
    category: 'Texts',
    hebrew: 'יְרוּשַׁלְמִי',
    transliteration: 'yeh-roo-SHAHL-mee',
    term: 'Yerushalmi (Jerusalem Talmud)',
    definition: 'The Jerusalem Talmud — shorter and older than the Bavli. Completed around 400 CE in Israel.',
    extendedNotes:
      'The Yerushalmi was compiled in Tiberias and Caesarea in the Land of Israel, about a century before the Bavli. It is shorter, more concise, and sometimes more difficult to understand due to its terse style. It covers primarily the first four orders of the Mishnah (Zeraim, Moed, Nashim, Nezikin). Though less authoritative than the Bavli in halachic decisions, it preserves valuable traditions and teachings from the sages of the Land of Israel.',
    mnemonicHint:
      '"Yerushalmi" = "of Jerusalem" — the Talmud from the Land of Israel, compiled earlier but studied less.',
    relatedCards: ['talmud', 'bavli', 'gemara'],
    tag: 'texts',
  },
  {
    id: 'baraita',
    category: 'Texts',
    hebrew: 'בָּרַיְתָא',
    transliteration: 'bah-RYE-tah',
    term: 'Baraita',
    definition: 'A teaching from the Mishnah era that didn\'t make it into the Mishnah, but gets quoted in the Talmud.',
    extendedNotes:
      'The word "baraita" means "outside" (Aramaic), referring to teachings that remained outside the Mishnah. When Rabbi Yehudah HaNasi compiled the Mishnah, he selected certain teachings and omitted others. The omitted Tanaitic teachings survived in collections like the Tosefta and are quoted throughout the Gemara, often introduced with the formula "tanya" (it was taught) or "tanu rabbanan" (our rabbis taught). Baraitot are important because they preserve alternative traditions and additional details.',
    mnemonicHint:
      '"Baraita" = "outside" — teachings left outside the Mishnah, quoted in the Talmud.',
    relatedCards: ['mishnah', 'tanaim', 'gemara'],
    tag: 'texts',
  },
  {
    id: 'shas',
    category: 'Texts',
    hebrew: 'ש״ס',
    transliteration: 'SHAHS',
    term: 'Shas',
    definition: 'Short for "Six Orders" — a nickname for the entire Talmud.',
    extendedNotes:
      'Shas (ש״ס) stands for "Shishah Sedarim," the six orders of the Mishnah/Talmud. It is used colloquially to refer to the entire Talmud. When someone says they are "learning Shas" or have completed a "siyum HaShas" (celebration of finishing Shas), they mean they have studied the entire Talmud. The Daf Yomi program, which involves studying one page of Talmud per day, completes the entire Shas in approximately 7.5 years.',
    mnemonicHint:
      'Shas = Shishah (six) Sedarim (orders). Shorthand for the whole Talmud.',
    relatedCards: ['talmud', 'seder', 'bavli'],
    tag: 'texts',
  },
  {
    id: 'apocrypha',
    category: 'Texts',
    transliteration: 'ah-POK-rih-fah',
    term: 'Apocrypha',
    definition: 'Ancient Jewish texts that didn\'t make it into the Hebrew Bible but are kept in some Christian Bibles.',
    extendedNotes:
      'The Apocrypha (Greek: "hidden away") includes books like 1 & 2 Maccabees, Sirach (Ben Sira), Tobit, Judith, and Wisdom of Solomon. These were written during the Second Temple period but were excluded from the Jewish canon when it was finalized. The Catholic and Orthodox churches include some of these texts in their Old Testament, while Protestants and Jews do not. They provide valuable historical and cultural information about Second Temple Judaism.',
    mnemonicHint:
      '"Apocrypha" = "hidden away" — books hidden away from the official Jewish canon.',
    relatedCards: ['tanach', 'canon', 'brit-hachadashah'],
    tag: 'texts',
  },
  {
    id: 'brit-hachadashah',
    category: 'Texts',
    hebrew: 'בְּרִית הַחֲדָשָׁה',
    transliteration: 'breet hah-khah-dah-SHAH',
    term: 'Brit HaChadashah (New Testament)',
    definition: 'The "New Testament" — Christian scriptures, not part of Judaism. Literally means "the New Covenant."',
    extendedNotes:
      'The Brit HaChadashah is the collection of Christian texts including the Gospels, Acts, Epistles, and Revelation. It is not part of Judaism and is not studied as scripture in Jewish tradition. However, understanding it is important for interfaith dialogue and for understanding how Christianity diverged from Second Temple Judaism. Jews object to the term "Old Testament" for the Tanach, as it implies the Jewish covenant has been superseded.',
    mnemonicHint:
      '"Brit" = covenant, "Chadashah" = new. The "New Covenant" — a Christian text, not part of Jewish canon.',
    relatedCards: ['tanach', 'apocrypha', 'canon'],
    tag: 'texts',
  },

  // ─── Sages ───────────────────────────────────────────────────────
  {
    id: 'tanaim',
    category: 'Sages',
    hebrew: 'תַּנָּאִים',
    transliteration: 'tah-nah-EEM',
    term: 'Tana\'im',
    definition: 'The early rabbis whose teachings are in the Mishnah (~10–200 CE).',
    extendedNotes:
      'The Tana\'im (from the Aramaic "tana," to teach/repeat) were the sages of the Mishnaic period. They include famous figures like Rabbi Akiva, Rabbi Meir, Hillel, Shammai, and Rabbi Yehudah HaNasi (who compiled the Mishnah). They established the foundational legal discussions that would later be analyzed by the Amora\'im. A key principle in the Talmud is that an Amora cannot disagree with a Tana unless supported by another Tanaitic source.',
    mnemonicHint:
      '"Tana\'im" from "tana" (to teach). They taught the Mishnah — the earlier, more authoritative sages.',
    relatedCards: ['mishnah', 'amoraim', 'baraita'],
    tag: 'sages',
  },
  {
    id: 'amoraim',
    category: 'Sages',
    hebrew: 'אֲמוֹרָאִים',
    transliteration: 'ah-moh-rah-EEM',
    term: 'Amora\'im',
    definition: 'The later rabbis whose teachings are in the Gemara (~200–500 CE).',
    extendedNotes:
      'The Amora\'im (from the Aramaic "amar," to say/interpret) were the sages who discussed, debated, and analyzed the Mishnah. Their work forms the Gemara. They were active in both Babylonia (producing the Bavli) and the Land of Israel (producing the Yerushalmi). Famous Amora\'im include Rav, Shmuel, Rabbi Yochanan, and Rava. The Amora\'im could not directly contradict the Tana\'im but could interpret their teachings.',
    mnemonicHint:
      '"Amora\'im" from "amar" (to say/interpret). They said their interpretations of the Mishnah — the later sages.',
    relatedCards: ['gemara', 'tanaim', 'bavli', 'yerushalmi'],
    tag: 'sages',
  },

  // ─── Structure ───────────────────────────────────────────────────
  {
    id: 'seder',
    category: 'Structure',
    hebrew: 'סֵדֶר',
    transliteration: 'SEH-der',
    term: 'Seder (Order)',
    definition: 'One of the six main sections of the Mishnah, each covering a different area of Jewish law.',
    extendedNotes:
      'The six orders (sedarim) of the Mishnah are: Zeraim (Seeds — agricultural laws), Moed (Festivals — Shabbat and holidays), Nashim (Women — marriage and divorce), Nezikin (Damages — civil and criminal law), Kodashim (Holy Things — Temple sacrifices), and Tohorot (Purities — ritual purity). Each seder contains multiple tractates (masekhtot). The word "seder" means "order" or "arrangement," reflecting the organized structure of Jewish oral law.',
    mnemonicHint:
      '"Seder" = "order" (like the Passover Seder, which follows an order). Six orders organize the Mishnah.',
    relatedCards: ['mishnah', 'masechet', 'shas', 'zeraim', 'moed', 'nashim', 'nezikin', 'kodashim', 'tohorot'],
    tag: 'structure',
  },
  {
    id: 'masechet',
    category: 'Structure',
    hebrew: 'מַסֶּכֶת',
    transliteration: 'mah-SEH-khet',
    term: 'Masechet (Tractate)',
    definition: 'A single topic-book within a seder. There are 63 tractates in total.',
    extendedNotes:
      'Each seder is divided into tractates (masekhtot, plural of masechet). There are 63 tractates in total across the six orders. Each tractate focuses on a specific legal topic — for example, Masechet Shabbat deals with Sabbath laws, Masechet Bava Kamma deals with damages. The word "masechet" means "web" or "weaving," suggesting how various legal threads are woven together into a coherent discussion.',
    mnemonicHint:
      '"Masechet" = "weaving" — legal threads woven into a tractate. Think of it as a chapter within an order.',
    relatedCards: ['seder', 'daf', 'mishnah'],
    tag: 'structure',
  },
  {
    id: 'daf',
    category: 'Structure',
    hebrew: 'דַּף',
    transliteration: 'DAHF',
    term: 'Daf (Page/Folio)',
    definition: 'A page of the Talmud. Each page has two sides: side a and side b.',
    extendedNotes:
      'The Talmud\'s page numbering system has remained consistent since the first printed edition by Daniel Bomberg in Venice (1520–1523). Each physical leaf (daf) has two sides (amudim). So "Berakhot 2a" means Tractate Berakhot, daf 2, amud alef (first side). This standardized system means that a citation like "Shabbat 73b" refers to the same text in every printed edition of the Talmud worldwide. The Daf Yomi program studies one daf per day.',
    mnemonicHint:
      '"Daf" = a page/leaf. Every daf has two "amudim" (columns/sides): a and b.',
    relatedCards: ['amud', 'masechet', 'talmud'],
    tag: 'structure',
  },
  {
    id: 'amud',
    category: 'Structure',
    hebrew: 'עַמּוּד',
    transliteration: 'ah-MOOD',
    term: 'Amud (Column/Side)',
    definition: 'One side of a Talmud page. Amud Alef = side a (front), Amud Bet = side b (back).',
    extendedNotes:
      'Each daf (folio) in the Talmud has two amudim (columns/sides). "Amud" literally means "pillar" or "column." In Talmudic citation, the amud is indicated by a letter: alef (א, a) for the first side and bet (ב, b) for the second. This system allows precise referencing — for example, "Pesachim 10a" means Tractate Pesachim, daf 10, first side. The amud distinction is crucial for accurate citation and study.',
    mnemonicHint:
      '"Amud" = "pillar/column." Two pillars per page: Amud Alef (a) and Amud Bet (b).',
    relatedCards: ['daf', 'masechet'],
    tag: 'structure',
  },
  {
    id: 'machloket',
    category: 'Structure',
    hebrew: 'מַחְלֹקֶת',
    transliteration: 'makh-LOH-ket',
    term: 'Machloket (Dispute)',
    definition: 'A disagreement between rabbis recorded in the Mishnah or Talmud.',
    extendedNotes:
      'Machloket (from the root ch-l-k, to divide) is a fundamental feature of Talmudic literature. The sages frequently disagreed on how to interpret and apply the law. Famous examples include the disputes between Beit Hillel and Beit Shammai, and between Rav and Shmuel. The Talmud records these disputes because all opinions — even rejected ones — are considered valuable. The principle "Eilu v\'eilu divrei Elokim chayyim" (these and these are the words of the living God) teaches that multiple legitimate interpretations can coexist.',
    mnemonicHint:
      '"Machloket" from "chelek" (portion/division). A dispute where sages are divided in their opinions.',
    relatedCards: ['mishnah', 'gemara', 'tanaim', 'amoraim'],
    tag: 'structure',
  },

  // ─── Law Codes ───────────────────────────────────────────────────
  {
    id: 'mishneh-torah',
    category: 'Law Codes',
    hebrew: 'מִשְׁנֵה תּוֹרָה',
    transliteration: 'mish-NEH toh-RAH',
    term: 'Mishneh Torah',
    definition: 'Maimonides\' organized 14-volume guide to all of Jewish law (c. 1180 CE).',
    extendedNotes:
      'The Mishneh Torah ("Repetition of the Torah"), also called "Yad HaChazakah" ("The Strong Hand"), is Maimonides\' magnum opus. It was revolutionary because it organized all of Jewish law into a clear, systematic code — covering every area of halachah from the Talmud without citing sources or recording disputes. Maimonides intended it to be a complete guide so that a person could go from the Torah directly to the Mishneh Torah without needing the Talmud. This was both praised for its clarity and criticized for omitting sources.',
    mnemonicHint:
      '"Mishneh Torah" = "Repetition of the Torah." Rambam\'s attempt to repeat/organize ALL Jewish law clearly.',
    relatedCards: ['shulchan-aruch', 'halachah', 'codify', 'rambam-vs-saadiah'],
    tag: 'law-codes',
  },
  {
    id: 'shulchan-aruch',
    category: 'Law Codes',
    hebrew: 'שֻׁלְחָן עָרוּךְ',
    transliteration: 'shool-KHAHN ah-ROOKH',
    term: 'Shulchan Aruch',
    definition: 'The go-to code of Jewish law (1565). Written by Rabbi Yosef Karo, with Ashkenazi additions by the Rema.',
    extendedNotes:
      'The Shulchan Aruch ("Set Table") was written by Rabbi Yosef Karo, a Sephardic scholar in Safed. It codifies practical halachah in four sections: Orach Chayyim (daily life and holidays), Yoreh De\'ah (dietary and other laws), Even HaEzer (marriage and divorce), and Choshen Mishpat (civil law). Rabbi Moshe Isserles (the Rema) added glosses called the "Mappah" ("Tablecloth") recording Ashkenazi customs. Together, the Shulchan Aruch and Mappah became the standard code of Jewish law for both Sephardic and Ashkenazi communities.',
    mnemonicHint:
      '"Shulchan Aruch" = "Set Table." Jewish law served on a ready-made table. The Rema added the tablecloth (Mappah).',
    relatedCards: ['mishneh-torah', 'halachah', 'codify', 'responsa'],
    tag: 'law-codes',
  },
  {
    id: 'responsa',
    category: 'Law Codes',
    hebrew: 'שְׁאֵלוֹת וּתְשׁוּבוֹת',
    transliteration: 'sheh-eh-LOHT oo-teh-shoo-VOHT',
    term: 'Responsa (She\'elot u\'Teshuvot)',
    definition: 'Q&A rulings by rabbis on real-life legal questions — how Jewish law keeps up with new situations.',
    extendedNotes:
      'The responsa literature (She\'elot u\'Teshuvot, literally "questions and answers") spans over a thousand years and represents the living, evolving nature of halachah. When communities or individuals faced new legal questions, they would write to prominent rabbis for rulings. These written exchanges became an enormous body of literature addressing everything from medieval commerce to modern technology (electricity on Shabbat, organ donation, internet use). Responsa are a key mechanism for applying ancient principles to contemporary life.',
    mnemonicHint:
      '"She\'elot u\'Teshuvot" = "Questions and Answers." Rabbis answering real-world halachic questions in writing.',
    relatedCards: ['halachah', 'shulchan-aruch', 'extrapolate'],
    tag: 'law-codes',
  },

  // ─── Concepts ────────────────────────────────────────────────────
  {
    id: 'canon',
    category: 'Concepts',
    transliteration: 'KAN-un',
    term: 'Canon',
    definition: 'The official list of holy books. The Jewish canon = the 24 books of the Tanach.',
    extendedNotes:
      'The Jewish biblical canon was finalized by the end of the Second Temple period. The process of canonization involved determining which books were divinely inspired and authoritative. Books that did not make the cut (like the Apocrypha) were excluded. The Jewish canon contains 24 books (corresponding to the Protestant 39 books, counted differently). The concept of canon is important for understanding what is "in" and what is "out" of official scripture.',
    mnemonicHint:
      '"Canon" = the official list. Think of a "cannon" that fires only approved books into the collection.',
    relatedCards: ['tanach', 'apocrypha', 'brit-hachadashah'],
    tag: 'concepts',
  },
  {
    id: 'codify',
    category: 'Concepts',
    transliteration: 'KOH-dih-fy',
    term: 'Codify',
    definition: 'To organize scattered laws into one clear, written system.',
    extendedNotes:
      'Codification is the process of collecting, organizing, and presenting laws in a clear, systematic format. In Jewish history, major codification projects include the Mishnah (codifying the Oral Torah), the Mishneh Torah (Maimonides\' comprehensive code), and the Shulchan Aruch (Karo\'s practical law code). Codification makes law accessible but can also be controversial — critics worried that it would discourage Talmud study or freeze law in a rigid form.',
    mnemonicHint:
      '"Codify" = to make a code. Turning complex legal discussions into an organized, usable system.',
    relatedCards: ['mishneh-torah', 'shulchan-aruch', 'mishnah'],
    tag: 'concepts',
  },
  {
    id: 'extrapolate',
    category: 'Concepts',
    transliteration: 'ek-STRAP-oh-late',
    term: 'Extrapolate',
    definition: 'Using known rules to figure out new cases — like applying an old law to a modern question.',
    extendedNotes:
      'Extrapolation is central to how halachah develops. The Torah provides principles, and the rabbis extrapolate from those principles to cover situations not explicitly addressed. For example, the Torah prohibits "cooking a kid in its mother\'s milk" (Exodus 23:19), and the rabbis extrapolated from this a comprehensive prohibition against mixing any meat and dairy. This method allows ancient law to address modern situations through analogical reasoning, legal principles, and creative interpretation.',
    mnemonicHint:
      '"Extrapolate" = to extend beyond. Taking a Torah principle and stretching it to cover new cases.',
    relatedCards: ['torah-shebalpe', 'responsa', 'milk-meat-oral-law'],
    tag: 'concepts',
  },

  // ─── Six Orders ──────────────────────────────────────────────────
  {
    id: 'zeraim',
    category: 'Six Orders',
    hebrew: 'זְרָעִים',
    transliteration: 'zeh-rah-EEM',
    term: 'Zeraim (Seeds)',
    definition: 'Order 1 of the Mishnah: farming laws, blessings, and prayers (11 tractates).',
    extendedNotes:
      'Zeraim ("Seeds") covers laws related to agriculture in the Land of Israel, including tithes, the sabbatical year (shemitah), and gifts to the poor. It also includes Tractate Berakhot, which deals with blessings and prayers — seemingly unrelated to agriculture, but placed here because blessings over food connect to the agricultural theme. Only Berakhot has Gemara in the Bavli; the rest of Zeraim\'s tractates have Gemara only in the Yerushalmi.',
    mnemonicHint:
      '"Zeraim" = "Seeds." The order about planting, harvesting, and agricultural laws.',
    relatedCards: ['seder', 'mishnah', 'moed'],
    tag: 'six-orders',
  },
  {
    id: 'moed',
    category: 'Six Orders',
    hebrew: 'מוֹעֵד',
    transliteration: 'moh-ED',
    term: 'Moed (Festivals)',
    definition: 'Order 2 of the Mishnah: Shabbat and holiday laws (12 tractates).',
    extendedNotes:
      'Moed ("Appointed Time" or "Festival") covers the laws of Shabbat, the three pilgrimage festivals (Pesach, Shavuot, Sukkot), Rosh Hashanah, Yom Kippur, Purim, Chanukah, and fast days. Key tractates include Shabbat (Sabbath laws), Pesachim (Passover), Sukkah (Tabernacles), and Megillah (Purim and Torah reading). This order is heavily studied because its laws are relevant to observant Jews throughout the year.',
    mnemonicHint:
      '"Moed" = "Appointed Time." The order about special times — Shabbat and holidays.',
    relatedCards: ['seder', 'zeraim', 'nashim'],
    tag: 'six-orders',
  },
  {
    id: 'nashim',
    category: 'Six Orders',
    hebrew: 'נָשִׁים',
    transliteration: 'nah-SHEEM',
    term: 'Nashim (Women)',
    definition: 'Order 3 of the Mishnah: marriage, divorce, and vows (7 tractates).',
    extendedNotes:
      'Nashim ("Women") covers the laws governing personal status, particularly marriage (kiddushin), the marriage contract (ketubah), divorce (gittin), levirate marriage (yibum), and vows (nedarim and nazir). Despite its name, it deals with family law broadly, not just laws pertaining to women. Key tractates include Yevamot, Ketubot, Gittin, and Kiddushin.',
    mnemonicHint:
      '"Nashim" = "Women." The order about marriage, divorce, and family law.',
    relatedCards: ['seder', 'moed', 'nezikin'],
    tag: 'six-orders',
  },
  {
    id: 'nezikin',
    category: 'Six Orders',
    hebrew: 'נְזִיקִין',
    transliteration: 'neh-zee-KEEN',
    term: 'Nezikin (Damages)',
    definition: 'Order 4 of the Mishnah: courts, damages, and civil law (10 tractates).',
    extendedNotes:
      'Nezikin ("Damages") is the legal heart of the Talmud. It covers torts and damages (Bava Kamma), property and commerce (Bava Metzia), partnerships and real estate (Bava Batra), courts and judicial procedure (Sanhedrin), and punishments (Makkot). It also contains Pirkei Avot (Ethics of the Fathers), which is unique — it is purely ethical/wisdom literature with no legal content. This order is one of the most studied in yeshivot.',
    mnemonicHint:
      '"Nezikin" = "Damages." The order about legal damages, courts, and civil law.',
    relatedCards: ['seder', 'nashim', 'kodashim', 'pirkei-avot-1-1'],
    tag: 'six-orders',
  },
  {
    id: 'kodashim',
    category: 'Six Orders',
    hebrew: 'קׇדָשִׁים',
    transliteration: 'koh-dah-SHEEM',
    term: 'Kodashim (Holy Things)',
    definition: 'Order 5 of the Mishnah: Temple sacrifices and holy objects (11 tractates).',
    extendedNotes:
      'Kodashim ("Holy Things") deals primarily with the Temple service in Jerusalem, including animal sacrifices (Zevachim), meal offerings (Menachot), and the daily Temple ritual (Tamid). It also includes Tractate Chullin, which covers kosher slaughter and dietary laws for non-sacred animals — making it practically relevant even after the Temple\'s destruction. Though much of this order is not currently applicable, it is studied as Torah learning and in anticipation of the Temple\'s rebuilding.',
    mnemonicHint:
      '"Kodashim" = "Holy Things." The order about sacred Temple offerings and sacrifices.',
    relatedCards: ['seder', 'nezikin', 'tohorot'],
    tag: 'six-orders',
  },
  {
    id: 'tohorot',
    category: 'Six Orders',
    hebrew: 'טׇהֳרוֹת',
    transliteration: 'toh-hah-ROHT',
    term: 'Tohorot (Purities)',
    definition: 'Order 6 of the Mishnah: ritual purity and impurity (12 tractates).',
    extendedNotes:
      'Tohorot ("Purities") covers the complex laws of ritual purity (taharah) and impurity (tumah). This includes impurity from contact with the dead, bodily emissions, and certain skin diseases (tzaraat). Key tractates include Niddah (menstrual purity — still practically relevant), Kelim (impurity of vessels), and Mikvaot (ritual baths). Most of these laws are not practically applicable today without the Temple, but Niddah remains central to family purity observance. In the Bavli, only Tractate Niddah has Gemara.',
    mnemonicHint:
      '"Tohorot" = "Purities." The order about ritual purity and impurity — the last and most complex.',
    relatedCards: ['seder', 'kodashim', 'zeraim'],
    tag: 'six-orders',
  },

  // ─── Primary Sources ─────────────────────────────────────────────
  {
    id: 'pirkei-avot-1-1',
    category: 'Primary Sources',
    hebrew: 'פִּרְקֵי אָבוֹת א:א',
    transliteration: 'pir-KAY ah-VOHT',
    term: 'Pirkei Avot 1:1 — Chain of Transmission',
    definition: 'Moses got the Torah at Sinai and passed it to Joshua, then to the Elders, Prophets, and finally the Great Assembly.',
    extendedNotes:
      'This opening Mishnah of Pirkei Avot (Ethics of the Fathers) establishes the chain of transmission (shalshellet ha-kabbalah) of the Oral Torah from Sinai through the generations. It legitimizes rabbinic authority by showing an unbroken chain from Moses to the rabbis. The Men of the Great Assembly (Anshei Knesset HaGedolah) were the sages of the early Second Temple period who bridged the gap between the Prophets and the early rabbinic sages. This chain is the foundation for the authority of the Oral Torah.',
    mnemonicHint:
      'The chain: Moses → Joshua → Elders → Prophets → Great Assembly. An unbroken chain from Sinai to the rabbis.',
    relatedCards: ['torah-shebalpe', 'mishnah', 'tanaim', 'nezikin'],
    tag: 'primary-sources',
  },
  {
    id: 'rambam-exodus-24',
    category: 'Primary Sources',
    transliteration: 'rahm-BAHM',
    term: 'Rambam on Exodus 24 — Dual Torah at Sinai',
    definition: 'Maimonides teaches that Moses received both the Written and Oral Torah at Sinai — the text and its explanation.',
    extendedNotes:
      'Based on Exodus 24:12 ("I will give you the tablets of stone, and the Torah, and the commandment"), Maimonides explains that "the Torah" refers to the Written Torah and "the commandment" refers to its explanation — the Oral Torah. This is a foundational principle: the Written Torah is incomplete without the Oral Torah. Maimonides argues that every detail of the Oral Torah was communicated to Moses at Sinai, establishing the divine origin and authority of rabbinic tradition. This teaching appears in his introduction to the Mishneh Torah.',
    mnemonicHint:
      'Exodus 24:12: "Torah" = Written; "Commandment" = Oral. Two Torahs given at one Sinai event.',
    relatedCards: ['torah-shebichtav', 'torah-shebalpe', 'mishneh-torah'],
    tag: 'primary-sources',
  },
  {
    id: 'rambam-vs-saadiah',
    category: 'Primary Sources',
    transliteration: 'rahm-BAHM / sah-AH-dee-ah',
    term: 'Rambam vs. Saadiah Gaon on the Oral Torah',
    definition: 'Two views on the Oral Torah: Rambam says it all came from God at Sinai. Saadiah says human reasoning plays a role too.',
    extendedNotes:
      'Maimonides (Rambam, 1138–1204) held that the entire Oral Torah — every detail and application — was given to Moses at Sinai and transmitted faithfully through the generations. Saadiah Gaon (882–942), while affirming divine origin, placed greater emphasis on the role of human reason (sekhel) in interpreting and developing the law. For Saadiah, the Torah\'s laws must be understandable through reason, and human intellect plays a legitimate role in legal interpretation. This distinction reflects a broader tension in Jewish thought between revelation and reason, between received tradition and interpretive creativity.',
    mnemonicHint:
      'Rambam: "Everything from Sinai." Saadiah: "Reason also plays a role." Revelation vs. interpretation.',
    relatedCards: ['mishneh-torah', 'torah-shebalpe', 'extrapolate'],
    tag: 'primary-sources',
  },

  // ─── Oral Law Examples ───────────────────────────────────────────
  {
    id: 'tefillin-oral-law',
    category: 'Oral Law Examples',
    hebrew: 'תְּפִלִּין',
    transliteration: 'teh-fill-EEN',
    term: 'Tefillin — An Oral Torah Example',
    definition: 'The Torah says "bind a sign on your hand" but never explains what tefillin are — those details come from the Oral Torah.',
    extendedNotes:
      'Deuteronomy 6:8 says "Bind them as a sign upon your hand and let them be frontlets between your eyes." But the Written Torah never explains: What are these "signs"? What shape should they be? What goes inside them? How do you wear them? Every detail — the black leather boxes, the four compartments in the head tefillin, the specific Torah passages inside, the black leather straps, the knots — comes from the Oral Torah. Tefillin are a powerful example of why the Oral Torah is considered indispensable: without it, the Written Torah\'s command is impossible to fulfill.',
    mnemonicHint:
      'The Torah says "bind them" but never says what. Without the Oral Torah, you wouldn\'t know what tefillin look like.',
    relatedCards: ['torah-shebalpe', 'torah-shebichtav', 'milk-meat-oral-law'],
    tag: 'oral-law-examples',
  },
  {
    id: 'milk-meat-oral-law',
    category: 'Oral Law Examples',
    hebrew: 'בָּשָׂר בְּחָלָב',
    transliteration: 'bah-SAHR beh-khah-LAHV',
    term: 'Milk and Meat — An Oral Torah Example',
    definition: 'The Torah says "don\'t cook a kid in its mother\'s milk" three times. The Oral Torah expanded this into the full meat-dairy separation.',
    extendedNotes:
      'The Written Torah\'s command (Exodus 23:19, 34:26; Deuteronomy 14:21) is narrow: don\'t cook a baby goat in its mother\'s milk. The Oral Torah derives three separate prohibitions from the three repetitions: no cooking meat and dairy together, no eating them together, and no deriving benefit from the mixture. The rabbis further extended this to include poultry with dairy (a rabbinic enactment) and the practice of waiting between eating meat and dairy. This is a classic example of extrapolation — taking a specific biblical verse and developing comprehensive dietary laws.',
    mnemonicHint:
      'Three verses → three prohibitions. A baby goat in milk becomes the entire kosher dairy/meat separation.',
    relatedCards: ['torah-shebalpe', 'torah-shebichtav', 'tefillin-oral-law', 'extrapolate'],
    tag: 'oral-law-examples',
  },
  // === ADDITIONAL KEY FIGURES & CONCEPTS ===
  {
    id: 'rabbi-yehudah-hanasi',
    category: 'Sages',
    hebrew: 'רַבִּי יְהוּדָה הַנָּשִׂיא',
    transliteration: "Rabbi Yehudah HaNasi",
    term: "Rabbi Yehudah HaNasi",
    definition: "The rabbi who compiled the Mishnah (~200 CE). So respected he's just called 'Rabbi.' Led the Jewish community in Israel.",
    extendedNotes: "Rabbi Yehudah HaNasi was motivated to compile the Mishnah by fear that the Oral Law would be forgotten due to Roman persecution and Jewish dispersion. He gathered traditions from all prior generations and organized them into six orders.",
    mnemonicHint: "HaNasi = The Prince — he was the leader (Nasi) of the Sanhedrin",
    relatedCards: ['mishnah', 'tanaim', 'torah-shebalpe'],
    tag: 'Sages',
  },
  {
    id: 'anshei-knesset-hagedolah',
    category: 'Sages',
    hebrew: 'אַנְשֵׁי כְּנֶסֶת הַגְּדוֹלָה',
    transliteration: "Anshei Knesset HaGedolah",
    term: "Men of the Great Assembly",
    definition: "120 sages and prophets who led the Jews in the early Second Temple period. They shaped Jewish prayer.",
    extendedNotes: "Ezra the Scribe was the most prominent leader of this group. They established the basic framework of Jewish prayer, including the Amidah. Their famous teaching from Pirkei Avot 1:1: 'Be deliberate in judgment, raise up many students, and make a fence around the Torah.'",
    mnemonicHint: "Knesset = Assembly (like the Israeli parliament), Gedolah = Great",
    relatedCards: ['pirkei-avot-1-1', 'tanaim'],
    tag: 'Sages',
  },
  {
    id: 'zugot',
    category: 'Sages',
    hebrew: 'זוּגוֹת',
    transliteration: "Zugot",
    term: "Zugot (The Pairs)",
    definition: "Five pairs of leaders who ran the Sanhedrin (~200 BCE – 10 CE). Most famous: Hillel and Shammai.",
    extendedNotes: "The most famous pair was Hillel and Shammai, whose students (Beit Hillel and Beit Shammai) are featured extensively in the Mishnah. The Zugot period bridges between the Men of the Great Assembly and the Tannaim.",
    mnemonicHint: "Zugot = pairs (זוג = pair, like a couple)",
    relatedCards: ['pirkei-avot-1-1', 'tanaim', 'machloket'],
    tag: 'Sages',
  },
  {
    id: 'sanhedrin',
    category: 'Structure',
    hebrew: 'סַנְהֶדְרִין',
    transliteration: "Sanhedrin",
    term: "Sanhedrin",
    definition: "The supreme Jewish court of 71 rabbis in ancient Jerusalem. The highest legal and religious authority.",
    extendedNotes: "The Great Sanhedrin consisted of 71 members, with the Nasi as president. Smaller courts (Sanhedrin Ketanah) of 23 judges existed in major cities. The Sanhedrin could rule on capital cases, declare leap years, and establish binding halachah. It ceased to function after the destruction of the Temple.",
    mnemonicHint: "Sanhedrin sounds like 'Senate' — it was the Jewish supreme court",
    relatedCards: ['tanaim', 'machloket', 'halachah'],
    tag: 'Structure',
  },
  {
    id: 'perek',
    category: 'Structure',
    hebrew: 'פֶּרֶק',
    transliteration: "Perek",
    term: "Perek (Chapter)",
    definition: "A chapter within a tractate of the Mishnah or Talmud.",
    extendedNotes: "There are 525 chapters across all 63 tractates of the Mishnah. Each Perek typically deals with a sub-topic within the tractate's overall theme. Pirkei Avot literally means 'Chapters of the Fathers.'",
    mnemonicHint: "Perek = chapter (like Pirkei Avot = Chapters of the Fathers)",
    relatedCards: ['masechet', 'mishnah', 'seder'],
    tag: 'Structure',
  },
  {
    id: 'midrash',
    category: 'Texts',
    hebrew: 'מִדְרָשׁ',
    transliteration: "Midrash",
    term: "Midrash",
    definition: "Rabbinic stories and interpretations that dig deeper into the Torah's meaning.",
    extendedNotes: "There are two main types: Midrash Halachah (legal interpretations) and Midrash Aggadah (narrative/ethical interpretations). Major collections include Midrash Rabbah, Mekhilta, Sifra, and Sifrei. The word comes from 'darash' (דרש = to seek/investigate).",
    mnemonicHint: "Midrash = to search/investigate (דרש = to seek out meaning)",
    relatedCards: ['gemara', 'torah-shebalpe', 'tanaim'],
    tag: 'Texts',
  },
  {
    id: 'tosefta',
    category: 'Texts',
    hebrew: 'תּוֹסֶפְתָּא',
    transliteration: "Tosefta",
    term: "Tosefta",
    definition: "Extra teachings from the Mishnah era that weren't included in the Mishnah. Organized the same way.",
    extendedNotes: "The Tosefta is attributed to Rabbi Chiya and Rabbi Oshaya, students of Rabbi Yehudah HaNasi. It is about four times the size of the Mishnah and provides elaboration and additional cases. Like Baraitot, Tosefta passages are external to the Mishnah.",
    mnemonicHint: "Tosefta = addition/supplement (תוספת = addition)",
    relatedCards: ['mishnah', 'baraita', 'tanaim'],
    tag: 'Texts',
  },
  {
    id: 'oral-law-necessity',
    category: 'Concepts',
    hebrew: 'צֹרֶךְ תּוֹרָה שֶׁבְּעַל פֶּה',
    transliteration: "Tzorekh Torah She-b'al Peh",
    term: "Why the Oral Law is Necessary",
    definition: "The Written Torah is incomplete on purpose — you need the Oral Torah to know how to actually do the commandments.",
    extendedNotes: "The Torah says 'slaughter as I have commanded you' (Deuteronomy 12:21), but never describes HOW to slaughter. It says to bind signs on your hand, but never says what these signs are. The Oral Law fills in every practical detail.",
    mnemonicHint: "Written Torah = WHAT to do. Oral Torah = HOW to do it.",
    relatedCards: ['torah-shebalpe', 'torah-shebichtav', 'tefillin-oral-law', 'milk-meat-oral-law'],
    tag: 'Concepts',
  },
];

/** Named export matching the store's import convention. */
export const CARDS = cards;

/**
 * Category color mapping for UI badges.
 */
export const CATEGORY_COLORS: Record<string, string> = {
  'Core Concepts': '#4f8ef7',
  Texts: '#bf5af2',
  Sages: '#ff9f0a',
  Structure: '#34c759',
  'Law Codes': '#ff453a',
  Concepts: '#ffd60a',
  'Six Orders': '#4fc3f7',
  'Primary Sources': '#64d2ff',
  'Oral Law Examples': '#30d158',
};

/**
 * Look up a card by its ID.
 */
export function getCardById(id: string): Card | undefined {
  return cards.find((c) => c.id === id);
}

/**
 * Get all unique categories from the card set.
 */
export function getCategories(): string[] {
  return [...new Set(cards.map((c) => c.category))];
}

/**
 * Get cards filtered by category.
 */
export function getCardsByCategory(category: string): Card[] {
  return cards.filter((c) => c.category === category);
}

export default cards;
