/**
 * Disease- and trait-related constants for the disease/trait portal.
 */

export const DISEASE_CARDS = [
  {
    aliases: ["ADHD"],
    val: "ADHD",
    cardLabel: "Attention deficit hyperactive disorder",
    cardDesc: "Demontis… Børglum (2023) Nat. Genet.",
    link: "https://doi.org/10.1038/s41588-022-01285-8",
    diseaseDesc:
      "Attention deficit hyperactive disorder (ADHD) is a neurodevelopmental psychiatric disease usually diagnosed in childhood and characterized by trouble paying attention, controlling impulses, or being overly active that affects about 5% of children and 2.5% of adults. Twin studies suggest ADHD is approximately 70% heritable and shares genetic risk with other psychiatric conditions, including mood disorders, schizophrenia, and autism spectrum disorder. Treatment of ADHD involves behavioral therapy and medications, usually stimulants.",
  },
  {
    val: "AgeFirstBirth",
    cardLabel: "Mother's Age at birth of first child",
    cardDesc: "Mills... Day (2021) Nat. Hum. Behav.",
    link: "https://doi.org/10.1038/s41562-021-01135-3",
    diseaseDesc: "The mother’s age when she has her first child.",
  },
  {
    aliases: ["Alzheimers", "Alzheimer"],
    val: "Alzheimers",
    cardLabel: "Alzheimer's Disease",
    cardDesc: "Bellenguez … Lambert (2022) Nat. Genet.",
    link: "https://doi.org/10.1038/s41588-022-01024-z",
    diseaseDesc:
      "Alzheimer’s disease is a neurodegenerative disease beginning with mild and progressively worsening memory loss that affects approximately 6% of people over age 65. It is the most common cause of dementia and symptoms include problems with recent memory, language, disorientation, mood swings, self-neglect and behavioral issues. Alzheimer’s disease has complex risk factors, including APOE mutations, advanced age, environmental factors, and common genetic variants. Medications can help with some symptoms and new treatments promising to slow disease progression are emerging, but their efficacy in clinical use remains unclear.",
  },
  {
    aliases: ["Anorexia", "Eating disorder"],
    val: "Anorexia",
    cardLabel: "Anorexia Nervosa",
    link: "https://doi.org/10.1038/s41588-019-0439-2",
    cardDesc: "Watson… Bulik (2019) Nat. Genet.",
    diseaseDesc:
      "Anorexia nervosa (often simply anorexia) is an eating disorder characterized by food restriction, body image problems, fear of weight gain, and low weight that affects women more than men. Cultural, social, and genetic factors play a role, and identical twins are more often both affected than fraternal twins. Therapy is the mainstay of treatment although medications may be used for concomitant depression or anxiety.",
  },
  {
    aliases: ["ASD", "Autism", "Autism spectrum"],
    val: "ASD",
    cardLabel: "Autism spectrum disorder",
    cardDesc: "Grove… Børglum (2019) Nat. Genet.",
    link: "https://doi.org/10.1038/s41588-019-0344-8",
    diseaseDesc:
      "Autism spectrum disorder is a range of neurodevelopmental diseases that involve difficulties in social communication, repetitive behaviors, restricted interests and sensory reactivity. Autism has a strong genetic basis and several rare genetic abnormalities are highly causative; however, many common variants also confer risk of the disease. Autism commonly co-occurs with other neurologic, psychiatric or congenital abnormalities and shares genetic risk variants with other psychiatric diseases.",
  },
  {
    aliases: ["mania"],
    val: "BipolarDisorder",
    cardLabel: "Bipolar Disorder",
    cardDesc: "Mullins… Andreassen (2021) Nat. Genet.",
    link: "https://doi.org/10.1038/s41588-021-00857-4",
    diseaseDesc:
      "Bipolar disorder is a mood disorder characterized by bouts of depression intermixed with episodes of mania or hypomania. During manic episodes, people experience elated moods, happiness, and sometimes make impulsive decisions. There is a strong genetic basis to bipolar disorder and environmental factors also play a role. Medical therapy including mood stabilizers and anticonvulsants are the mainstay of treatment, supported by therapy.",
  },
  {
    val: "Schizophrenia",
    cardLabel: "Schizophrenia",
    cardDesc: "Trubetskoy … O’Donovan (2022) Nature",
    link: "https://doi.org/10.1038/s41586-022-04434-5",
    diseaseDesc:
      "Schizophrenia is a psychiatric disease characterized by psychosis, a state of altered mental status with symptoms including hallucinations, delusions, disorganized thinking. Other symptoms include social withdrawal, apathy and decreased emotional expression. Schizophrenia affects approximately 0.5% of people. Genetic and environmental factors play a role in developing schizophrenia and over one hundred genetic variants have been associated with the disease. Medical treatment involves antipsychotics which primarily act as dopamine antagonists.",
  },
  {
    aliases: ["BMI"],
    val: "BMI",
    cardLabel: "Body Mass Index",
    cardDesc: "Yengo… Visscher (2018) Hum. Mol. Genet.",
    link: "https://doi.org/10.1093/hmg/ddy271",
    diseaseDesc:
      "A person’s body mass index (BMI) – weight divided by height-squared (in kilograms and meters).",
  },
  {
    aliases: ["smoking"],
    val: "CigsPerDay",
    cardLabel: "Cigarettes smoked per day",
    cardDesc: "",
    link: "https://doi.org/10.1038/s41467-022-34688-6",
    diseaseDesc:
      "The number of cigarettes a cigarette smoker has per day. This averages around 15 but is skewed by people who smoke many cigarettes per day.",
  },
  {
    aliases: ["smoking"],
    val: "EverSmoked",
    cardLabel: "History of smoking",
    cardDesc: "Karlsson Linnér… Beauchamp (2019)  Nat. Genet.",
    link: "https://doi.org/10.1038/s41588-018-0309-3",
    diseaseDesc:
      "Whether someone has ever smoked. Smoking as a behavior is affected by personality, upbringing, social and cultural factors, and genetics to some extent.",
  },
  {
    val: "Insomnia",
    cardLabel: "Insomnia",
    cardDesc: "Backman… Ferreira (2021) Nature.",
    link: "https://doi.org/10.1038/s41586-021-04103-z",
    diseaseDesc:
      "Insomnia is a sleep disorder characterized by difficulty falling asleep or staying asleep, and often involves daytime sleepiness, low energy, and depressed mood. Genetic and environmental risk factors play a role. Treatments for insomnia include sleep hygiene, lifestyle changes such as reducing caffeine or alcohol consumption or increasing exercise, and medications including melatonin agonists or central nervous system depressants. Approximately 6% of people are affected by insomnia that lasts more than a month and is not due to another primary cause.",
  },
  {
    val: "Intelligence",
    cardLabel: "Intelligence",
    cardDesc: "Savage… Posthuma (2018) Nat. Genet.",
    link: "https://doi.org/10.1038/s41588-018-0152-6",
    diseaseDesc:
      "As measured by an assessment of “fluid intelligence,” this describes a capacity to solve problems that require logic and reasoning and do not depend on prior knowledge.",
  },
  {
    val: "ReactionTime",
    cardLabel: "Reaction Time",
    cardDesc: "Davies… Deary (2018) Nat. Commun.",
    link: "https://doi.org/10.1038/s41467-018-04362-x",
    diseaseDesc:
      "This category examines the genetics of reaction time as measured by 12 rounds of a card game, “Snap.” A participant is shown two cards at a time. If both cards are the same, they press a button as quickly as possible.",
  },
  /*{
    val: "Dyslexia",
    cardLabel: "Dyslexia",
    cardDesc: "",
    diseaseDesc:
      "Dyslexia is a disorder characterized by below-age-level reading ability, including difficulties spelling, reading, writing, and “sounding-out” words. It has a genetic basis and runs in families, and affects about 3-7% of the general population. Boys are diagnosed more often than girls, but this may be due to social factors in diagnosis rather than a true gender disparity. Dyslexia can develop after insult to the brain’s language processing faculties, such as by trauma, stroke or dementia. Treatment for dyslexia involves changing how reading and writing are taught.",
  },*/
  {
    val: "Parkinsons",
    cardLabel: "Parkinson’s Disease",
    cardDesc: "Nalls… Singleton (2019) Lancet Neurol.",
    link: "https://doi.org/10.1016/S1474-4422(19)30320-5",
    diseaseDesc:
      "Parkinson’s disease is a long-term neurodegenerative movement disease that affects the motor system, and in more advanced disease, other brain functions. Parkinson’s disease is caused by loss of dopaminergic neurons in the substancia nigra of the midbrain. It affects approximately 1% of people over age 60. The cause is unknown with a genetic component and an environmental component, with pesticide exposure and head injuries conferring increasing risk, and drinking coffee, tea, or smoking decreasing risk. Primary treatments include dopamine agonists; however, these become less useful in advanced disease.",
  },
  {
    val: "SleepDuration",
    cardLabel: "Sleep Duration",
    cardDesc: "Dashti… Saxena (2019) Nat. Commun.",
    link: "https://doi.org/10.1038/s41467-019-08917-4",
    diseaseDesc:
      "The number of hours of sleep per day a person gets. On average, people sleep a little more than 7 hours a day, with most people sleeping between 6 to 8 hours on average.",
  },
  {
    val: "YearsEducation",
    cardLabel: "Years of Education",
    cardDesc: "Okbay… Young (2022) Nat. Genet.",
    link: "https://doi.org/10.1038/s41588-022-01016-z",
    diseaseDesc:
      "The level of education of people in the United Kingdom, ranging from little or no formal education to advanced professional degrees.",
  },
  {
    aliases: ["Major Depressive Disorder", "Depression", "MDD"],
    val: "Depression",
    cardLabel: "Major Depressive Disorder",
    cardDesc: "Howard… McIntosh (2019) Nat. Neurosci.",
    link: "https://doi.org/10.1038/s41593-018-0326-7",
    diseaseDesc:
      "Major depressive disorder (commonly: clinical depression) is a mood disorder characterized by periods of low mood, low self-esteem, and disinterest or loss of pleasure in normally enjoyable activities. Depression causes the second most years lived with disability, after back pain. The disease has a genetic basis that accounts for about 40% of disease risk with other environmental factors including some major life changes, medications, and other health conditions contributing additional risk. Depression can be treated with psychotherapy and medications (often SSRIs).",
  },
];

