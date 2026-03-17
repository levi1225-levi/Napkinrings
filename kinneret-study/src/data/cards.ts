export interface Card {
  id: string;
  category: string;
  subcategory?: string;
  term: string;
  definition: string;
  extendedNotes: string;
  mnemonicHint: string;
  relatedCards: string[];
  tag: string;
}

export const cards: Card[] = [
  // ─── Tissues ───────────────────────────────────────────────────────
  {
    id: 'tissue-types',
    category: 'Tissues',
    term: 'What are the 4 primary tissue types?',
    definition: 'Epithelial, Muscle, Connective, Nervous',
    extendedNotes:
      'These four tissue types make up every organ and structure in the human body. Each type has a distinct structure suited to its function. Organs typically contain multiple tissue types working together — for example, the stomach contains all four.',
    mnemonicHint:
      'Think "ECMN" — Every Cell Must Network. Epithelial, Connective, Muscle, Nervous.',
    relatedCards: ['epithelial-function', 'muscle-types', 'connective-function', 'nervous-function'],
    tag: 'tissues',
  },
  {
    id: 'epithelial-function',
    category: 'Tissues',
    term: 'What does epithelial tissue do?',
    definition: 'Covers/protects body and organs. Secretes mucus, oils, enzymes.',
    extendedNotes:
      'Epithelial tissue forms the outer layer of skin and lines internal organs, the digestive tract, and respiratory passages. It acts as a barrier against pathogens and physical damage. Specialized epithelial cells can secrete substances like mucus in the stomach or enzymes in the small intestine.',
    mnemonicHint:
      'Epithelial = "Epi-shield." It covers and protects like a shield over every surface.',
    relatedCards: ['tissue-types', 'stomach-protection', 'trachea-lining', 'alveoli-thin'],
    tag: 'tissues',
  },
  {
    id: 'muscle-types',
    category: 'Tissues',
    term: 'What are the 3 types of muscle tissue?',
    definition: 'Skeletal (voluntary), Smooth (involuntary, organs), Cardiac (involuntary, heart)',
    extendedNotes:
      'Skeletal muscle is striated and under conscious control, attached to bones for movement. Smooth muscle is non-striated and found in organ walls where it contracts involuntarily. Cardiac muscle is striated like skeletal but involuntary like smooth, found exclusively in the heart.',
    mnemonicHint:
      'SSC: Skeletal = Striated + voluntary, Smooth = organs + involuntary, Cardiac = heart + involuntary.',
    relatedCards: ['skeletal-voluntary', 'smooth-muscle-location', 'cardiac-muscle', 'tissue-types'],
    tag: 'tissues',
  },
  {
    id: 'connective-function',
    category: 'Tissues',
    term: 'What does connective tissue do?',
    definition: 'Holds body parts together, provides support. Ex: cartilage, tendons, ligaments, blood',
    extendedNotes:
      'Connective tissue is the most diverse tissue type. It includes bone, cartilage, tendons, ligaments, adipose (fat), and even blood. Its key feature is an extracellular matrix that provides structural support. Blood is classified as connective tissue because it connects and transports materials between other tissues.',
    mnemonicHint:
      'Connective = "Connects." It holds everything together — bones, joints, and even blood connecting organs.',
    relatedCards: ['tissue-types', 'epiglottis', 'trachea-cartilage', 'blood-components'],
    tag: 'tissues',
  },
  {
    id: 'nervous-function',
    category: 'Tissues',
    term: 'What does nervous tissue do?',
    definition: 'Made of neurons. Allows communication between body structures and organs.',
    extendedNotes:
      'Nervous tissue consists of neurons that transmit electrical signals and glial cells that support them. It forms the brain, spinal cord, and peripheral nerves. In organs like the stomach, nervous tissue sends signals to the brain to regulate processes like digestion and hunger.',
    mnemonicHint:
      'Nervous tissue = the body\'s "WiFi network." Neurons send signals between all body parts.',
    relatedCards: ['tissue-types', 'stomach-tissues'],
    tag: 'tissues',
  },
  {
    id: 'skeletal-voluntary',
    category: 'Tissues',
    term: 'Which muscle type is voluntary?',
    definition: 'Skeletal muscle - attached to bones by tendons',
    extendedNotes:
      'Skeletal muscle is the only voluntary muscle type, meaning you consciously control it. It is attached to bones via tendons and works in antagonistic pairs to produce movement. It appears striated (striped) under a microscope due to organized protein filaments.',
    mnemonicHint:
      'Skeletal = Skeleton = Bones = You choose to move them. The only muscle you control on purpose.',
    relatedCards: ['muscle-types', 'diaphragm', 'connective-function'],
    tag: 'tissues',
  },
  {
    id: 'smooth-muscle-location',
    category: 'Tissues',
    term: 'Where is smooth muscle found?',
    definition: 'Internal organs: esophagus, stomach, bronchioles, blood vessels. Involuntary.',
    extendedNotes:
      'Smooth muscle lines the walls of hollow organs and tubes throughout the body. It contracts slowly and rhythmically without conscious control. In the esophagus it drives peristalsis, in bronchioles it controls airway diameter, and in blood vessels it regulates blood pressure.',
    mnemonicHint:
      'Smooth muscle = "smooth operator" — quietly working inside organs without you thinking about it.',
    relatedCards: ['muscle-types', 'peristalsis', 'bronchioles', 'asthma'],
    tag: 'tissues',
  },
  {
    id: 'cardiac-muscle',
    category: 'Tissues',
    term: 'Which muscle is found only in the heart?',
    definition: 'Cardiac muscle - involuntary, contracts continuously',
    extendedNotes:
      'Cardiac muscle is unique because it combines features of both skeletal and smooth muscle. It is striated like skeletal muscle but contracts involuntarily like smooth muscle. Cardiac cells are connected by intercalated discs that allow synchronized contraction, enabling the heart to beat as a coordinated unit.',
    mnemonicHint:
      'Cardiac = "Cardio" = Heart. It never stops — involuntary and tireless, beating ~100,000 times per day.',
    relatedCards: ['muscle-types', 'heart-chambers', 'heart-beat-rate'],
    tag: 'tissues',
  },

  // ─── Digestive System ──────────────────────────────────────────────
  {
    id: 'mechanical-digestion',
    category: 'Digestive System',
    term: 'What is mechanical digestion?',
    definition: 'Physically breaking food into smaller pieces. No enzymes, no energy released.',
    extendedNotes:
      'Mechanical digestion increases the surface area of food so that enzymes can work more efficiently during chemical digestion. Examples include chewing (teeth and tongue in the mouth), churning in the stomach, and bile emulsifying fats in the small intestine. No chemical bonds are broken in this process.',
    mnemonicHint:
      'Mechanical = "Machine." Like a blender — physically smashing food into smaller bits, no chemistry involved.',
    relatedCards: ['chemical-digestion', 'mouth-digestion', 'stomach-function', 'liver-bile'],
    tag: 'digestive',
  },
  {
    id: 'chemical-digestion',
    category: 'Digestive System',
    term: 'What is chemical digestion?',
    definition: 'Enzymes split bonds holding food molecules together so they can be absorbed.',
    extendedNotes:
      'Chemical digestion uses specific enzymes to break covalent bonds in large nutrient molecules (carbohydrates, proteins, fats) into smaller absorbable units. Each enzyme is specific to a substrate — amylase for starches, pepsin for proteins, lipase for fats. This process occurs in the mouth, stomach, and primarily in the small intestine.',
    mnemonicHint:
      'Chemical = Enzymes. Think of enzymes as tiny molecular scissors cutting food molecules apart.',
    relatedCards: ['mechanical-digestion', 'saliva-functions', 'pepsin-function', 'mouth-digestion'],
    tag: 'digestive',
  },
  {
    id: 'digestion-time',
    category: 'Digestive System',
    term: 'How long does digestion take?',
    definition: '24-33 hours',
    extendedNotes:
      'Food spends about 6-8 hours in the stomach, 6-8 hours in the small intestine, and the remainder in the large intestine. The exact time varies depending on the type of food eaten — fats take longer to digest than carbohydrates. The total journey from mouth to elimination covers roughly 9 metres of digestive tract.',
    mnemonicHint:
      'About a full day plus — eat breakfast, and it leaves by tomorrow\'s breakfast (or later).',
    relatedCards: ['stomach-function', 'large-intestine', 'villi'],
    tag: 'digestive',
  },
  {
    id: 'mouth-digestion',
    category: 'Digestive System',
    term: 'What types of digestion occur in the mouth?',
    definition: 'Both physical (teeth/tongue) and chemical (salivary amylase breaks down carbs)',
    extendedNotes:
      'The mouth is where digestion begins with both types working simultaneously. Teeth and tongue physically tear and grind food (mechanical), while salivary amylase secreted by salivary glands begins chemical breakdown of starches into simpler sugars. The tongue also shapes food into a bolus for swallowing.',
    mnemonicHint:
      'Mouth does BOTH: teeth CRUSH (mechanical) + saliva DISSOLVES (chemical). Double duty from the start.',
    relatedCards: ['mechanical-digestion', 'chemical-digestion', 'saliva-functions', 'peristalsis'],
    tag: 'digestive',
  },
  {
    id: 'saliva-functions',
    category: 'Digestive System',
    term: 'What are the 3 functions of saliva?',
    definition: '1) Wets/lubricates food 2) Forms a bolus 3) Salivary amylase breaks down carbs',
    extendedNotes:
      'Saliva is produced by three pairs of salivary glands and is mostly water. The lubrication helps food slide down the esophagus. Forming a bolus (a ball of chewed food) makes swallowing efficient. Salivary amylase begins starch digestion immediately — if you chew bread long enough, it starts to taste sweet as starch converts to sugar.',
    mnemonicHint:
      'Saliva does 3 things: Wet it, Ball it, Break it. WBB — "Wet Bolus Breakdown."',
    relatedCards: ['mouth-digestion', 'chemical-digestion', 'peristalsis'],
    tag: 'digestive',
  },
  {
    id: 'peristalsis',
    category: 'Digestive System',
    term: 'What is peristalsis?',
    definition: 'Rhythmic smooth muscle contractions pushing food down the esophagus',
    extendedNotes:
      'Peristalsis is a wave-like contraction pattern produced by smooth muscle in the walls of the esophagus and throughout the digestive tract. It is involuntary and works even against gravity — you could eat upside down. The coordinated contraction behind the bolus and relaxation ahead of it propels food toward the stomach.',
    mnemonicHint:
      'Peristalsis = "Squeeze and Push." Like squeezing a tube of toothpaste from top to bottom.',
    relatedCards: ['smooth-muscle-location', 'saliva-functions', 'stomach-function', 'esophagus-acid'],
    tag: 'digestive',
  },
  {
    id: 'stomach-function',
    category: 'Digestive System',
    term: 'What happens in the stomach?',
    definition: 'Mechanical (churning) + chemical (HCl + pepsin) digestion. Produces chyme.',
    extendedNotes:
      'The stomach is a muscular organ that churns food mechanically while simultaneously bathing it in gastric juice (HCl + pepsin). The highly acidic environment (pH ~2) kills bacteria and activates pepsin for protein digestion. After 2-6 hours of processing, food becomes chyme — a semi-liquid mixture released into the small intestine.',
    mnemonicHint:
      'Stomach = "Acid washing machine." Churns (mechanical) + acid bath (chemical) = chyme.',
    relatedCards: ['chyme', 'pepsin-function', 'stomach-protection', 'mechanical-digestion'],
    tag: 'digestive',
  },
  {
    id: 'chyme',
    category: 'Digestive System',
    term: 'What is chyme?',
    definition: 'Slurry of food + HCl acid formed in the stomach',
    extendedNotes:
      'Chyme is the semi-liquid, acidic paste that results from mechanical and chemical digestion in the stomach. It is released in small amounts through the pyloric sphincter into the duodenum (first part of the small intestine). The acidity of chyme triggers the pancreas to release bicarbonate to neutralize it.',
    mnemonicHint:
      'Chyme rhymes with "slime" — it\'s the slimy, acidic food slurry leaving the stomach.',
    relatedCards: ['stomach-function', 'pepsin-function', 'pancreas-function', 'villi'],
    tag: 'digestive',
  },
  {
    id: 'pepsin-function',
    category: 'Digestive System',
    term: 'What does pepsin do?',
    definition: 'Enzyme that chemically digests proteins in the stomach',
    extendedNotes:
      'Pepsin is a protease enzyme that breaks down proteins into smaller peptide fragments. It is secreted as inactive pepsinogen by chief cells in the stomach lining, then activated by hydrochloric acid. Pepsin works optimally at the very acidic pH of the stomach (~pH 2) and would be inactive at neutral pH.',
    mnemonicHint:
      'Pepsin = "Pep-SIN" = Protein Enzyme in the Stomach\'s Interior Naturally. It digests proteins.',
    relatedCards: ['chemical-digestion', 'stomach-function', 'stomach-protection'],
    tag: 'digestive',
  },
  {
    id: 'stomach-protection',
    category: 'Digestive System',
    term: 'Why doesn\'t the stomach digest itself?',
    definition: 'Mucus layer (epithelial tissue) protects lining from acid',
    extendedNotes:
      'Goblet cells in the stomach\'s epithelial lining constantly secrete a thick layer of alkaline mucus. This mucus barrier prevents the HCl and pepsin from reaching and digesting the stomach wall. If this barrier is compromised (e.g., by H. pylori bacteria or overuse of NSAIDs), ulcers can form.',
    mnemonicHint:
      'The stomach wears a "mucus raincoat" — epithelial cells make mucus to shield against its own acid.',
    relatedCards: ['epithelial-function', 'pepsin-function', 'stomach-function', 'esophagus-acid'],
    tag: 'digestive',
  },
  {
    id: 'accessory-organs',
    category: 'Digestive System',
    term: 'What are the 3 accessory organs?',
    definition: 'Pancreas, Liver, Gallbladder',
    extendedNotes:
      'These organs assist digestion but food does not pass through them. They produce or store substances that are delivered to the small intestine. The pancreas provides enzymes and bicarbonate, the liver produces bile, and the gallbladder stores and concentrates bile until needed.',
    mnemonicHint:
      'PLG — "Please Let\'s Go." Pancreas, Liver, Gallbladder — the three helpers on the sidelines.',
    relatedCards: ['pancreas-function', 'liver-bile', 'gallbladder-function'],
    tag: 'digestive',
  },
  {
    id: 'pancreas-function',
    category: 'Digestive System',
    term: 'What does the pancreas do?',
    definition: 'Produces digestive enzymes + hormones insulin & glucagon (regulate blood sugar)',
    extendedNotes:
      'The pancreas has dual roles: its exocrine function produces digestive enzymes (lipase, amylase, trypsin) and bicarbonate delivered to the duodenum; its endocrine function produces insulin (lowers blood sugar) and glucagon (raises blood sugar) from the islets of Langerhans. This makes it critical for both digestion and blood sugar regulation.',
    mnemonicHint:
      'Pancreas = "Pan-creations." It creates enzymes for digestion AND hormones for blood sugar.',
    relatedCards: ['accessory-organs', 'chemical-digestion', 'liver-bile'],
    tag: 'digestive',
  },
  {
    id: 'liver-bile',
    category: 'Digestive System',
    term: 'What does the liver produce?',
    definition: 'Bile - emulsifying agent for physical digestion of fats. Also removes alcohol.',
    extendedNotes:
      'The liver is the largest internal organ and produces bile, which emulsifies (physically breaks up) large fat globules into smaller droplets, increasing surface area for lipase enzymes. Bile contains no enzymes — it performs mechanical digestion of fats. The liver also detoxifies the blood, processes nutrients, stores glycogen, and removes alcohol and drugs.',
    mnemonicHint:
      'Liver = "Live-r" — you can\'t live without it. Makes bile to break up fats like dish soap on grease.',
    relatedCards: ['accessory-organs', 'gallbladder-function', 'mechanical-digestion'],
    tag: 'digestive',
  },
  {
    id: 'gallbladder-function',
    category: 'Digestive System',
    term: 'What does the gallbladder do?',
    definition: 'Stores bile. Contracts and releases bile when a fatty meal is eaten.',
    extendedNotes:
      'The gallbladder is a small pear-shaped organ located beneath the liver. It concentrates and stores bile produced by the liver. When fat enters the duodenum, the hormone CCK (cholecystokinin) signals the gallbladder to contract and release bile through the bile duct. People can live without a gallbladder — bile just drips continuously from the liver.',
    mnemonicHint:
      'Gallbladder = "Gall-Bladder" = bile bladder. It\'s a storage bag for bile, squeezing it out for fatty meals.',
    relatedCards: ['accessory-organs', 'liver-bile', 'mechanical-digestion'],
    tag: 'digestive',
  },
  {
    id: 'villi',
    category: 'Digestive System',
    term: 'What are villi?',
    definition: 'Tiny finger-like projections in small intestine that increase surface area for nutrient absorption',
    extendedNotes:
      'Villi (singular: villus) are microscopic finger-like projections lining the inner wall of the small intestine. Each villus contains a network of capillaries and a lacteal (lymph vessel) for absorbing nutrients. The surface of each villus is further covered with microvilli, creating an enormous total surface area (~250 square metres) for maximum nutrient absorption.',
    mnemonicHint:
      'Villi = "Velvet fingers." Tiny fingers reaching out to grab nutrients from food as it passes by.',
    relatedCards: ['nutrient-absorption', 'large-intestine', 'celiac-disease'],
    tag: 'digestive',
  },
  {
    id: 'nutrient-absorption',
    category: 'Digestive System',
    term: 'How do nutrients enter blood from villi?',
    definition: 'By diffusion into capillaries inside each villus',
    extendedNotes:
      'Nutrients move from the small intestine lumen into the blood through diffusion across the thin epithelial wall of each villus into capillaries. The villi are only one cell thick to minimize diffusion distance. Nutrients then enter the bloodstream and are transported via the hepatic portal vein to the liver for processing before reaching the rest of the body.',
    mnemonicHint:
      'Nutrients diffuse from HIGH concentration (intestine) to LOW (blood) through the thin villus wall — passive movement.',
    relatedCards: ['villi', 'alveoli-gas-exchange', 'capillaries', 'celiac-disease'],
    tag: 'digestive',
  },
  {
    id: 'large-intestine',
    category: 'Digestive System',
    term: 'What does the large intestine do?',
    definition: 'Reabsorbs water + absorbs vitamins B & K. No digestion occurs.',
    extendedNotes:
      'The large intestine (colon) is about 1.5 metres long and wider than the small intestine. Its primary job is water reabsorption — without this, you would become dehydrated. Beneficial bacteria in the colon produce vitamins B and K, which are absorbed here. The remaining waste is compacted into feces and stored in the rectum.',
    mnemonicHint:
      'Large intestine = "Water recycling plant." No digestion — just reabsorbs water and vitamins B & K.',
    relatedCards: ['villi', 'digestion-time', 'nutrient-absorption'],
    tag: 'digestive',
  },
  {
    id: 'stomach-tissues',
    category: 'Digestive System',
    term: 'Name 3 tissue types in the stomach',
    definition: 'Epithelial (secretes HCl, pepsin, mucus), Smooth muscle (churning), Nervous (signals brain)',
    extendedNotes:
      'The stomach is an excellent example of how multiple tissue types work together in one organ. Epithelial tissue lines the interior and secretes gastric juices and protective mucus. Smooth muscle in three layers churns food mechanically. Nervous tissue coordinates the digestive process by signalling the brain about hunger, fullness, and regulating gastric secretions.',
    mnemonicHint:
      'Stomach uses ESN: Epithelial (secretes), Smooth muscle (squeezes), Nervous (signals). Three tissues, one organ.',
    relatedCards: ['tissue-types', 'epithelial-function', 'smooth-muscle-location', 'nervous-function'],
    tag: 'digestive',
  },
  {
    id: 'esophagus-acid',
    category: 'Digestive System',
    term: 'Why is the esophagus more susceptible to acid?',
    definition: 'Much thinner mucus layer than the stomach, so acid causes irritation/heartburn',
    extendedNotes:
      'The esophagus has a mucus lining, but it is much thinner than the stomach\'s protective layer because it is not designed to handle prolonged acid exposure. When stomach acid refluxes upward (GERD/heartburn), it irritates and can damage the esophageal lining. Chronic acid reflux can lead to Barrett\'s esophagus, a condition where esophageal cells change to resemble stomach lining.',
    mnemonicHint:
      'Esophagus has a "thin raincoat" vs. the stomach\'s "thick raincoat" — acid burns through the thin one easily.',
    relatedCards: ['stomach-protection', 'peristalsis', 'epithelial-function'],
    tag: 'digestive',
  },

  // ─── Respiratory System ────────────────────────────────────────────
  {
    id: 'why-breathe',
    category: 'Respiratory System',
    term: 'Why do we breathe?',
    definition: 'To bring O2 to lungs → hemoglobin → cells for cellular respiration (ATP) → CO2 returned to lungs',
    extendedNotes:
      'Breathing is the mechanism that supplies oxygen for cellular respiration, the process by which cells generate ATP (energy). Oxygen travels from lungs to blood (hemoglobin), then to cells. Cells use O2 and nutrients to produce ATP in mitochondria, generating CO2 as waste. CO2 is carried back to the lungs and exhaled.',
    mnemonicHint:
      'Breathe = "Bring Resources, Exhale All Trash, Help Energy." O2 in, ATP made, CO2 out.',
    relatedCards: ['cellular-respiration', 'hemoglobin', 'alveoli-gas-exchange', 'resp-circ-interaction'],
    tag: 'respiratory',
  },
  {
    id: 'nasal-pharynx',
    category: 'Respiratory System',
    term: 'What do nasal cavity + pharynx do?',
    definition: 'Filter, warm, and moisten incoming air',
    extendedNotes:
      'The nasal cavity is lined with mucus membranes and tiny hairs (vibrissae) that trap dust, pollen, and pathogens. Blood vessels close to the surface warm the air to body temperature. Moisture is added to prevent the delicate lung tissues from drying out. The pharynx (throat) is a shared passageway for both air and food.',
    mnemonicHint:
      'Nose = Nature\'s air conditioner. Filters (hairs + mucus), Warms (blood vessels), Moistens (mucus).',
    relatedCards: ['air-flow-order', 'epiglottis', 'trachea-lining'],
    tag: 'respiratory',
  },
  {
    id: 'epiglottis',
    category: 'Respiratory System',
    term: 'What is the epiglottis?',
    definition: 'Cartilage flap (connective tissue) covering trachea when swallowing to prevent choking',
    extendedNotes:
      'The epiglottis is a leaf-shaped piece of elastic cartilage that acts as a switch between the trachea (airway) and esophagus (food tube). During swallowing, it folds down to cover the glottis (opening of the trachea), directing food into the esophagus. During breathing, it stands upright to allow air into the trachea. Failure of this mechanism causes choking.',
    mnemonicHint:
      'Epiglottis = "Epi-GLOTTIS" = the lid ON TOP of the glottis. A trapdoor that covers the airway when you swallow.',
    relatedCards: ['connective-function', 'air-flow-order', 'trachea-cartilage'],
    tag: 'respiratory',
  },
  {
    id: 'trachea-cartilage',
    category: 'Respiratory System',
    term: 'What keeps the trachea open?',
    definition: 'C-shaped rings of cartilage (connective tissue)',
    extendedNotes:
      'The trachea (windpipe) is reinforced by 16-20 C-shaped rings of hyaline cartilage. These rings prevent the trachea from collapsing during pressure changes when breathing. The open part of the "C" faces the esophagus, allowing it to expand when food passes through. Cartilage is a type of connective tissue.',
    mnemonicHint:
      'C-rings in the trachea = like rings holding a vacuum hose open. "C" for Cartilage and C-shaped.',
    relatedCards: ['connective-function', 'trachea-lining', 'bronchi', 'epiglottis'],
    tag: 'respiratory',
  },
  {
    id: 'trachea-lining',
    category: 'Respiratory System',
    term: 'What lines the trachea?',
    definition: 'Cilia (tiny hairs) and mucus (epithelial tissue) to filter particles',
    extendedNotes:
      'The trachea is lined with ciliated pseudostratified columnar epithelium — cells with tiny hair-like projections (cilia) that beat in a coordinated wave. Goblet cells among them produce sticky mucus that traps inhaled particles, bacteria, and debris. The cilia sweep the mucus upward toward the throat in a "mucociliary escalator," where it is swallowed or coughed out.',
    mnemonicHint:
      'Cilia + Mucus = "Escalator of cleanliness." Mucus traps junk, cilia sweep it up and out.',
    relatedCards: ['epithelial-function', 'trachea-cartilage', 'nasal-pharynx', 'bronchi'],
    tag: 'respiratory',
  },
  {
    id: 'bronchi',
    category: 'Respiratory System',
    term: 'What are bronchi?',
    definition: 'Two branches from trachea delivering air to the lungs',
    extendedNotes:
      'The trachea splits into two primary bronchi (singular: bronchus) — one entering each lung. The right bronchus is wider, shorter, and more vertical than the left, which is why inhaled objects more commonly lodge in the right lung. The bronchi are also supported by cartilage rings and lined with ciliated epithelium.',
    mnemonicHint:
      'Bronchi = "Branches." The trachea branches into two bronchi — one per lung, like a tree fork.',
    relatedCards: ['trachea-cartilage', 'bronchioles', 'air-flow-order'],
    tag: 'respiratory',
  },
  {
    id: 'bronchioles',
    category: 'Respiratory System',
    term: 'What are bronchioles?',
    definition: 'Small branched tubes surrounded by smooth muscle. End in alveoli.',
    extendedNotes:
      'Bronchioles are the smallest airways in the lungs, branching from the bronchi like twigs from a tree branch. Unlike bronchi, they lack cartilage and instead are surrounded by smooth muscle that can constrict or dilate to regulate airflow. The terminal bronchioles lead to alveolar ducts and ultimately to the alveoli where gas exchange occurs.',
    mnemonicHint:
      'Bronchioles = "Baby bronchi." Smaller tubes with smooth muscle walls — they end at the alveoli.',
    relatedCards: ['bronchi', 'alveoli-gas-exchange', 'smooth-muscle-location', 'asthma'],
    tag: 'respiratory',
  },
  {
    id: 'alveoli-gas-exchange',
    category: 'Respiratory System',
    term: 'What are alveoli?',
    definition: 'Thin-walled air sacs surrounded by capillaries. Site of gas exchange by diffusion.',
    extendedNotes:
      'Alveoli (singular: alveolus) are tiny grape-like sacs at the ends of bronchioles. There are roughly 300 million alveoli in each lung, providing an enormous surface area (~70 square metres) for gas exchange. Oxygen diffuses from the alveoli into surrounding capillaries, while CO2 diffuses from capillaries into the alveoli to be exhaled.',
    mnemonicHint:
      'Alveoli = "Air grapes." Clusters of tiny sacs where O2 jumps into blood and CO2 jumps out.',
    relatedCards: ['bronchioles', 'alveoli-thin', 'capillaries', 'why-breathe'],
    tag: 'respiratory',
  },
  {
    id: 'diaphragm',
    category: 'Respiratory System',
    term: 'What is the diaphragm?',
    definition: 'Skeletal muscle. Contracts=inhale, Relaxes=exhale.',
    extendedNotes:
      'The diaphragm is a dome-shaped skeletal muscle that separates the thoracic cavity from the abdominal cavity. When it contracts, it flattens and moves downward, expanding the chest cavity and creating negative pressure that draws air into the lungs (inhalation). When it relaxes, it returns to its dome shape, pushing air out (exhalation). Intercostal muscles between the ribs assist this process.',
    mnemonicHint:
      'Diaphragm = "Down = Draw in air." Contracts down → lungs expand → inhale. Relaxes up → exhale.',
    relatedCards: ['skeletal-voluntary', 'why-breathe', 'alveoli-gas-exchange'],
    tag: 'respiratory',
  },
  {
    id: 'asthma',
    category: 'Respiratory System',
    term: 'What is asthma?',
    definition: 'Smooth muscle in bronchioles contracts, narrowing airways. Symptoms: wheezing, shortness of breath.',
    extendedNotes:
      'Asthma is a chronic condition where the smooth muscle surrounding bronchioles overreacts to triggers (allergens, cold air, exercise), causing bronchoconstriction. The airway lining also becomes inflamed and produces excess mucus, further narrowing the passages. Inhalers deliver bronchodilators that relax the smooth muscle, or corticosteroids that reduce inflammation.',
    mnemonicHint:
      'Asthma = "Airways Squeeze Too Hard, Making Air-flow difficult." Smooth muscle squeezes bronchioles shut.',
    relatedCards: ['bronchioles', 'smooth-muscle-location', 'air-flow-order'],
    tag: 'respiratory',
  },
  {
    id: 'air-flow-order',
    category: 'Respiratory System',
    term: 'Order of air flow?',
    definition: 'Nasal cavity → Pharynx → Epiglottis → Larynx → Trachea → Bronchi → Bronchioles → Alveoli',
    extendedNotes:
      'Air follows this path from the outside world to the gas exchange surfaces deep in the lungs. Each structure plays a role: filtering and warming (nasal cavity/pharynx), preventing choking (epiglottis), voice production (larynx), maintaining an open airway (trachea), branching to each lung (bronchi), fine-tuning airflow (bronchioles), and gas exchange (alveoli).',
    mnemonicHint:
      'Never Put Eggs in the Laundry — Try Buying Better Apples. Nasal, Pharynx, Epiglottis, Larynx, Trachea, Bronchi, Bronchioles, Alveoli.',
    relatedCards: ['nasal-pharynx', 'epiglottis', 'trachea-cartilage', 'bronchi', 'bronchioles', 'alveoli-gas-exchange'],
    tag: 'respiratory',
  },
  {
    id: 'alveoli-thin',
    category: 'Respiratory System',
    term: 'Why are alveoli epithelial cells only 1 cell thick?',
    definition: 'Allows rapid diffusion of O2 into blood and CO2 out',
    extendedNotes:
      'The alveolar walls are made of extremely thin squamous epithelial cells — just one cell layer thick (about 0.2 micrometres). Combined with the equally thin capillary walls, the total diffusion distance is minimal. This short distance allows oxygen and carbon dioxide to exchange rapidly by passive diffusion, driven by concentration gradients.',
    mnemonicHint:
      'Thinner = Faster diffusion. One cell thick = shortest path for O2 and CO2 to cross. "Thin to win."',
    relatedCards: ['alveoli-gas-exchange', 'epithelial-function', 'nutrient-absorption', 'capillaries'],
    tag: 'respiratory',
  },
  {
    id: 'cellular-respiration',
    category: 'Respiratory System',
    term: 'What is cellular respiration?',
    definition: 'Mitochondria use O2 + nutrients → ATP (energy) + CO2 (waste)',
    extendedNotes:
      'Cellular respiration is the metabolic process that occurs in the mitochondria of every cell. It uses oxygen and glucose (from digested food) to produce ATP, the universal energy currency of cells. Carbon dioxide and water are produced as byproducts. The overall equation is: C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP.',
    mnemonicHint:
      'Mitochondria = "Mighty-chondria" = the powerhouse. O2 + Food → Energy (ATP) + CO2 waste.',
    relatedCards: ['why-breathe', 'atp-production', 'hemoglobin'],
    tag: 'respiratory',
  },

  // ─── Circulatory System ────────────────────────────────────────────
  {
    id: 'circulatory-parts',
    category: 'Circulatory System',
    term: 'What are the 3 parts of a circulatory system?',
    definition: 'Pump (heart), Tubes (blood vessels), Fluid (blood)',
    extendedNotes:
      'Every circulatory system needs these three components: a pump to generate pressure (the heart), a network of tubes to carry fluid (arteries, veins, capillaries), and the fluid itself (blood containing plasma, RBCs, WBCs, and platelets). Together, they transport oxygen, nutrients, hormones, and waste products throughout the body.',
    mnemonicHint:
      'PTF: Pump, Tubes, Fluid. Like a building\'s plumbing — you need a pump, pipes, and water.',
    relatedCards: ['heart-chambers', 'arteries', 'veins', 'blood-components'],
    tag: 'circulatory',
  },
  {
    id: 'closed-double',
    category: 'Circulatory System',
    term: 'What type of circulatory system do humans have?',
    definition: 'Closed, double circulatory system',
    extendedNotes:
      'In a closed system, blood stays within vessels at all times (unlike open systems in insects). "Double" means blood passes through the heart twice per complete circuit: once to the lungs (pulmonary circuit) and once to the body (systemic circuit). This two-circuit design maintains high blood pressure for efficient oxygen delivery to tissues.',
    mnemonicHint:
      'Closed = blood stays in vessels. Double = two loops — lungs loop + body loop. Blood visits the heart twice per trip.',
    relatedCards: ['heart-chambers', 'blood-path', 'pulmonary-arteries', 'aorta'],
    tag: 'circulatory',
  },
  {
    id: 'heart-chambers',
    category: 'Circulatory System',
    term: 'Name the 4 heart chambers',
    definition: 'Right Atrium, Right Ventricle, Left Atrium, Left Ventricle',
    extendedNotes:
      'The heart has four chambers arranged in two pairs. The atria (upper chambers) receive blood returning to the heart, while the ventricles (lower chambers) pump blood out. The right side handles deoxygenated blood going to the lungs; the left side handles oxygenated blood going to the body. The left ventricle has the thickest walls because it must pump blood to the entire body.',
    mnemonicHint:
      'Atria = "Arrive" (blood arrives). Ventricles = "Venture out" (blood ventures out). Right = lungs, Left = body.',
    relatedCards: ['blood-path', 'septum', 'cardiac-muscle', 'closed-double'],
    tag: 'circulatory',
  },
  {
    id: 'blood-path',
    category: 'Circulatory System',
    term: 'Path of blood through the heart?',
    definition: 'Vena Cava → RA → RV → Pulm. Artery → Lungs → Pulm. Vein → LA → LV → Aorta',
    extendedNotes:
      'Deoxygenated blood returns from the body via the vena cava into the right atrium, then passes to the right ventricle, which pumps it through the pulmonary artery to the lungs. In the lungs, blood picks up O2 and drops off CO2. Oxygenated blood returns via pulmonary veins to the left atrium, then to the left ventricle, which pumps it through the aorta to the body.',
    mnemonicHint:
      'Follow the path: "Very Red Roses Provide Lovely Perfume, Lovely Lilies Also." VC→RA→RV→PA→Lungs→PV→LA→LV→Aorta.',
    relatedCards: ['heart-chambers', 'pulmonary-arteries', 'pulmonary-veins', 'aorta'],
    tag: 'circulatory',
  },
  {
    id: 'pulmonary-arteries',
    category: 'Circulatory System',
    term: 'What is unique about pulmonary arteries?',
    definition: 'They carry DEOXYGENATED blood (to lungs). Exception to the rule.',
    extendedNotes:
      'Normally, arteries carry oxygenated blood. Pulmonary arteries are the exception — they carry deoxygenated blood from the right ventricle to the lungs for gas exchange. Remember: arteries are defined by carrying blood AWAY from the heart, not by oxygen content. The pulmonary arteries are the only arteries in the body carrying deoxygenated blood.',
    mnemonicHint:
      'Pulmonary Artery = the "rebel artery." Arteries usually carry O2 blood, but this one carries blue (deoxygenated) blood TO lungs.',
    relatedCards: ['pulmonary-veins', 'blood-path', 'arteries', 'closed-double'],
    tag: 'circulatory',
  },
  {
    id: 'pulmonary-veins',
    category: 'Circulatory System',
    term: 'What is unique about pulmonary veins?',
    definition: 'They carry OXYGENATED blood (from lungs to left atrium). Exception to the rule.',
    extendedNotes:
      'Normally, veins carry deoxygenated blood. Pulmonary veins are the exception — they carry freshly oxygenated blood from the lungs back to the left atrium. There are four pulmonary veins (two from each lung). Like pulmonary arteries, they remind us that vessel names are based on direction of flow (toward/away from heart), not oxygen content.',
    mnemonicHint:
      'Pulmonary Veins = the "rebel veins." Veins usually carry deoxygenated blood, but these carry red (oxygenated) blood FROM lungs.',
    relatedCards: ['pulmonary-arteries', 'blood-path', 'veins', 'heart-chambers'],
    tag: 'circulatory',
  },
  {
    id: 'aorta',
    category: 'Circulatory System',
    term: 'What does the aorta do?',
    definition: 'Largest artery. Carries oxygenated blood from LV to systemic circulation.',
    extendedNotes:
      'The aorta is the largest blood vessel in the body, about 2.5 cm in diameter. It arches over the heart and branches into smaller arteries that supply every organ and tissue. Because it receives blood directly from the left ventricle at high pressure, its walls are very thick and elastic to handle the force of each heartbeat.',
    mnemonicHint:
      'Aorta = "A-One artery." The #1, biggest artery — the main highway carrying oxygenated blood from the heart.',
    relatedCards: ['arteries', 'blood-path', 'heart-chambers'],
    tag: 'circulatory',
  },
  {
    id: 'arteries',
    category: 'Circulatory System',
    term: 'What are arteries?',
    definition: 'Carry blood AWAY from heart. Thick, elastic, muscular walls. Usually oxygenated.',
    extendedNotes:
      'Arteries have thick walls with three layers: a smooth inner endothelium, a thick middle layer of smooth muscle and elastic fibres, and a tough outer layer. This structure allows them to withstand and maintain the high pressure generated by the heart. Arteries branch into smaller arterioles, which regulate blood flow to capillary beds.',
    mnemonicHint:
      'Arteries = "A" = AWAY from heart. Thick walls for high pressure. Think "Artery = Away."',
    relatedCards: ['veins', 'capillaries', 'aorta', 'pulmonary-arteries'],
    tag: 'circulatory',
  },
  {
    id: 'veins',
    category: 'Circulatory System',
    term: 'What are veins?',
    definition: 'Carry blood TOWARD heart. Thinner walls. Have valves. Usually deoxygenated.',
    extendedNotes:
      'Veins have thinner walls than arteries because blood flows at lower pressure on the return trip to the heart. They contain one-way valves that prevent blood from flowing backward, especially important in the legs where blood must flow against gravity. Skeletal muscle contractions around veins help push blood upward toward the heart (skeletal muscle pump).',
    mnemonicHint:
      'Veins have Valves — both start with "V." Valves keep blood flowing one way — toward the heart.',
    relatedCards: ['arteries', 'capillaries', 'pulmonary-veins', 'blood-path'],
    tag: 'circulatory',
  },
  {
    id: 'capillaries',
    category: 'Circulatory System',
    term: 'What are capillaries?',
    definition: 'Smallest vessels. Connect arteries to veins. Exchange materials by diffusion.',
    extendedNotes:
      'Capillaries are microscopic vessels only one cell thick, connecting arterioles to venules. Their thin walls allow exchange of oxygen, carbon dioxide, nutrients, and waste between blood and tissues by diffusion. Capillaries are so narrow that red blood cells must pass through them in single file. The capillary network is so extensive that nearly every cell in the body is within a few cells of a capillary.',
    mnemonicHint:
      'Capillaries = "Cap-illaries" = tiny caps connecting arteries to veins. One cell thick for easy exchange.',
    relatedCards: ['arteries', 'veins', 'alveoli-gas-exchange', 'nutrient-absorption'],
    tag: 'circulatory',
  },
  {
    id: 'blood-components',
    category: 'Circulatory System',
    term: 'What are the 4 blood components?',
    definition: 'Plasma (55%), RBCs (44%), WBCs, Platelets (1%)',
    extendedNotes:
      'Plasma is the liquid portion — mostly water with dissolved proteins, nutrients, hormones, and waste. Red blood cells (erythrocytes) carry oxygen via hemoglobin. White blood cells (leukocytes) fight infection as part of the immune system. Platelets (thrombocytes) are cell fragments involved in blood clotting. Together, an adult has about 5 litres of blood.',
    mnemonicHint:
      'Blood = PRWP: Plasma (liquid taxi), Red (O2 carriers), White (immune soldiers), Platelets (patch crew).',
    relatedCards: ['hemoglobin', 'circulatory-parts', 'connective-function'],
    tag: 'circulatory',
  },
  {
    id: 'hemoglobin',
    category: 'Circulatory System',
    term: 'What is hemoglobin?',
    definition: 'Protein in RBCs that binds O2 in lungs and carries it to cells. Also carries CO2 back.',
    extendedNotes:
      'Hemoglobin is an iron-containing protein that gives red blood cells their colour. Each hemoglobin molecule can bind four oxygen molecules. In the lungs (high O2), hemoglobin loads oxygen; in body tissues (low O2), it releases oxygen. It also transports about 23% of CO2 back to the lungs (most CO2 travels as bicarbonate in plasma). Iron deficiency leads to anemia — fewer functional hemoglobin molecules.',
    mnemonicHint:
      'Hemo-GLOBE-in = a tiny globe (ball) inside RBCs that grabs O2 in the lungs and drops it off at cells.',
    relatedCards: ['blood-components', 'why-breathe', 'alveoli-gas-exchange', 'resp-circ-interaction'],
    tag: 'circulatory',
  },
  {
    id: 'septum',
    category: 'Circulatory System',
    term: 'What is the septum?',
    definition: 'Wall dividing right and left sides of heart, preventing blood mixing',
    extendedNotes:
      'The interventricular septum is a thick muscular wall that completely separates the right and left ventricles. This is essential because the right side carries deoxygenated blood and the left carries oxygenated blood — mixing would reduce oxygen delivery efficiency. A hole in the septum (septal defect) is a congenital heart condition that can require surgical repair.',
    mnemonicHint:
      'Septum = "Separator." Like a wall down the middle of the heart — keeps blue blood and red blood apart.',
    relatedCards: ['heart-chambers', 'blood-path', 'closed-double'],
    tag: 'circulatory',
  },
  {
    id: 'heart-beat-rate',
    category: 'Circulatory System',
    term: 'How often does the heart beat?',
    definition: '60-80 bpm, ~90,000/day, through ~150,000 km of vessels',
    extendedNotes:
      'The heart beats about 100,000 times per day and pumps approximately 7,500 litres of blood daily. The SA node (sinoatrial node), the heart\'s natural pacemaker, generates electrical impulses that trigger each contraction. The extensive network of blood vessels — if laid end to end — would stretch about 150,000 km, enough to circle the Earth nearly four times.',
    mnemonicHint:
      '60-80 bpm at rest. ~100,000 beats/day. 150,000 km of vessels = almost 4 trips around Earth.',
    relatedCards: ['cardiac-muscle', 'circulatory-parts', 'heart-chambers'],
    tag: 'circulatory',
  },

  // ─── System Interactions ───────────────────────────────────────────
  {
    id: 'resp-circ-interaction',
    category: 'System Interactions',
    term: 'How do respiratory + circulatory interact?',
    definition: 'Respiratory brings O2 to lungs. At alveoli, O2 loads onto hemoglobin. Heart pumps oxygenated blood to body. CO2 returns to lungs.',
    extendedNotes:
      'The respiratory and circulatory systems are tightly linked at the alveoli, where gas exchange occurs. The respiratory system handles ventilation (moving air in and out), while the circulatory system handles perfusion (blood flow past the alveoli). Without the circulatory system, oxygen would stay in the lungs; without the respiratory system, blood could not reload with oxygen.',
    mnemonicHint:
      'Respiratory = "Air delivery." Circulatory = "Blood delivery." They meet at the alveoli loading dock to swap O2 and CO2.',
    relatedCards: ['why-breathe', 'alveoli-gas-exchange', 'hemoglobin', 'atp-production'],
    tag: 'interactions',
  },
  {
    id: 'atp-production',
    category: 'System Interactions',
    term: 'How do digestive + respiratory + circulatory produce ATP?',
    definition: 'Digestive: nutrients → blood. Respiratory: O2 → blood. Circulatory: delivers both to cells. Mitochondria: O2 + nutrients → ATP + CO2.',
    extendedNotes:
      'ATP production requires all three systems working together. The digestive system breaks food into absorbable nutrients (glucose, amino acids, fatty acids). The respiratory system brings in oxygen. The circulatory system transports both to every cell. Inside cells, mitochondria combine O2 and nutrients through cellular respiration to generate ATP. If any system fails, energy production drops.',
    mnemonicHint:
      'Three systems, one goal: Digestive = FUEL, Respiratory = OXYGEN, Circulatory = DELIVERY TRUCK. Mitochondria = FACTORY making ATP.',
    relatedCards: ['cellular-respiration', 'resp-circ-interaction', 'villi', 'hemoglobin'],
    tag: 'interactions',
  },
  {
    id: 'celiac-disease',
    category: 'System Interactions',
    term: 'Why does Celiac disease cause fatigue and weight loss?',
    definition: 'Flattened villi → less surface area → less nutrient absorption → less ATP (fatigue) + body uses stored fat/muscle (weight loss)',
    extendedNotes:
      'Celiac disease is an autoimmune condition triggered by gluten. The immune response damages and flattens the villi in the small intestine, drastically reducing the surface area available for nutrient absorption. With fewer nutrients entering the blood, cells cannot produce enough ATP (causing fatigue). The body compensates by breaking down fat and muscle stores for energy (causing weight loss). This demonstrates how damage in one system cascades to affect the whole body.',
    mnemonicHint:
      'Celiac = "Ceiling collapsed on villi." Flat villi → no nutrients → no energy → tired and thin. One system failure affects all.',
    relatedCards: ['villi', 'nutrient-absorption', 'atp-production', 'cellular-respiration'],
    tag: 'interactions',
  },
];

/** Named export matching the store's import convention. */
export const CARDS = cards;

/**
 * Category color mapping for UI badges.
 */
export const CATEGORY_COLORS: Record<string, string> = {
  'Tissues': '#bf5af2',
  'Digestive System': '#ff9f0a',
  'Respiratory System': '#4f8ef7',
  'Circulatory System': '#ff453a',
  'System Interactions': '#34c759',
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
