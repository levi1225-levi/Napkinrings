export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 1 | 2 | 3;
  relatedCardId: string;
  explanation: string;
  type: 'digestive' | 'respiratory' | 'circulatory' | 'tissues' | 'interactions';
}

export const quizQuestions: QuizQuestion[] = [
  // ─── Digestive System Questions ────────────────────────────────
  {
    id: 'q1',
    question: 'What is the longest segment of the digestive system?',
    options: [
      'Large intestine',
      'Small intestine',
      'Esophagus',
      'Stomach',
    ],
    correctIndex: 1,
    difficulty: 1,
    relatedCardId: 'nutrient-absorption',
    explanation:
      'The small intestine is approximately 6–7 metres long, making it the longest part of the digestive tract. Its length maximises the surface area available for nutrient absorption.',
    type: 'digestive',
  },
  {
    id: 'q2',
    question: 'Which enzyme starts protein digestion in the stomach?',
    options: [
      'Amylase',
      'Lipase',
      'Pepsin',
      'Trypsin',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'pepsin',
    explanation:
      'Pepsin is a protease activated by hydrochloric acid in the stomach. It breaks proteins into smaller peptide fragments, beginning the chemical digestion of protein.',
    type: 'digestive',
  },
  {
    id: 'q3',
    question: 'Which organ produces insulin?',
    options: [
      'Pancreas',
      'Liver',
      'Gallbladder',
      'Stomach',
    ],
    correctIndex: 0,
    difficulty: 1,
    relatedCardId: 'pancreas',
    explanation:
      'The pancreas contains islets of Langerhans, which produce insulin to regulate blood sugar levels. It also secretes digestive enzymes into the small intestine.',
    type: 'digestive',
  },
  {
    id: 'q4',
    question: 'Where is the majority of water absorbed in the digestive system?',
    options: [
      'Stomach',
      'Small intestine',
      'Esophagus',
      'Large intestine',
    ],
    correctIndex: 3,
    difficulty: 2,
    relatedCardId: 'large-intestine',
    explanation:
      'The large intestine (colon) is responsible for absorbing most of the remaining water from indigestible food matter, compacting waste into solid stool.',
    type: 'digestive',
  },
  {
    id: 'q5',
    question: 'Where is bile formed?',
    options: [
      'Gallbladder',
      'Liver',
      'Pancreas',
      'Small intestine',
    ],
    correctIndex: 1,
    difficulty: 1,
    relatedCardId: 'liver',
    explanation:
      'Bile is produced by the liver and then stored and concentrated in the gallbladder. It is released into the small intestine to help emulsify fats.',
    type: 'digestive',
  },
  {
    id: 'q6',
    question: 'Which substance is chemically digested by saliva?',
    options: [
      'Starch (carbohydrates)',
      'Proteins',
      'Fats',
      'Nucleic acids',
    ],
    correctIndex: 0,
    difficulty: 1,
    relatedCardId: 'saliva-functions',
    explanation:
      'Saliva contains the enzyme salivary amylase, which begins the chemical digestion of starch (a carbohydrate) into simpler sugars right in the mouth.',
    type: 'digestive',
  },
  {
    id: 'q7',
    question: 'What is the slurry formed in the stomach called?',
    options: [
      'Bolus',
      'Chyme',
      'Bile',
      'Mucus',
    ],
    correctIndex: 1,
    difficulty: 2,
    relatedCardId: 'chyme',
    explanation:
      'Chyme is the semi-fluid mass of partially digested food that is produced by the churning action and acidic environment of the stomach before passing into the small intestine.',
    type: 'digestive',
  },
  {
    id: 'q8',
    question: 'Where does most chemical digestion and nutrient absorption occur?',
    options: [
      'Stomach',
      'Large intestine',
      'Small intestine',
      'Mouth',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'nutrient-absorption',
    explanation:
      'The small intestine is the primary site for both chemical digestion (aided by enzymes from the pancreas and bile from the liver) and nutrient absorption through its villi.',
    type: 'digestive',
  },
  {
    id: 'q9',
    question: 'What are villi?',
    options: [
      'Enzymes that digest fat',
      'Finger-like projections that increase surface area',
      'Muscles that cause peristalsis',
      'Cells that produce stomach acid',
    ],
    correctIndex: 1,
    difficulty: 2,
    relatedCardId: 'villi',
    explanation:
      'Villi are tiny finger-like projections lining the inner wall of the small intestine. They dramatically increase the surface area available for absorbing nutrients into the bloodstream.',
    type: 'digestive',
  },
  {
    id: 'q10',
    question: 'What type of muscle causes peristalsis?',
    options: [
      'Skeletal muscle',
      'Cardiac muscle',
      'Smooth muscle',
      'Voluntary muscle',
    ],
    correctIndex: 2,
    difficulty: 1,
    relatedCardId: 'peristalsis',
    explanation:
      'Peristalsis is the wave-like contraction of smooth muscle in the walls of the digestive tract. Smooth muscle is involuntary, so peristalsis occurs without conscious effort.',
    type: 'digestive',
  },
  {
    id: 'q11',
    question: 'Where is bile stored?',
    options: [
      'Liver',
      'Pancreas',
      'Gallbladder',
      'Duodenum',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'gallbladder',
    explanation:
      'Although bile is produced by the liver, it is stored and concentrated in the gallbladder until it is needed to help digest fats in the small intestine.',
    type: 'digestive',
  },
  {
    id: 'q12',
    question: 'By what process do nutrients enter the blood from the villi?',
    options: [
      'Osmosis',
      'Active transport only',
      'Diffusion',
      'Filtration',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'nutrient-absorption',
    explanation:
      'Nutrients pass from the villi into the surrounding capillaries primarily by diffusion, moving from an area of higher concentration in the intestine to lower concentration in the blood.',
    type: 'digestive',
  },
  {
    id: 'q13',
    question: 'What does the large intestine primarily absorb?',
    options: [
      'Proteins and fats',
      'Water and vitamins B & K',
      'Glucose and amino acids',
      'Minerals and carbohydrates',
    ],
    correctIndex: 1,
    difficulty: 1,
    relatedCardId: 'large-intestine',
    explanation:
      'The large intestine absorbs water to solidify waste. Bacteria in the colon also produce vitamins B and K, which are absorbed here.',
    type: 'digestive',
  },

  // ─── Respiratory System Questions ──────────────────────────────
  {
    id: 'q14',
    question: 'What is the purpose of cilia inside the nose?',
    options: [
      'Warm incoming air',
      'Detect odours',
      'Keep dust out of the airway',
      'Humidify the air',
    ],
    correctIndex: 2,
    difficulty: 1,
    relatedCardId: 'nasal-pharynx',
    explanation:
      'Cilia are tiny hair-like structures in the nasal passages that trap dust, pollen, and other particles, preventing them from reaching the lungs.',
    type: 'respiratory',
  },
  {
    id: 'q15',
    question: 'What tissue produces mucus in the pharynx and trachea?',
    options: [
      'Epithelial',
      'Connective',
      'Muscle',
      'Nervous',
    ],
    correctIndex: 0,
    difficulty: 2,
    relatedCardId: 'trachea-lining',
    explanation:
      'Epithelial tissue lines the pharynx and trachea, and specialised goblet cells within this tissue secrete mucus to trap particles and keep airways moist.',
    type: 'respiratory',
  },
  {
    id: 'q16',
    question: 'What happens to the trachea before it reaches the lungs?',
    options: [
      'It branches in 2 directions',
      'It narrows into a single tube',
      'It connects directly to alveoli',
      'It merges with the esophagus',
    ],
    correctIndex: 0,
    difficulty: 1,
    relatedCardId: 'bronchi',
    explanation:
      'The trachea divides into two primary bronchi — one leading to the left lung and one to the right lung — before further branching into smaller bronchioles.',
    type: 'respiratory',
  },
  {
    id: 'q17',
    question: 'How does oxygen move from the lungs into the bloodstream?',
    options: [
      'Through large pulmonary veins',
      'Through the bronchi walls',
      'Through small alveolar capillaries',
      'Through the diaphragm',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'alveoli',
    explanation:
      'Oxygen diffuses across the thin walls of the alveoli into the surrounding capillaries. The alveolar walls are only one cell thick, allowing efficient gas exchange.',
    type: 'respiratory',
  },
  {
    id: 'q18',
    question: 'What protects the lungs from outside harm?',
    options: [
      'The diaphragm',
      'The sternum only',
      'The rib cage',
      'The pleural membrane',
    ],
    correctIndex: 2,
    difficulty: 1,
    relatedCardId: 'breathing-purpose',
    explanation:
      'The rib cage forms a bony enclosure around the lungs and heart, providing physical protection from external impacts and injuries.',
    type: 'respiratory',
  },
  {
    id: 'q19',
    question: 'Where does gas exchange take place in the lungs?',
    options: [
      'Alveoli',
      'Bronchi',
      'Trachea',
      'Bronchioles',
    ],
    correctIndex: 0,
    difficulty: 1,
    relatedCardId: 'alveoli',
    explanation:
      'Gas exchange occurs in the alveoli, tiny air sacs at the ends of bronchioles. Oxygen passes into the blood and carbon dioxide passes out for exhalation.',
    type: 'respiratory',
  },
  {
    id: 'q20',
    question: 'What controls involuntary breathing?',
    options: [
      'The cerebellum',
      'The spinal cord',
      'The cerebrum',
      'The brainstem',
    ],
    correctIndex: 3,
    difficulty: 2,
    relatedCardId: 'breathing-purpose',
    explanation:
      'The brainstem (specifically the medulla oblongata and pons) automatically regulates breathing rate and rhythm based on CO2 levels in the blood.',
    type: 'respiratory',
  },
  {
    id: 'q21',
    question: 'What are the tiny air sacs in human lungs called?',
    options: [
      'Bronchioles',
      'Bronchi',
      'Alveoli',
      'Villi',
    ],
    correctIndex: 2,
    difficulty: 1,
    relatedCardId: 'alveoli',
    explanation:
      'Alveoli are tiny, balloon-shaped air sacs at the terminal ends of the bronchioles. There are roughly 300 million alveoli in the lungs, providing a huge surface area for gas exchange.',
    type: 'respiratory',
  },
  {
    id: 'q22',
    question: 'Which statement about the trachea is FALSE?',
    options: [
      'It is supported by C-shaped cartilage rings',
      'It is lined with mucus-producing cells',
      'It splits into the right and left bronchioles',
      'It carries air toward the lungs',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'trachea-support',
    explanation:
      'The trachea splits into the right and left bronchi, not bronchioles. Bronchioles are much smaller airways that branch off from the bronchi deeper inside the lungs.',
    type: 'respiratory',
  },
  {
    id: 'q23',
    question: 'Which statement is INCORRECT about the larynx?',
    options: [
      'It contains the vocal cords',
      'It is located between the pharynx and trachea',
      'It helps produce sound',
      'It is absent in most people',
    ],
    correctIndex: 3,
    difficulty: 2,
    relatedCardId: 'epiglottis',
    explanation:
      'The larynx (voice box) is present in all people. It sits between the pharynx and trachea, houses the vocal cords, and plays a key role in producing sound.',
    type: 'respiratory',
  },
  {
    id: 'q24',
    question: 'What is the function of the trachea?',
    options: [
      'Exchanging gases with the blood',
      'Filtering foreign materials from the air',
      'Producing sound',
      'Absorbing oxygen directly',
    ],
    correctIndex: 1,
    difficulty: 2,
    relatedCardId: 'trachea-lining',
    explanation:
      'The trachea is lined with cilia and mucus-producing cells that trap and filter foreign particles from inhaled air before it reaches the lungs.',
    type: 'respiratory',
  },
  {
    id: 'q25',
    question: 'What is internal respiration?',
    options: [
      'Breathing air in and out of the lungs',
      'Exchange of gases in the alveoli',
      'Exchange of gases between blood and body cells',
      'The movement of the diaphragm',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'cellular-respiration',
    explanation:
      'Internal respiration is the gas exchange that occurs between the blood in systemic capillaries and the surrounding body cells, where oxygen is delivered and carbon dioxide is collected.',
    type: 'respiratory',
  },
  {
    id: 'q26',
    question: 'Which organ functions as an air humidifier?',
    options: [
      'Mouth',
      'Pharynx',
      'Nasal cavity',
      'All of the above',
    ],
    correctIndex: 3,
    difficulty: 1,
    relatedCardId: 'nasal-pharynx',
    explanation:
      'The mouth, pharynx, and nasal cavity all help warm and humidify incoming air before it reaches the delicate tissues of the lungs.',
    type: 'respiratory',
  },
  {
    id: 'q27',
    question: 'What is the diaphragm made of?',
    options: [
      'Smooth muscle',
      'Cardiac muscle',
      'Skeletal muscle',
      'Connective tissue',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'diaphragm',
    explanation:
      'The diaphragm is a dome-shaped sheet of skeletal muscle. Although breathing can be involuntary, the diaphragm is skeletal muscle that can also be consciously controlled.',
    type: 'respiratory',
  },
  {
    id: 'q28',
    question: 'When you inhale, what does the diaphragm do?',
    options: [
      'Relaxes and moves up',
      'Contracts and moves down',
      'Stays completely still',
      'Expands sideways',
    ],
    correctIndex: 1,
    difficulty: 2,
    relatedCardId: 'diaphragm',
    explanation:
      'During inhalation the diaphragm contracts and flattens downward, increasing the volume of the thoracic cavity and causing air to rush into the lungs.',
    type: 'respiratory',
  },

  // ─── Circulatory System Questions ──────────────────────────────
  {
    id: 'q29',
    question: 'Arteries carry blood in which direction?',
    options: [
      'Toward the heart',
      'Away from the heart',
      'Only to the lungs',
      'Between capillaries',
    ],
    correctIndex: 1,
    difficulty: 1,
    relatedCardId: 'arteries',
    explanation:
      'Arteries always carry blood away from the heart. They have thick, muscular walls to handle the high pressure of blood being pumped from the heart.',
    type: 'circulatory',
  },
  {
    id: 'q30',
    question: 'Veins carry blood in which direction?',
    options: [
      'Away from the heart',
      'Toward the heart',
      'Only to the brain',
      'Only through the lungs',
    ],
    correctIndex: 1,
    difficulty: 1,
    relatedCardId: 'veins',
    explanation:
      'Veins carry blood back toward the heart. They have thinner walls than arteries and contain valves to prevent the backflow of blood.',
    type: 'circulatory',
  },
  {
    id: 'q31',
    question: 'Which blood vessels have valves to prevent backflow?',
    options: [
      'Arteries',
      'Capillaries',
      'Veins',
      'Arterioles',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'veins',
    explanation:
      'Veins contain one-way valves that prevent blood from flowing backward. This is especially important in the legs, where blood must travel upward against gravity.',
    type: 'circulatory',
  },
  {
    id: 'q32',
    question: 'What are the smallest blood vessels?',
    options: [
      'Arteries',
      'Veins',
      'Capillaries',
      'Venules',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'capillaries',
    explanation:
      'Capillaries are the smallest blood vessels, with walls only one cell thick. This thinness allows efficient exchange of gases, nutrients, and waste between blood and tissues.',
    type: 'circulatory',
  },
  {
    id: 'q33',
    question: 'What percentage of blood is made up of plasma?',
    options: [
      '45%',
      '55%',
      '70%',
      '30%',
    ],
    correctIndex: 1,
    difficulty: 2,
    relatedCardId: 'blood-components',
    explanation:
      'Blood is approximately 55% plasma (a yellowish fluid composed mostly of water) and 45% formed elements including red blood cells, white blood cells, and platelets.',
    type: 'circulatory',
  },
  {
    id: 'q34',
    question: 'What is the protein in red blood cells that carries oxygen?',
    options: [
      'Fibrinogen',
      'Hemoglobin',
      'Albumin',
      'Keratin',
    ],
    correctIndex: 1,
    difficulty: 2,
    relatedCardId: 'hemoglobin',
    explanation:
      'Hemoglobin is an iron-containing protein in red blood cells that binds to oxygen in the lungs and releases it to body tissues. It also gives blood its red colour.',
    type: 'circulatory',
  },
  {
    id: 'q35',
    question: 'What do pulmonary arteries carry?',
    options: [
      'Oxygenated blood to the body',
      'Deoxygenated blood to the lungs',
      'Oxygenated blood to the lungs',
      'Deoxygenated blood to the body',
    ],
    correctIndex: 1,
    difficulty: 2,
    relatedCardId: 'pulmonary-arteries',
    explanation:
      'Pulmonary arteries are unique because they carry deoxygenated blood from the right ventricle to the lungs, where carbon dioxide is exchanged for oxygen.',
    type: 'circulatory',
  },
  {
    id: 'q36',
    question: 'Which chamber of the heart pumps blood to the body via the aorta?',
    options: [
      'Right atrium',
      'Right ventricle',
      'Left atrium',
      'Left ventricle',
    ],
    correctIndex: 3,
    difficulty: 2,
    relatedCardId: 'aorta',
    explanation:
      'The left ventricle is the most muscular chamber of the heart. It pumps oxygenated blood through the aorta to supply the entire body with oxygen-rich blood.',
    type: 'circulatory',
  },

  // ─── Tissues Questions ─────────────────────────────────────────
  {
    id: 'q37',
    question: 'Which tissue type covers and protects the body?',
    options: [
      'Connective',
      'Muscle',
      'Epithelial',
      'Nervous',
    ],
    correctIndex: 2,
    difficulty: 1,
    relatedCardId: 'epithelial-tissue',
    explanation:
      'Epithelial tissue forms the outer layer of the skin and lines internal organs and cavities. It acts as a protective barrier against pathogens, chemicals, and physical damage.',
    type: 'tissues',
  },
  {
    id: 'q38',
    question: 'Cartilage is an example of which tissue type?',
    options: [
      'Epithelial',
      'Muscle',
      'Connective tissue',
      'Nervous',
    ],
    correctIndex: 2,
    difficulty: 2,
    relatedCardId: 'connective-tissue',
    explanation:
      'Cartilage is a type of connective tissue that provides flexible support. Other connective tissues include bone, blood, and adipose (fat) tissue.',
    type: 'tissues',
  },
  {
    id: 'q39',
    question: 'Neurons are cells of which tissue type?',
    options: [
      'Epithelial',
      'Connective',
      'Muscle',
      'Nervous',
    ],
    correctIndex: 3,
    difficulty: 2,
    relatedCardId: 'nervous-tissue',
    explanation:
      'Neurons are the primary cells of nervous tissue. They transmit electrical impulses throughout the body, enabling communication between the brain, spinal cord, and all other organs.',
    type: 'tissues',
  },
];

export default quizQuestions;