export const URL_CHROM_MAP = {
  ADHD: "chr20",
  AgeFirstBirth: "chr22",
  Alzheimers: "chr21",
  Anorexia: "chr11",
  ASD: "chr20",
  BipolarDisorder: "chr22",
  BMI: "chr22",
  CigsPerDay: "chr21",
  "Major Depressive Disorder": "chr20",
  "Attention deficit hyperactive disorder": "chr20",
  Depression: "chr20",
  //Dyslexia: "chr22",
  EverSmoked: "chr22",
  Insomnia: "chr18",
  Intelligence: "chr22",
  Parkinsons: "chr18",
  ReactionTime: "chr18",
  Schizophrenia: "chr22",
  SleepDuration: "chr20",
  YearsEducation: "chr22",
};

export const URL_MAP = {
  ADHD: "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/ADHD_meta_PGC.filtered.bigBed",
  AgeFirstBirth:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/AgeFirstBirth_Mills_meta.filtered.bigBed",
  Alzheimers:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/Alzheimers_Bellenguez_meta.filtered.bigBed",
  Anorexia:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/Anorexia_meta_PGC.filtered.bigBed",
  ASD: "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/ASD_Matoba2021.filtered.bigBed",
  BipolarDisorder:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/Bipolar_PGC_meta.filtered.bigBed",
  BMI: "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/BMI_meta_Yengo.filtered.bigBed",
  CigsPerDay:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/CigarettesPerDay_meta_Koskeridis.filtered.bigBed",
  "Major Depressive Disorder":
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/MDD_PGC_meta.filtered.bigBed",
  /*"Attention deficit hyperactive disorder":
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/ADHD_meta_PGC.filtered.bigBed",*/
  Depression:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/MDD_PGC_meta.filtered.bigBed",
  Dyslexia: "dyslexia",
  EverSmoked:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/EverSmoked_meta_Karlsson.filtered.bigBed",
  Insomnia:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/Insomnia_UKB_Backman.filtered.bigBed",
  Intelligence:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/Intelligence_meta_Savage.filtered.bigBed",
  Parkinsons:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/Parkinson_Nalls_meta.filtered.bigBed",
  ReactionTime:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/ReactionTime_Davies.filtered.bigBed",
  Schizophrenia:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/SCZ_meta_PGC.filtered.bigBed",
  SleepDuration:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/SleepDuration_meta_Dashti.filtered.bigBed",
  YearsEducation:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_filteredsumstats/YearsOfEducation_meta_Okbay.filtered.bigBed",
};

