// ─── SNC2D Biology Question Bank — Guided Learning Mode ───

export type QuestionType = "mc" | "tf" | "fib" | "match" | "sa" | "order";

export type TopicTag =
  | "tissues"
  | "digestive"
  | "respiratory"
  | "circulatory"
  | "interactions";

/* ------------------------------------------------------------------ */
/*  Question interfaces                                                */
/* ------------------------------------------------------------------ */

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
  items: string[];
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

/* ------------------------------------------------------------------ */
/*  Confusion pairs                                                    */
/* ------------------------------------------------------------------ */

export const confusionPairs: [string, string][] = [
  ["Arteries", "Veins"],
  ["Mechanical digestion", "Chemical digestion"],
  ["Bronchi", "Bronchioles"],
  ["Pulmonary arteries", "Pulmonary veins"],
  ["Small intestine", "Large intestine"],
  ["Skeletal muscle", "Smooth muscle"],
  ["Trachea", "Esophagus"],
  ["Alveoli", "Villi"],
  ["Pepsin", "Salivary amylase"],
  ["Insulin", "Glucagon"],
];

/* ================================================================== */
/*  QUESTION BANK                                                      */
/* ================================================================== */

export const questionBank: AnyQuestion[] = [
  /* ────────────────────────────────────────────────────────────────── */
  /*  TRUE / FALSE  (18)                                               */
  /* ────────────────────────────────────────────────────────────────── */

  // 1
  {
    id: "tf-circ-01",
    type: "tf",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question: "Arteries typically carry blood away from the heart.",
    isTrue: true,
    explanation:
      "Arteries are the blood vessels that carry blood away from the heart to the body's tissues and organs.",
    hint: "Think about which direction arteries push blood.",
  },
  // 2
  {
    id: "tf-circ-02",
    type: "tf",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: false,
    question:
      "The circulatory system carries out the life process of nutrition.",
    isTrue: false,
    explanation:
      "The circulatory system carries out the life process of transport, not nutrition. It transports oxygen, nutrients, and waste products throughout the body.",
    hint: "What is the primary life process the circulatory system performs?",
  },
  // 3
  {
    id: "tf-circ-03",
    type: "tf",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question:
      "Red blood cells are responsible for carrying oxygen to the cells.",
    isTrue: true,
    explanation:
      "Red blood cells (erythrocytes) contain hemoglobin, a protein that binds to oxygen and transports it from the lungs to every cell in the body.",
    hint: "Consider which blood component contains hemoglobin.",
  },
  // 4
  {
    id: "tf-circ-04",
    type: "tf",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question: "Capillaries typically carry blood back toward the heart.",
    isTrue: false,
    explanation:
      "Veins carry blood back toward the heart, not capillaries. Capillaries are the tiny vessels where gas and nutrient exchange occurs between blood and tissues.",
    hint: "Which blood vessels return blood to the heart?",
  },
  // 5
  {
    id: "tf-circ-05",
    type: "tf",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question: "Valves prevent the backward flow of blood.",
    isTrue: true,
    explanation:
      "Valves in the heart and veins ensure blood flows in one direction only, preventing backflow and maintaining efficient circulation.",
    hint: "Think about what keeps blood moving in the correct direction.",
  },
  // 6
  {
    id: "tf-circ-06",
    type: "tf",
    topic: "circulatory",
    difficulty: 2,
    onMainTest: true,
    question:
      "The left side of the heart typically contains oxygenated blood.",
    isTrue: true,
    explanation:
      "The left side of the heart receives oxygenated blood from the lungs via the pulmonary veins and pumps it out to the body through the aorta.",
    hint: "Where does blood go after picking up oxygen in the lungs?",
  },
  // 7
  {
    id: "tf-circ-07",
    type: "tf",
    topic: "circulatory",
    difficulty: 2,
    onMainTest: false,
    question: "Blood clotting is controlled by plasma.",
    isTrue: false,
    explanation:
      "Blood clotting is controlled by platelets (thrombocytes), not plasma. Platelets clump together at the site of a wound to form a plug and release chemicals that trigger the clotting cascade.",
    hint: "Which blood component forms clots at wound sites?",
  },
  // 8
  {
    id: "tf-dig-01",
    type: "tf",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question: "Chemical digestion begins in the stomach.",
    isTrue: false,
    explanation:
      "Chemical digestion actually begins in the mouth, where salivary amylase starts breaking down starches (carbohydrates) into simpler sugars.",
    hint: "What enzyme in saliva breaks down starch?",
  },
  // 9
  {
    id: "tf-dig-02",
    type: "tf",
    topic: "digestive",
    difficulty: 2,
    onMainTest: false,
    question:
      "The esophagus performs both physical and chemical digestion.",
    isTrue: false,
    explanation:
      "The esophagus does not perform any digestion. It simply transports food from the pharynx to the stomach via peristalsis (rhythmic muscle contractions).",
    hint: "What is the sole function of the esophagus?",
  },
  // 10
  {
    id: "tf-dig-03",
    type: "tf",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question: "The gallbladder produces bile.",
    isTrue: false,
    explanation:
      "The liver produces bile, not the gallbladder. The gallbladder only stores and concentrates bile until it is needed to help emulsify fats in the small intestine.",
    hint: "Which organ produces bile, and which stores it?",
  },
  // 11
  {
    id: "tf-dig-04",
    type: "tf",
    topic: "digestive",
    difficulty: 1,
    onMainTest: true,
    question:
      "Villi increase the surface area for nutrient absorption in the small intestine.",
    isTrue: true,
    explanation:
      "Villi are tiny finger-like projections lining the small intestine that dramatically increase the surface area available for absorbing nutrients into the bloodstream.",
    hint: "Think about why the small intestine has a folded inner surface.",
  },
  // 12
  {
    id: "tf-resp-01",
    type: "tf",
    topic: "respiratory",
    difficulty: 2,
    onMainTest: true,
    question: "The diaphragm is made of smooth muscle.",
    isTrue: false,
    explanation:
      "The diaphragm is made of skeletal muscle, not smooth muscle. It is one of the few skeletal muscles involved in an involuntary reflex (breathing), though it can also be controlled voluntarily.",
    hint: "Is the diaphragm under voluntary or involuntary control — or both?",
  },
  // 13
  {
    id: "tf-resp-02",
    type: "tf",
    topic: "respiratory",
    difficulty: 1,
    onMainTest: true,
    question: "Gas exchange occurs in the bronchi.",
    isTrue: false,
    explanation:
      "Gas exchange occurs in the alveoli, not the bronchi. The bronchi are conducting airways that branch off from the trachea and direct air deeper into the lungs.",
    hint: "Which tiny structures at the ends of bronchioles are specialized for gas exchange?",
  },
  // 14
  {
    id: "tf-resp-03",
    type: "tf",
    topic: "respiratory",
    difficulty: 1,
    onMainTest: true,
    question:
      "The epiglottis prevents food from entering the trachea.",
    isTrue: true,
    explanation:
      "The epiglottis is a cartilage flap that closes over the trachea during swallowing, directing food into the esophagus and preventing it from entering the airway.",
    hint: "What structure acts as a 'switch' between the trachea and esophagus?",
  },
  // 15
  {
    id: "tf-resp-04",
    type: "tf",
    topic: "respiratory",
    difficulty: 2,
    onMainTest: false,
    question: "Bronchioles are lined with smooth muscle tissue.",
    isTrue: true,
    explanation:
      "Bronchioles are lined with smooth muscle, which allows them to constrict or dilate to regulate airflow into the lungs. This is the mechanism affected during an asthma attack.",
    hint: "What type of muscle controls the diameter of airways?",
  },
  // 16
  {
    id: "tf-tiss-01",
    type: "tf",
    topic: "tissues",
    difficulty: 1,
    onMainTest: true,
    question: "Cardiac muscle is under voluntary control.",
    isTrue: false,
    explanation:
      "Cardiac muscle is under involuntary control. It contracts automatically and rhythmically without conscious effort, regulated by the heart's own electrical system.",
    hint: "Do you consciously decide to make your heart beat?",
  },
  // 17
  {
    id: "tf-tiss-02",
    type: "tf",
    topic: "tissues",
    difficulty: 1,
    onMainTest: true,
    question: "Skeletal muscle is attached to bones by tendons.",
    isTrue: true,
    explanation:
      "Skeletal muscles are attached to bones by strong connective tissue called tendons. When skeletal muscles contract, they pull on tendons, which move bones.",
    hint: "What connective tissue connects muscle to bone?",
  },
  // 18
  {
    id: "tf-circ-08",
    type: "tf",
    topic: "circulatory",
    difficulty: 2,
    onMainTest: true,
    question: "Pulmonary veins carry deoxygenated blood.",
    isTrue: false,
    explanation:
      "Pulmonary veins are the exception to the rule: they carry oxygenated blood from the lungs back to the left atrium of the heart. It is the pulmonary arteries that carry deoxygenated blood from the heart to the lungs.",
    hint: "Pulmonary circulation is the exception — arteries and veins swap their usual roles.",
  },

  /* ────────────────────────────────────────────────────────────────── */
  /*  FILL IN THE BLANK  (18)                                          */
  /* ────────────────────────────────────────────────────────────────── */

  // 1
  {
    id: "fib-dig-01",
    type: "fib",
    topic: "digestive",
    difficulty: 1,
    onMainTest: true,
    question: "The digestive tract extends from the ___ to the ___.",
    blanks: ["mouth", "anus"],
    acceptableAnswers: [["mouth", "oral cavity"], ["anus", "rectum"]],
    explanation:
      "The digestive tract (alimentary canal) is a continuous tube that begins at the mouth, where food enters, and ends at the anus, where waste is expelled.",
    hint: "Where does food enter the body and where does solid waste leave?",
  },
  // 2
  {
    id: "fib-dig-02",
    type: "fib",
    topic: "digestive",
    difficulty: 1,
    onMainTest: true,
    question:
      "The enzyme in saliva that breaks down carbohydrates is called ___.",
    blanks: ["salivary amylase"],
    acceptableAnswers: [["salivary amylase", "amylase"]],
    explanation:
      "Salivary amylase is secreted by the salivary glands and begins the chemical digestion of starches into simpler sugars right in the mouth.",
    hint: "This enzyme's name contains the word for starch.",
  },
  // 3
  {
    id: "fib-dig-03",
    type: "fib",
    topic: "digestive",
    difficulty: 1,
    onMainTest: true,
    question:
      "Rhythmic smooth muscle contractions in the esophagus are called ___.",
    blanks: ["peristalsis"],
    acceptableAnswers: [["peristalsis"]],
    explanation:
      "Peristalsis is the wave-like contraction of smooth muscles that pushes food through the digestive tract. It occurs throughout the GI tract, not just the esophagus.",
    hint: "This wave-like motion moves food even if you're upside down.",
  },
  // 4
  {
    id: "fib-dig-04",
    type: "fib",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question:
      "The stomach secretes ___ acid and the enzyme ___ to digest proteins.",
    blanks: ["hydrochloric", "pepsin"],
    acceptableAnswers: [["hydrochloric", "HCl"], ["pepsin"]],
    explanation:
      "The stomach lining secretes hydrochloric acid (HCl) to create an acidic environment (pH ~2) and the enzyme pepsin, which breaks down proteins into smaller peptides.",
    hint: "The acid's chemical formula is HCl; the enzyme's name starts with 'pep-'.",
  },
  // 5
  {
    id: "fib-dig-05",
    type: "fib",
    topic: "digestive",
    difficulty: 2,
    onMainTest: false,
    question:
      "Bile is an ___ agent that physically breaks down fats.",
    blanks: ["emulsifying"],
    acceptableAnswers: [["emulsifying", "emulsification"]],
    explanation:
      "Bile acts as an emulsifying agent, breaking large fat globules into smaller droplets. This increases the surface area so lipase enzymes can digest the fats more efficiently.",
    hint: "This process breaks large fat droplets into tiny ones — like dish soap on grease.",
  },
  // 6
  {
    id: "fib-dig-06",
    type: "fib",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question:
      "The pancreas produces the hormones ___ and ___ to regulate blood sugar.",
    blanks: ["insulin", "glucagon"],
    acceptableAnswers: [["insulin"], ["glucagon"]],
    explanation:
      "The pancreas has an endocrine function: it produces insulin (lowers blood sugar by promoting glucose uptake) and glucagon (raises blood sugar by triggering glycogen breakdown).",
    hint: "One hormone lowers blood sugar, the other raises it.",
  },
  // 7
  {
    id: "fib-dig-07",
    type: "fib",
    topic: "digestive",
    difficulty: 1,
    onMainTest: true,
    question:
      "Tiny finger-like projections in the small intestine called ___ increase surface area.",
    blanks: ["villi"],
    acceptableAnswers: [["villi"]],
    explanation:
      "Villi are microscopic finger-like projections that line the walls of the small intestine, dramatically increasing the surface area available for nutrient absorption.",
    hint: "These structures look like tiny fingers covering the intestinal wall.",
  },
  // 8
  {
    id: "fib-circ-01",
    type: "fib",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question:
      "Oxygen attaches to the protein ___ in red blood cells.",
    blanks: ["hemoglobin"],
    acceptableAnswers: [["hemoglobin", "haemoglobin"]],
    explanation:
      "Hemoglobin is an iron-containing protein in red blood cells that binds oxygen in the lungs and releases it in the tissues. It also gives red blood cells their colour.",
    hint: "This protein contains iron and gives blood its red colour.",
  },
  // 9
  {
    id: "fib-inter-01",
    type: "fib",
    topic: "interactions",
    difficulty: 2,
    onMainTest: true,
    question:
      "The process where mitochondria use oxygen to produce ATP is called ___.",
    blanks: ["cellular respiration"],
    acceptableAnswers: [["cellular respiration", "aerobic respiration"]],
    explanation:
      "Cellular respiration is the metabolic process occurring in the mitochondria where glucose and oxygen are converted into ATP (energy), carbon dioxide, and water.",
    hint: "This process happens inside mitochondria and requires oxygen.",
  },
  // 10
  {
    id: "fib-resp-01",
    type: "fib",
    topic: "respiratory",
    difficulty: 1,
    onMainTest: true,
    question:
      "The ___ is a cartilage flap that prevents food from entering the trachea.",
    blanks: ["epiglottis"],
    acceptableAnswers: [["epiglottis"]],
    explanation:
      "The epiglottis is a leaf-shaped flap of cartilage that covers the opening of the larynx during swallowing, preventing food and liquids from entering the trachea.",
    hint: "Its name starts with 'epi-' meaning 'above' — it sits above the glottis.",
  },
  // 11
  {
    id: "fib-resp-02",
    type: "fib",
    topic: "respiratory",
    difficulty: 1,
    onMainTest: true,
    question: "Gas exchange occurs in tiny air sacs called ___.",
    blanks: ["alveoli"],
    acceptableAnswers: [["alveoli"]],
    explanation:
      "Alveoli are grape-like clusters of tiny air sacs at the ends of bronchioles. Their thin walls (one cell thick) and large total surface area make them ideal for gas exchange.",
    hint: "These grape-like clusters are found at the very ends of the respiratory pathway.",
  },
  // 12
  {
    id: "fib-resp-03",
    type: "fib",
    topic: "respiratory",
    difficulty: 1,
    onMainTest: true,
    question: "The trachea splits into two branches called ___.",
    blanks: ["bronchi"],
    acceptableAnswers: [["bronchi", "primary bronchi", "main bronchi"]],
    explanation:
      "The trachea (windpipe) divides into the left and right bronchi, each leading to one lung. The bronchi continue to branch into smaller bronchioles.",
    hint: "These two tubes each lead to one lung.",
  },
  // 13
  {
    id: "fib-circ-03",
    type: "fib",
    topic: "circulatory",
    difficulty: 2,
    onMainTest: true,
    question:
      "The ___ vena cava brings blood from the upper body and the ___ vena cava from the lower body.",
    blanks: ["superior", "inferior"],
    acceptableAnswers: [["superior"], ["inferior"]],
    explanation:
      "The superior vena cava collects deoxygenated blood from the head, arms, and upper body, while the inferior vena cava collects it from the legs and lower body. Both empty into the right atrium.",
    hint: "'Superior' means above; 'inferior' means below.",
  },
  // 14
  {
    id: "fib-circ-04",
    type: "fib",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question: "The largest artery in the body is the ___.",
    blanks: ["aorta"],
    acceptableAnswers: [["aorta"]],
    explanation:
      "The aorta is the largest artery in the body. It receives oxygenated blood from the left ventricle and distributes it to all parts of the body through its many branches.",
    hint: "This vessel exits the left ventricle of the heart.",
  },
  // 15
  {
    id: "fib-circ-05",
    type: "fib",
    topic: "circulatory",
    difficulty: 2,
    onMainTest: false,
    question: "Humans have a closed, ___ circulatory system.",
    blanks: ["double"],
    acceptableAnswers: [["double"]],
    explanation:
      "Humans have a double circulatory system: one circuit (pulmonary) sends blood to the lungs for gas exchange, and the other (systemic) sends blood to the rest of the body.",
    hint: "Blood passes through the heart twice in one full loop — once for the lungs, once for the body.",
  },
  // 16
  {
    id: "fib-circ-06",
    type: "fib",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question:
      "Blood vessels that carry blood toward the heart are called ___.",
    blanks: ["veins"],
    acceptableAnswers: [["veins"]],
    explanation:
      "Veins are the blood vessels that return blood to the heart. They have thinner walls than arteries and contain valves to prevent backflow.",
    hint: "These vessels have valves and thinner walls than arteries.",
  },
  // 17
  {
    id: "fib-circ-07",
    type: "fib",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question:
      "The smallest blood vessels where gas exchange occurs are ___.",
    blanks: ["capillaries"],
    acceptableAnswers: [["capillaries"]],
    explanation:
      "Capillaries are the smallest blood vessels, with walls only one cell thick. This allows oxygen, nutrients, and waste products to pass between the blood and surrounding tissues.",
    hint: "Their walls are only one cell thick to allow diffusion.",
  },
  // 18
  {
    id: "fib-tiss-01",
    type: "fib",
    topic: "tissues",
    difficulty: 1,
    onMainTest: true,
    question:
      "The three types of muscle tissue are ___, ___, and ___.",
    blanks: ["skeletal", "smooth", "cardiac"],
    acceptableAnswers: [
      ["skeletal", "striated"],
      ["smooth", "visceral"],
      ["cardiac", "heart"],
    ],
    explanation:
      "The three types of muscle tissue are: skeletal (voluntary, striated, attached to bones), smooth (involuntary, found in organ walls), and cardiac (involuntary, striated, found only in the heart).",
    hint: "One is attached to bones, one lines organs, and one is found only in the heart.",
  },

  /* ────────────────────────────────────────────────────────────────── */
  /*  MATCHING  (7 sets)                                               */
  /* ────────────────────────────────────────────────────────────────── */

  // Set 1 — Digestive organs → functions
  {
    id: "match-dig-01",
    type: "match",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question: "Match each digestive organ to its primary function.",
    pairs: [
      {
        left: "Mouth",
        right: "Mechanical and chemical digestion (teeth + salivary amylase)",
      },
      {
        left: "Esophagus",
        right: "Transports food to the stomach via peristalsis",
      },
      {
        left: "Stomach",
        right: "Churns food and digests proteins with HCl and pepsin",
      },
      {
        left: "Small intestine",
        right: "Completes chemical digestion and absorbs nutrients",
      },
      {
        left: "Large intestine",
        right: "Absorbs water and forms solid waste",
      },
    ],
    explanation:
      "Each organ of the digestive tract has a specialized role: the mouth begins digestion, the esophagus transports, the stomach handles protein digestion, the small intestine absorbs nutrients, and the large intestine absorbs water.",
  },

  // Set 2 — Accessory organs → roles
  {
    id: "match-dig-02",
    type: "match",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question: "Match each accessory organ to its role in digestion.",
    pairs: [
      { left: "Liver", right: "Produces bile to emulsify fats" },
      { left: "Gallbladder", right: "Stores and concentrates bile" },
      {
        left: "Pancreas",
        right: "Produces digestive enzymes and hormones (insulin, glucagon)",
      },
    ],
    explanation:
      "The three accessory organs support digestion without food passing through them directly. The liver produces bile, the gallbladder stores bile, and the pancreas produces enzymes and hormones.",
  },

  // Set 3 — Respiratory structures → functions
  {
    id: "match-resp-01",
    type: "match",
    topic: "respiratory",
    difficulty: 2,
    onMainTest: true,
    question:
      "Match each respiratory structure to its function.",
    pairs: [
      {
        left: "Nasal cavity",
        right: "Warms, moistens, and filters incoming air",
      },
      {
        left: "Epiglottis",
        right: "Prevents food from entering the trachea",
      },
      {
        left: "Trachea",
        right: "Conducts air from the larynx toward the lungs; kept open by cartilage rings",
      },
      {
        left: "Bronchioles",
        right: "Small airways lined with smooth muscle that regulate airflow",
      },
      {
        left: "Alveoli",
        right: "Tiny air sacs where gas exchange occurs",
      },
      {
        left: "Diaphragm",
        right: "Skeletal muscle that contracts to create negative pressure for inhalation",
      },
    ],
    explanation:
      "The respiratory system moves air through a series of structures from the nasal cavity to the alveoli, where oxygen enters the blood and carbon dioxide is released.",
  },

  // Set 4 — Blood vessels → characteristics
  {
    id: "match-circ-01",
    type: "match",
    topic: "circulatory",
    difficulty: 2,
    onMainTest: true,
    question:
      "Match each type of blood vessel to its key characteristics.",
    pairs: [
      {
        left: "Arteries",
        right: "Thick, muscular walls; carry blood away from the heart under high pressure",
      },
      {
        left: "Veins",
        right: "Thinner walls with valves; carry blood toward the heart under low pressure",
      },
      {
        left: "Capillaries",
        right: "Walls one cell thick; site of gas and nutrient exchange",
      },
    ],
    explanation:
      "Arteries handle high-pressure blood flow from the heart, veins return blood at lower pressure using valves, and capillaries enable exchange between blood and tissues.",
  },

  // Set 5 — Tissue types → features
  {
    id: "match-tiss-01",
    type: "match",
    topic: "tissues",
    difficulty: 2,
    onMainTest: true,
    question: "Match each tissue type to its key feature.",
    pairs: [
      {
        left: "Epithelial tissue",
        right: "Covers body surfaces and lines organs; protective barrier",
      },
      {
        left: "Muscle tissue",
        right: "Contracts to produce movement",
      },
      {
        left: "Connective tissue",
        right: "Supports, connects, and separates tissues and organs (e.g., bone, blood, cartilage)",
      },
      {
        left: "Nervous tissue",
        right: "Transmits electrical signals to coordinate body functions",
      },
    ],
    explanation:
      "The four primary tissue types each serve a fundamental role: epithelial protects, muscle moves, connective supports, and nervous communicates.",
  },

  // Set 6 — Blood components → functions
  {
    id: "match-circ-02",
    type: "match",
    topic: "circulatory",
    difficulty: 2,
    onMainTest: true,
    question: "Match each blood component to its function.",
    pairs: [
      {
        left: "Plasma",
        right: "Liquid portion that transports nutrients, hormones, and waste",
      },
      {
        left: "Red blood cells",
        right: "Carry oxygen using hemoglobin",
      },
      {
        left: "White blood cells",
        right: "Fight infection and provide immune defence",
      },
      {
        left: "Platelets",
        right: "Help with blood clotting at wound sites",
      },
    ],
    explanation:
      "Blood is composed of plasma (liquid), red blood cells (oxygen transport), white blood cells (immune defence), and platelets (clotting).",
  },

  // Set 7 — Tissues found in the digestive system
  {
    id: "match-dig-03",
    type: "match",
    topic: "digestive",
    difficulty: 2,
    onMainTest: false,
    question:
      "Match each tissue type to its role in the digestive system.",
    pairs: [
      {
        left: "Epithelial tissue",
        right: "Lines the digestive tract and absorbs nutrients",
      },
      {
        left: "Smooth muscle tissue",
        right: "Contracts to move food through the tract (peristalsis)",
      },
      {
        left: "Nervous tissue",
        right: "Coordinates digestive processes and detects stretching",
      },
    ],
    explanation:
      "Multiple tissue types work together in the digestive system: epithelial tissue lines and absorbs, smooth muscle moves food, and nervous tissue coordinates the process.",
  },

  /* ────────────────────────────────────────────────────────────────── */
  /*  ORDERING  (4 sequences)                                          */
  /* ────────────────────────────────────────────────────────────────── */

  // 1 — Path of food
  {
    id: "order-dig-01",
    type: "order",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question:
      "Arrange the organs in the correct order of the path food takes through the digestive system.",
    items: [
      "Mouth",
      "Pharynx",
      "Esophagus",
      "Stomach",
      "Small intestine",
      "Large intestine",
      "Rectum",
      "Anus",
    ],
    explanation:
      "Food travels from the mouth → pharynx → esophagus → stomach → small intestine (digestion and absorption) → large intestine (water absorption) → rectum → anus (elimination).",
    hint: "Start where food enters and end where waste exits.",
  },

  // 2 — Path of air
  {
    id: "order-resp-01",
    type: "order",
    topic: "respiratory",
    difficulty: 2,
    onMainTest: true,
    question:
      "Arrange the structures in the correct order of the path air takes through the respiratory system.",
    items: [
      "Nasal cavity",
      "Pharynx",
      "Epiglottis",
      "Larynx",
      "Trachea",
      "Bronchi",
      "Bronchioles",
      "Alveoli",
    ],
    explanation:
      "Air enters the nasal cavity → pharynx → past the epiglottis → larynx → trachea → bronchi → bronchioles → alveoli (where gas exchange occurs).",
    hint: "Air enters the nose and ends at the tiny sacs where gas exchange happens.",
  },

  // 3 — Blood path through the heart and body
  {
    id: "order-circ-01",
    type: "order",
    topic: "circulatory",
    difficulty: 3,
    onMainTest: true,
    question:
      "Arrange the structures in the correct order of blood flow through the heart and body.",
    items: [
      "Vena Cava",
      "Right Atrium",
      "Right Ventricle",
      "Pulmonary Artery",
      "Lungs",
      "Pulmonary Vein",
      "Left Atrium",
      "Left Ventricle",
      "Aorta",
    ],
    explanation:
      "Deoxygenated blood returns via the vena cava → right atrium → right ventricle → pulmonary artery → lungs (gas exchange) → pulmonary vein → left atrium → left ventricle → aorta (out to the body).",
    hint: "Start with blood returning to the heart and follow it through both circuits.",
  },

  // 4 — Levels of organization
  {
    id: "order-tiss-01",
    type: "order",
    topic: "tissues",
    difficulty: 1,
    onMainTest: true,
    question:
      "Arrange the levels of biological organization from smallest to largest.",
    items: ["Cell", "Tissue", "Organ", "Organ System", "Organism"],
    explanation:
      "The hierarchy of life goes from individual cells → groups of similar cells forming tissues → tissues forming organs → organs working together in organ systems → the complete organism.",
    hint: "Start with the basic unit of life.",
  },

  /* ────────────────────────────────────────────────────────────────── */
  /*  SHORT ANSWER  (10)                                               */
  /* ────────────────────────────────────────────────────────────────── */

  // 1
  {
    id: "sa-tiss-01",
    type: "sa",
    topic: "tissues",
    difficulty: 3,
    onMainTest: true,
    question:
      "Describe the role of at least three different types of tissues found in the stomach.",
    keyPoints: [
      "Epithelial tissue lines the stomach interior and secretes mucus, HCl, and pepsin.",
      "Smooth muscle tissue contracts to churn and mix food (mechanical digestion).",
      "Nervous tissue coordinates the timing and intensity of muscle contractions and gland secretions.",
      "Connective tissue provides structural support and contains blood vessels that supply the stomach wall.",
    ],
    modelAnswer:
      "The stomach contains multiple tissue types working together. Epithelial tissue lines the inner surface and contains specialized cells that secrete mucus (to protect the stomach wall), hydrochloric acid, and the enzyme pepsin for protein digestion. Smooth muscle tissue forms several layers in the stomach wall and contracts rhythmically to churn and mix food with digestive juices, performing mechanical digestion. Nervous tissue in the stomach wall coordinates the contractions of the smooth muscle and regulates secretion from gland cells, ensuring the digestive process is timed correctly. Connective tissue provides structural support and houses blood vessels that deliver oxygen and nutrients to the stomach tissues.",
    hint: "Think about the four basic tissue types and which ones are present in the stomach wall.",
  },

  // 2
  {
    id: "sa-dig-01",
    type: "sa",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question:
      "Identify the three accessory organs of the digestive system and describe each one's contribution to digestion.",
    keyPoints: [
      "The liver produces bile, which emulsifies fats into smaller droplets.",
      "The gallbladder stores and concentrates bile, releasing it into the small intestine when needed.",
      "The pancreas produces digestive enzymes (lipase, amylase, protease) and the hormones insulin and glucagon.",
    ],
    modelAnswer:
      "The three accessory organs are the liver, gallbladder, and pancreas. The liver produces bile, a substance that acts as an emulsifying agent to break large fat globules into smaller droplets, increasing the surface area for enzyme action. The gallbladder stores and concentrates bile produced by the liver, releasing it into the duodenum of the small intestine during digestion. The pancreas has a dual role: it produces digestive enzymes (such as lipase, amylase, and protease) that are released into the small intestine, and it produces the hormones insulin and glucagon, which regulate blood sugar levels.",
    hint: "These organs help digestion without food passing directly through them.",
  },

  // 3
  {
    id: "sa-dig-02",
    type: "sa",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question:
      "What are villi? Why are they beneficial for the function of the small intestine?",
    keyPoints: [
      "Villi are tiny finger-like projections lining the wall of the small intestine.",
      "They dramatically increase the surface area of the small intestine.",
      "Greater surface area allows for more efficient and faster absorption of nutrients into the bloodstream.",
      "Each villus contains capillaries and a lacteal for absorbing nutrients.",
    ],
    modelAnswer:
      "Villi are tiny finger-like projections that line the inner wall of the small intestine. They are beneficial because they dramatically increase the surface area available for nutrient absorption — by hundreds of times compared to a smooth surface. Each villus is supplied with a network of capillaries and a lacteal (lymph vessel), which allows digested nutrients such as amino acids, simple sugars, and fatty acids to be efficiently absorbed into the bloodstream and lymphatic system. Without villi, nutrient absorption would be far too slow to sustain the body's needs.",
    hint: "Think about why surface area matters for absorption.",
  },

  // 4
  {
    id: "sa-dig-03",
    type: "sa",
    topic: "digestive",
    difficulty: 3,
    onMainTest: true,
    question:
      "Celiac disease causes the villi in the small intestine to become flattened. Explain why a person with celiac disease might experience weight loss and fatigue.",
    keyPoints: [
      "Flattened villi drastically reduce the surface area of the small intestine.",
      "Reduced surface area impairs the absorption of nutrients (carbohydrates, fats, proteins, vitamins).",
      "Poor nutrient absorption means the body receives less energy from food, leading to weight loss.",
      "Without adequate nutrients and energy, cells cannot perform cellular respiration efficiently, causing fatigue.",
    ],
    modelAnswer:
      "In celiac disease, an immune reaction to gluten damages and flattens the villi in the small intestine. Since villi are responsible for the vast majority of nutrient absorption, their flattening drastically reduces the intestinal surface area. With less surface area, the small intestine cannot absorb sufficient nutrients — including carbohydrates, fats, proteins, and essential vitamins. The body receives less energy from food, which leads to weight loss over time. Additionally, because cells are deprived of the glucose and oxygen-derived energy they need for cellular respiration, the person experiences chronic fatigue. In essence, the food is digested but not adequately absorbed, so the body is starved of the resources it needs.",
    hint: "Connect villi damage → reduced surface area → reduced absorption → consequences for the body.",
  },

  // 5
  {
    id: "sa-resp-01",
    type: "sa",
    topic: "respiratory",
    difficulty: 2,
    onMainTest: true,
    question:
      "Which respiratory structure is primarily involved in an asthma attack? Explain what happens during the attack.",
    keyPoints: [
      "Bronchioles are the structures primarily affected during an asthma attack.",
      "The smooth muscle surrounding the bronchioles contracts excessively (bronchospasm).",
      "The lining of the bronchioles becomes inflamed and swollen.",
      "Excess mucus is produced, further narrowing the airways and making breathing difficult.",
    ],
    modelAnswer:
      "The bronchioles are the respiratory structures primarily involved in an asthma attack. During an attack, the smooth muscle that lines the bronchioles contracts excessively (a bronchospasm), causing the airways to narrow significantly. At the same time, the inner lining of the bronchioles becomes inflamed and swollen, and excess mucus is produced. Together, these changes drastically reduce the diameter of the airways, restricting airflow to and from the alveoli. This is why a person experiencing an asthma attack has difficulty breathing, wheezing, and shortness of breath. Inhalers work by relaxing the smooth muscle to reopen the airways.",
    hint: "Think about which structures have smooth muscle that can constrict.",
  },

  // 6
  {
    id: "sa-resp-02",
    type: "sa",
    topic: "respiratory",
    difficulty: 2,
    onMainTest: true,
    question:
      "Why are the epithelial cells of the alveoli only one cell thick?",
    keyPoints: [
      "Alveoli are the site of gas exchange between the lungs and blood.",
      "Being one cell thick minimizes the distance gases must diffuse across.",
      "Shorter diffusion distance allows oxygen and carbon dioxide to exchange rapidly and efficiently.",
      "This thin wall is essential for the body to take in oxygen and expel CO₂ at the rate needed to sustain life.",
    ],
    modelAnswer:
      "The alveolar epithelial cells are only one cell thick because their primary function is gas exchange, and diffusion efficiency depends directly on distance. Oxygen from inhaled air must pass through the alveolar wall and into the surrounding capillaries, while carbon dioxide must move in the opposite direction. If the alveolar walls were thicker, gases would have to diffuse across a greater distance, which would slow the exchange dramatically. By being just one cell thick, the alveoli provide the shortest possible diffusion pathway, ensuring that oxygen and carbon dioxide can be exchanged rapidly enough to meet the body's metabolic demands.",
    hint: "Think about how wall thickness affects the rate of diffusion.",
  },

  // 7
  {
    id: "sa-inter-01",
    type: "sa",
    topic: "interactions",
    difficulty: 3,
    onMainTest: true,
    question:
      "Describe how the respiratory and circulatory systems interact to deliver oxygen to body cells.",
    keyPoints: [
      "The respiratory system brings air to the alveoli, where oxygen diffuses into the blood in surrounding capillaries.",
      "Oxygen binds to hemoglobin in red blood cells.",
      "The circulatory system (heart and blood vessels) transports oxygenated blood from the lungs to body cells.",
      "At the tissues, oxygen diffuses from capillaries into cells, while CO₂ moves in the opposite direction.",
    ],
    modelAnswer:
      "The respiratory and circulatory systems work in concert to deliver oxygen to every cell. First, the respiratory system draws air into the lungs through the airways (nasal cavity, trachea, bronchi, bronchioles) until it reaches the alveoli. In the alveoli, oxygen diffuses across the thin epithelial walls into the surrounding capillaries, where it binds to hemoglobin in red blood cells. The circulatory system then transports this oxygenated blood through the pulmonary veins to the left side of the heart, which pumps it via arteries and arterioles to capillary beds throughout the body. At the tissue level, oxygen diffuses from the capillaries into the cells, where it is used in cellular respiration to produce ATP. Simultaneously, carbon dioxide (a waste product) diffuses from cells into the blood and is transported back to the lungs, where it is exhaled. Neither system can fulfill its purpose without the other.",
    hint: "Trace the journey of an oxygen molecule from the air to a body cell.",
  },

  // 8
  {
    id: "sa-inter-02",
    type: "sa",
    topic: "interactions",
    difficulty: 3,
    onMainTest: true,
    question:
      "Describe how the digestive, respiratory, and circulatory systems interact to produce ATP through cellular respiration.",
    keyPoints: [
      "The digestive system breaks down food to release glucose (and other nutrients) into the blood.",
      "The respiratory system takes in oxygen from inhaled air and delivers it to the blood at the alveoli.",
      "The circulatory system transports both glucose and oxygen to body cells.",
      "In the mitochondria of cells, glucose and oxygen undergo cellular respiration to produce ATP, with CO₂ and water as byproducts.",
    ],
    modelAnswer:
      "Cellular respiration requires both glucose and oxygen, and three organ systems cooperate to supply them. The digestive system mechanically and chemically breaks down food, ultimately producing glucose and other simple nutrients that are absorbed through the villi of the small intestine into the bloodstream. The respiratory system brings oxygen into the body through the airways to the alveoli, where it diffuses into the blood. The circulatory system then acts as the delivery network, transporting glucose and oxygen through the blood to every cell in the body. Inside cells, the mitochondria combine glucose and oxygen in cellular respiration (C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP), producing ATP (usable energy), carbon dioxide, and water. The circulatory system then carries CO₂ back to the lungs, where the respiratory system exhales it. Without any one of these systems, cellular respiration — and therefore life — could not be sustained.",
    hint: "Think about what two inputs cellular respiration needs and which system provides each.",
  },

  // 9
  {
    id: "sa-inter-03",
    type: "sa",
    topic: "interactions",
    difficulty: 3,
    onMainTest: true,
    question:
      "Describe how at least three organ systems interact when you walk to class. Be specific about the role of each system.",
    keyPoints: [
      "The muscular system (skeletal muscles) contracts to move the legs and body.",
      "The skeletal system provides the structural framework and levers that muscles pull on.",
      "The nervous system sends electrical signals from the brain to muscles, coordinating movement and balance.",
      "The respiratory system increases breathing rate to supply more oxygen for the increased energy demand.",
      "The circulatory system increases heart rate and blood flow to deliver more oxygen and glucose to active muscles.",
    ],
    modelAnswer:
      "Walking to class requires the coordinated effort of multiple organ systems. The nervous system initiates and coordinates the activity: the brain sends electrical impulses through motor neurons to skeletal muscles, telling them when and how forcefully to contract, while also processing balance and spatial information from sensory neurons. The muscular system responds by contracting skeletal muscles in the legs, core, and arms to produce movement. These muscles pull on bones of the skeletal system, which act as levers and provide structural support. As muscles work harder, they require more ATP, so the respiratory system increases the breathing rate and depth to take in more oxygen and expel more CO₂. Simultaneously, the circulatory system raises the heart rate to pump more oxygenated blood and glucose to the active muscle cells and to carry away waste products like carbon dioxide and lactic acid. All of these systems must work together seamlessly for something as routine as walking to class.",
    hint: "Think about what your muscles need to contract and which systems provide it.",
  },

  // 10
  {
    id: "sa-dig-04",
    type: "sa",
    topic: "digestive",
    difficulty: 3,
    onMainTest: false,
    question:
      "Explain why heartburn occurs and why the esophagus is more affected by stomach acid than the stomach itself.",
    keyPoints: [
      "Heartburn occurs when stomach acid (HCl) flows backward (refluxes) into the esophagus.",
      "The stomach is lined with a thick layer of mucus secreted by epithelial cells, protecting it from its own acid.",
      "The esophagus lacks this protective mucus lining.",
      "Without protection, the acid irritates and damages the esophageal epithelial tissue, causing a burning sensation.",
    ],
    modelAnswer:
      "Heartburn occurs when the sphincter at the top of the stomach (the lower esophageal sphincter) fails to close properly, allowing hydrochloric acid and partially digested food to flow backward (reflux) into the esophagus. The stomach itself is well-protected against its own acid because its epithelial lining secretes a thick layer of alkaline mucus that coats the inner surface and acts as a barrier. The stomach lining also rapidly regenerates damaged cells. The esophagus, however, was not designed to withstand such acidic conditions — it lacks the stomach's specialized mucus barrier. When acid contacts the unprotected epithelial tissue of the esophagus, it irritates and can damage the cells, resulting in the burning sensation known as heartburn. Chronic acid reflux can lead to more serious conditions as the esophageal lining becomes repeatedly injured.",
    hint: "Compare the protective features of the stomach lining to those of the esophagus.",
  },

  /* ────────────────────────────────────────────────────────────────── */
  /*  MULTIPLE CHOICE  (15)                                            */
  /* ────────────────────────────────────────────────────────────────── */

  // 1
  {
    id: "mc-dig-01",
    type: "mc",
    topic: "digestive",
    difficulty: 1,
    onMainTest: true,
    question: "Where does chemical digestion first begin?",
    options: ["Stomach", "Mouth", "Small intestine", "Esophagus"],
    correctIndex: 1,
    explanation:
      "Chemical digestion begins in the mouth, where salivary amylase starts breaking down starches into simpler sugars.",
    hint: "Think about what enzyme is in your saliva.",
  },
  // 2
  {
    id: "mc-dig-02",
    type: "mc",
    topic: "digestive",
    difficulty: 1,
    onMainTest: true,
    question:
      "Which organ is primarily responsible for absorbing nutrients into the bloodstream?",
    options: ["Stomach", "Large intestine", "Small intestine", "Esophagus"],
    correctIndex: 2,
    explanation:
      "The small intestine is the primary site of nutrient absorption, thanks to its large surface area created by villi and microvilli.",
    hint: "This organ has villi to increase its surface area.",
  },
  // 3
  {
    id: "mc-dig-03",
    type: "mc",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question: "What is the primary function of bile in digestion?",
    options: [
      "Break down proteins into amino acids",
      "Emulsify fats into smaller droplets",
      "Neutralize stomach acid",
      "Absorb water from waste",
    ],
    correctIndex: 1,
    explanation:
      "Bile is an emulsifying agent that breaks large fat globules into smaller droplets, increasing surface area for lipase enzymes to digest fats.",
    hint: "Bile works on fats — does it chemically digest them or physically break them apart?",
  },
  // 4
  {
    id: "mc-resp-01",
    type: "mc",
    topic: "respiratory",
    difficulty: 1,
    onMainTest: true,
    question: "Where does gas exchange occur in the respiratory system?",
    options: ["Trachea", "Bronchi", "Bronchioles", "Alveoli"],
    correctIndex: 3,
    explanation:
      "Gas exchange occurs in the alveoli, which are tiny air sacs with walls one cell thick, surrounded by capillaries. Oxygen diffuses into the blood and CO₂ diffuses out.",
    hint: "These structures are at the very end of the respiratory pathway.",
  },
  // 5
  {
    id: "mc-resp-02",
    type: "mc",
    topic: "respiratory",
    difficulty: 2,
    onMainTest: true,
    question: "What type of muscle is the diaphragm made of?",
    options: [
      "Smooth muscle",
      "Cardiac muscle",
      "Skeletal muscle",
      "Connective tissue",
    ],
    correctIndex: 2,
    explanation:
      "The diaphragm is made of skeletal muscle. It is unique in that it can function both voluntarily (holding your breath) and involuntarily (automatic breathing).",
    hint: "This muscle can be controlled consciously (e.g., holding your breath).",
  },
  // 6
  {
    id: "mc-resp-03",
    type: "mc",
    topic: "respiratory",
    difficulty: 2,
    onMainTest: false,
    question:
      "During inhalation, what happens to the diaphragm?",
    options: [
      "It relaxes and moves upward",
      "It contracts and moves downward",
      "It contracts and moves upward",
      "It remains stationary",
    ],
    correctIndex: 1,
    explanation:
      "During inhalation, the diaphragm contracts and flattens (moves downward), increasing the volume of the thoracic cavity and creating negative pressure that draws air into the lungs.",
    hint: "Contraction flattens the diaphragm — which direction does it move?",
  },
  // 7
  {
    id: "mc-circ-01",
    type: "mc",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question:
      "Which blood vessels carry blood away from the heart?",
    options: ["Veins", "Capillaries", "Arteries", "Venules"],
    correctIndex: 2,
    explanation:
      "Arteries carry blood away from the heart. They have thick, muscular walls to withstand the high pressure of blood being pumped out of the heart.",
    hint: "'A' for arteries, 'A' for away.",
  },
  // 8
  {
    id: "mc-circ-02",
    type: "mc",
    topic: "circulatory",
    difficulty: 2,
    onMainTest: true,
    question:
      "What is unique about pulmonary arteries compared to other arteries?",
    options: [
      "They are the largest arteries",
      "They carry oxygenated blood",
      "They carry deoxygenated blood",
      "They contain valves",
    ],
    correctIndex: 2,
    explanation:
      "Pulmonary arteries are unique because they carry deoxygenated blood from the right ventricle to the lungs, unlike all other arteries which carry oxygenated blood.",
    hint: "Pulmonary circulation is the exception to the usual artery/vein rule.",
  },
  // 9
  {
    id: "mc-circ-03",
    type: "mc",
    topic: "circulatory",
    difficulty: 1,
    onMainTest: true,
    question: "Which component of blood is responsible for clotting?",
    options: ["Plasma", "Red blood cells", "White blood cells", "Platelets"],
    correctIndex: 3,
    explanation:
      "Platelets (thrombocytes) are cell fragments that clump together at a wound site to form a plug and release chemicals that trigger the clotting cascade.",
    hint: "These are not whole cells — they are cell fragments.",
  },
  // 10
  {
    id: "mc-tiss-01",
    type: "mc",
    topic: "tissues",
    difficulty: 1,
    onMainTest: true,
    question:
      "Which type of muscle tissue is found only in the heart?",
    options: [
      "Skeletal muscle",
      "Smooth muscle",
      "Cardiac muscle",
      "Striated voluntary muscle",
    ],
    correctIndex: 2,
    explanation:
      "Cardiac muscle is found exclusively in the heart. It is involuntary, striated, and has branching cells connected by intercalated discs that allow synchronized contraction.",
    hint: "The name of this muscle type gives away its location.",
  },
  // 11
  {
    id: "mc-tiss-02",
    type: "mc",
    topic: "tissues",
    difficulty: 1,
    onMainTest: true,
    question:
      "What is the correct order of biological organization from smallest to largest?",
    options: [
      "Tissue, Cell, Organ, Organ System, Organism",
      "Cell, Organ, Tissue, Organ System, Organism",
      "Cell, Tissue, Organ, Organ System, Organism",
      "Organ, Tissue, Cell, Organism, Organ System",
    ],
    correctIndex: 2,
    explanation:
      "The correct hierarchy from smallest to largest is: Cell → Tissue → Organ → Organ System → Organism.",
    hint: "Start with the basic unit of life.",
  },
  // 12
  {
    id: "mc-tiss-03",
    type: "mc",
    topic: "tissues",
    difficulty: 2,
    onMainTest: false,
    question:
      "Which tissue type lines the interior of the small intestine and is responsible for absorption?",
    options: [
      "Connective tissue",
      "Epithelial tissue",
      "Muscle tissue",
      "Nervous tissue",
    ],
    correctIndex: 1,
    explanation:
      "Epithelial tissue lines the interior of the small intestine (and most body surfaces and cavities). In the small intestine, specialized epithelial cells form the villi that absorb nutrients.",
    hint: "This tissue type covers and lines body surfaces.",
  },
  // 13
  {
    id: "mc-inter-01",
    type: "mc",
    topic: "interactions",
    difficulty: 2,
    onMainTest: true,
    question:
      "Which two substances are needed by the mitochondria to perform cellular respiration?",
    options: [
      "Carbon dioxide and water",
      "Oxygen and glucose",
      "ATP and carbon dioxide",
      "Glucose and carbon dioxide",
    ],
    correctIndex: 1,
    explanation:
      "Cellular respiration in the mitochondria requires oxygen (from the respiratory system) and glucose (from the digestive system) to produce ATP, with CO₂ and water as byproducts.",
    hint: "One comes from the food you eat, the other from the air you breathe.",
  },
  // 14
  {
    id: "mc-circ-04",
    type: "mc",
    topic: "circulatory",
    difficulty: 2,
    onMainTest: true,
    question:
      "Which chamber of the heart pumps oxygenated blood to the body?",
    options: [
      "Right atrium",
      "Right ventricle",
      "Left atrium",
      "Left ventricle",
    ],
    correctIndex: 3,
    explanation:
      "The left ventricle has the thickest walls of all heart chambers because it must pump oxygenated blood through the aorta to the entire body.",
    hint: "This is the most muscular chamber of the heart.",
  },
  // 15
  {
    id: "mc-dig-04",
    type: "mc",
    topic: "digestive",
    difficulty: 2,
    onMainTest: true,
    question:
      "What is the main function of the large intestine?",
    options: [
      "Chemical digestion of proteins",
      "Absorption of nutrients through villi",
      "Absorption of water and formation of solid waste",
      "Production of bile",
    ],
    correctIndex: 2,
    explanation:
      "The large intestine's primary roles are absorbing water and electrolytes from the remaining indigestible food matter and forming solid waste (feces) for elimination.",
    hint: "By this point, most nutrients have already been absorbed.",
  },
];