export const FULLSUMSTAT_URL_MAP = {
  ADHD: "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ADHD_meta_PGC.formatted.bigBed",
  AgeFirstBirth:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/AgeFirstBirth_Mills_meta.formatted.bigBed",
  Alzheimers:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Alzheimers_Bellenguez_meta.formatted.bigBed",
  Anorexia:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Anorexia_meta_PGC.formatted.bigBed",
  ASD: "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ASD_Matoba2021.formatted.bigBed",
  BipolarDisorder:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Bipolar_PGC_meta.formatted.bigBed",
  BMI: "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/BMI_meta_Yengo.formatted.bigBed",
  CigsPerDay:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/CigarettesPerDay_meta_Koskeridis.formatted.bigBed",
  "Major Depressive Disorder":
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/MDD_PGC_meta.formatted.bigBed",
  "Attention deficit hyperactive disorder":
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ADHD_meta_PGC.formatted.bigBed",
  Depression:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/MDD_PGC_meta.formatted.bigBed",
  //Dyslexia: "dyslexia",
  EverSmoked:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/EverSmoked_meta_Karlsson.formatted.bigBed",
  Insomnia:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Insomnia_UKB_Backman.formatted.bigBed",
  Intelligence:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Intelligence_meta_Savage.formatted.bigBed",
  Parkinsons:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Parkinson_Nalls_meta.formatted.bigBed",
  ReactionTime:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ReactionTime_Davies.formatted.bigBed",
  Schizophrenia:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/SCZ_meta_PGC.formatted.bigBed",
  SleepDuration:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/SleepDuration_meta_Dashti.formatted.bigBed",
  YearsEducation:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/YearsOfEducation_meta_Okbay.formatted.bigBed",
};
