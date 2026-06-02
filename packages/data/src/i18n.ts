export type Locale = 'en' | 'es' | 'fr' | 'ja' | 'pt' | 'de' | 'fr-CA';

export interface UIStrings {
  nav: {
    bestNootropics: string;
    compare: string;
    ingredients: string;
    guides: string;
    methodology: string;
    /** Public chrome "About" link — consumed by FPHeader's localized default nav. */
    about: string;
    topPicks: string;
    search: string;
    openMenu: string;
    closeMenu: string;
    /** aria-label for the primary `<nav>` landmark in public chrome. WCAG 3.1.2. */
    primaryLandmark: string;
    /** Label on the indigo "Open comparator" CTA in FPHeader. WCAG 3.1.2. */
    openComparator: string;
    /** Skip-link target text in PublicShell (first focusable element). WCAG 3.1.2 + 2.4.1. */
    skipToContent: string;
  };
  footer: {
    /** Left-column tagline paragraph. */
    tagline: string;
    /** Bottom-row copyright sentence. `{year}` is interpolated at render time. */
    copyrightLine: string;
    /** Prefix shown before the audit date in the bottom-right meta line. */
    lastAuditLabel: string;
    /** Label between the date and the version (e.g. "Methodology"). */
    methodologyLabel: string;
    /** Column 1: best-by-goal. */
    bestByGoal: {
      heading: string;
      focus: string;
      memory: string;
      adhd: string;
      aging: string;
      energy: string;
      mood: string;
      studying: string;
    };
    /** Column 2: head-to-head comparisons. Brand-vs-brand link labels stay English (proper nouns); only "All comparisons →" translates. */
    headToHead: {
      heading: string;
      allComparisons: string;
    };
    /** Column 3: regional cross-domain links. Country/region names translate (WCAG 3.1.2 — these are natural language, not proper nouns). */
    byRegion: {
      heading: string;
      us: string;
      eu: string;
      ca: string;
      au: string;
      jp: string;
      latam: string;
    };
    /** Column 4: about/legal/policy. */
    about: {
      heading: string;
      methodology: string;
      disclosures: string;
      privacy: string;
      cookies: string;
      imprint: string;
      contact: string;
    };
  };
  cookie: {
    message: string;
    gdprNote: string;
    accept: string;
    decline: string;
    privacyPolicy: string;
  };
  disclosure: {
    text: string;
    methodology: string;
  };
  table: {
    product: string;
    bestFor: string;
    score: string;
    priceMo: string;
    caffeineFree: string;
    euStatus: string;
    moneyBack: string;
    trustpilot: string;
    checkPrice: string;
    noResults: string;
    yes: string;
    no: string;
    na: string;
    sortBy: string;
    ascending: string;
    descending: string;
  };
  breadcrumb: {
    home: string;
    ingredients: string;
    /** Components append " {currentYear}" after this string. */
    backToBestNootropics: string;
    backToIngredientsGuide: string;
  };
  ingredientDetail: {
    chips: {
      clinicalDose: string;
      onset: string;
    };
    sections: {
      mechanism: string;
      evidence: string;
      effects: string;
      benefits: string;
      sideEffects: string;
      howTo: string;
      stacking: string;
      faq: string;
      related: string;
    };
    /** TOC labels in the sidebar Quick facts card. */
    toc: {
      mechanism: string;
      evidence: string;
      effects: string;
      benefits: string;
      howTo: string;
      stacking: string;
      faq: string;
      products: string;
      related: string;
    };
    table: {
      effect: string;
      evidence: string;
      magnitude: string;
      studies: string;
      notes: string;
    };
    magnitude: {
      large: string;
      moderate: string;
      small: string;
      negligible: string;
    };
    category: {
      adaptogen: string;
      cholinergic: string;
      mushroom: string;
      amino: string;
      herb: string;
      vitamin: string;
    };
    sidebar: {
      quickFacts: string;
      onThisPage: string;
      category: string;
      dose: string;
      onset: string;
      trials: string;
    };
    /** Template with {name} placeholder. */
    stackingLede: string;
  };
  productDetail: {
    chips: {
      editorPick: string;
      caffeineFree: string;
      hasCaffeine: string;
      allClinicalDoses: string;
      handsOnTested: string;
      /** Health Canada NPN-licensed. Number appended after the label in JSX. */
      npnLicensed: string;
      /** Reaches CA via Personal Importation Program (not Health Canada licensed). */
      personalImport: string;
      /** JP Foods with Function Claims (機能性表示食品) notified to the Consumer Affairs Agency. */
      ffcNotified: string;
      /** AU TGA Listed Medicine. Number appended after the label in JSX. */
      austListed: string;
      /** Halal-certified by a verifiable body (JAKIM, MUI, BPJPH, IFANCA, GAC, etc.). */
      halalCertified: string;
    };
    meta: {
      /** Prefix before brand name in the meta line: "By {brand}". */
      by: string;
      /** Static descriptor between brand and serving count. */
      productDescriptor: string;
      /** Short label for capsule count, e.g. "ct" / "Stück". */
      countSuffix: string;
      /** Prefix before the updated date, e.g. "Updated" / "Aktualisiert". */
      updated: string;
    };
    /** BCP-47 locale code passed to Intl.DateTimeFormat for the meta-line date. */
    dateLocale: string;
    score: {
      label: string;
      outOf10: string;
    };
    stats: {
      price: string;
      /** Monthly-price suffix, e.g. "/mo" / "/Monat". */
      perMonth: string;
      capsules: string;
      /** Per-day suffix, e.g. "/day" / "/Tag". */
      perDay: string;
      moneyBack: string;
      /** "days" suffix for the money-back-guarantee value. */
      days: string;
      trustpilot: string;
      notAvailable: string;
      ourCut: string;
    };
    /** CTA label inside the header card, e.g. "Visit brand →". */
    visitBrand: string;
    tabs: {
      overview: string;
      dosing: string;
      pillars: string;
      reviews: string;
      pricing: string;
      /** Tab-bar accessible name. */
      ariaLabel: string;
    };
    /** Heading for the bottom alternatives rail. */
    alternatives: string;
    /** Eyebrow heading + section name for the YMYL regulatory disclaimer. */
    healthDisclaimerHeading: string;
    /** aria-label for the chip row above the product name (groups Editor's pick, Caffeine-free, regulatory chips, etc.). */
    chipGroupLabel: string;
  };
}

const en: UIStrings = {
  nav: {
    bestNootropics: 'Best Nootropics',
    compare: 'Compare',
    ingredients: 'Ingredients',
    guides: 'Guides',
    methodology: 'Methodology',
    about: 'About',
    topPicks: 'Top Picks',
    search: 'Search',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primaryLandmark: 'Primary',
    openComparator: 'Open comparator →',
    skipToContent: 'Skip to main content',
  },
  footer: {
    tagline:
      "We audit every nootropic against its clinical-trial doses. Affiliate commissions are disclosed inline and don't move scores.",
    copyrightLine:
      '© {year} Nootropic Lab · Information is not medical advice. Consult a clinician before starting any supplement.',
    lastAuditLabel: 'Last full re-audit:',
    methodologyLabel: 'Methodology',
    bestByGoal: {
      heading: 'Best by goal',
      focus: 'For focus',
      memory: 'For memory',
      adhd: 'For ADHD',
      aging: 'For aging',
      energy: 'For energy',
      mood: 'For mood',
      studying: 'For studying',
    },
    headToHead: {
      heading: 'Head-to-head',
      allComparisons: 'All comparisons →',
    },
    byRegion: {
      heading: 'By region',
      us: 'United States',
      eu: 'European Union',
      ca: 'Canada',
      au: 'Australia',
      jp: 'Japan',
      latam: 'Latin America',
    },
    about: {
      heading: 'About',
      methodology: 'Methodology',
      disclosures: 'Disclosures',
      privacy: 'Privacy',
      cookies: 'Cookies',
      imprint: 'Imprint',
      contact: 'Contact',
    },
  },
  cookie: {
    message: 'We use analytics cookies to improve your experience. We do not use advertising cookies.',
    gdprNote: 'GDPR: Analytics fires only after you accept. Necessary cookies are always active.',
    accept: 'Accept Analytics',
    decline: 'Decline',
    privacyPolicy: 'privacy policy',
  },
  disclosure: {
    text: 'Affiliate disclosure: This page contains affiliate links. If you purchase through our links, we may earn a commission at no extra cost to you. Our editorial opinions are independent — we only recommend products we have independently researched.',
    methodology: 'Read our methodology',
  },
  table: {
    product: 'Product',
    bestFor: 'Best For',
    score: 'Score',
    priceMo: 'Price/mo',
    caffeineFree: 'Caffeine-Free',
    euStatus: 'EU Status',
    moneyBack: 'Money-Back',
    trustpilot: 'Trustpilot',
    checkPrice: 'Check Price →',
    noResults: 'No products match your filters. Try removing one.',
    yes: 'Yes',
    no: 'No',
    na: 'N/A',
    sortBy: 'Sort by',
    ascending: 'ascending',
    descending: 'descending',
  },
  breadcrumb: {
    home: 'Home',
    ingredients: 'Ingredients',
    backToBestNootropics: '← Back to Best Nootropics',
    backToIngredientsGuide: '← Back to Ingredients Guide',
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Clinical dose', onset: 'Onset' },
    sections: {
      mechanism: 'Mechanism of action',
      evidence: 'Clinical evidence summary',
      effects: 'Human effect matrix',
      benefits: 'Documented benefits',
      sideEffects: 'Side effects & cautions',
      howTo: 'How to take',
      stacking: 'Stacking recommendations',
      faq: 'Frequently asked questions',
      related: 'Related ingredients',
    },
    toc: {
      mechanism: 'Mechanism',
      evidence: 'Clinical evidence',
      effects: 'Effect matrix',
      benefits: 'Benefits & side effects',
      howTo: 'How to take',
      stacking: 'Stacking',
      faq: 'FAQ',
      products: 'Products with it',
      related: 'Related ingredients',
    },
    table: {
      effect: 'Effect',
      evidence: 'Evidence',
      magnitude: 'Magnitude',
      studies: 'Studies',
      notes: 'Notes',
    },
    magnitude: { large: 'Large', moderate: 'Moderate', small: 'Small', negligible: 'Negligible' },
    category: {
      adaptogen: 'Adaptogen',
      cholinergic: 'Cholinergic',
      mushroom: 'Mushroom',
      amino: 'Amino Acid',
      herb: 'Herb',
      vitamin: 'Vitamin',
    },
    sidebar: {
      quickFacts: 'Quick facts',
      onThisPage: 'On this page',
      category: 'Category',
      dose: 'Dose',
      onset: 'Onset',
      trials: 'Trials',
    },
    stackingLede: 'Ingredients that pair well with {name} and why.',
  },
  productDetail: {
    chips: {
      editorPick: 'Editor\'s pick',
      caffeineFree: 'Caffeine-free',
      hasCaffeine: 'Caffeine',
      allClinicalDoses: 'All clinical doses',
      handsOnTested: 'Hands-on tested',
      npnLicensed: 'Health Canada NPN',
      personalImport: 'Personal Import',
      ffcNotified: 'FFC notified',
      austListed: 'AUST L',
      halalCertified: 'Halal certified',
    },
    meta: {
      by: 'By',
      productDescriptor: 'daily nootropic capsule',
      countSuffix: 'ct',
      updated: 'Updated',
    },
    dateLocale: 'en-US',
    score: {
      label: 'Our score',
      outOf10: 'of 10.0',
    },
    stats: {
      price: 'Price',
      perMonth: '/mo',
      capsules: 'Caps',
      perDay: '/day',
      moneyBack: 'MBG',
      days: 'days',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/A',
      ourCut: 'Our cut',
    },
    visitBrand: 'Visit brand →',
    tabs: {
      overview: 'Overview',
      dosing: 'Dosing audit',
      pillars: 'Pillars',
      reviews: 'Reviews',
      pricing: 'Pricing',
      ariaLabel: 'Product sections',
    },
    alternatives: 'Similar alternatives',
    healthDisclaimerHeading: 'Health disclaimer',
    chipGroupLabel: 'Product attributes',
  },
};

const es: UIStrings = {
  nav: {
    bestNootropics: 'Los Mejores',
    compare: 'Comparar',
    ingredients: 'Ingredientes',
    guides: 'Guías',
    methodology: 'Metodología',
    about: 'Acerca de',
    topPicks: 'Mejores Opciones',
    search: 'Buscar',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    primaryLandmark: 'Navegación principal',
    openComparator: 'Abrir comparador →',
    skipToContent: 'Saltar al contenido principal',
  },
  footer: {
    tagline:
      'Auditamos cada nootrópico contra sus dosis de ensayos clínicos. Las comisiones de afiliados se divulgan en línea y no afectan las puntuaciones.',
    copyrightLine:
      '© {year} Nootropic Lab · La información no es asesoramiento médico. Consulte a un médico antes de comenzar cualquier suplemento.',
    lastAuditLabel: 'Última auditoría completa:',
    methodologyLabel: 'Metodología',
    bestByGoal: {
      heading: 'Mejores por objetivo',
      focus: 'Para concentración',
      memory: 'Para memoria',
      adhd: 'Para TDAH',
      aging: 'Para envejecimiento',
      energy: 'Para energía',
      mood: 'Para estado de ánimo',
      studying: 'Para estudio',
    },
    headToHead: {
      heading: 'Frente a frente',
      allComparisons: 'Todas las comparaciones →',
    },
    byRegion: {
      heading: 'Por región',
      us: 'Estados Unidos',
      eu: 'Unión Europea',
      ca: 'Canadá',
      au: 'Australia',
      jp: 'Japón',
      latam: 'América Latina',
    },
    about: {
      heading: 'Acerca de',
      methodology: 'Metodología',
      disclosures: 'Divulgaciones',
      privacy: 'Privacidad',
      cookies: 'Cookies',
      imprint: 'Aviso legal',
      contact: 'Contacto',
    },
  },
  cookie: {
    message: 'Usamos cookies de análisis para mejorar su experiencia. No usamos cookies publicitarias.',
    gdprNote: 'GDPR: Los análisis solo se activan después de aceptar. Las cookies necesarias siempre están activas.',
    accept: 'Aceptar Análisis',
    decline: 'Rechazar',
    privacyPolicy: 'política de privacidad',
  },
  disclosure: {
    text: 'Divulgación de afiliados: Esta página contiene enlaces de afiliados. Si compra a través de nuestros enlaces, podemos ganar una comisión sin costo adicional para usted. Nuestras opiniones editoriales son independientes — solo recomendamos productos que hemos investigado de forma independiente.',
    methodology: 'Lea nuestra metodología',
  },
  table: {
    product: 'Producto',
    bestFor: 'Mejor para',
    score: 'Puntuación',
    priceMo: 'Precio/mes',
    caffeineFree: 'Sin Cafeína',
    euStatus: 'Estado UE',
    moneyBack: 'Devolución',
    trustpilot: 'Trustpilot',
    checkPrice: 'Ver Precio →',
    noResults: 'Ningún producto coincide con sus filtros. Intente eliminar uno.',
    yes: 'Sí',
    no: 'No',
    na: 'N/A',
    sortBy: 'Ordenar por',
    ascending: 'ascendente',
    descending: 'descendente',
  },
  breadcrumb: {
    home: 'Inicio',
    ingredients: 'Ingredientes',
    backToBestNootropics: '← Volver a Los Mejores Nootrópicos',
    backToIngredientsGuide: '← Volver a la Guía de Ingredientes',
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Dosis clínica', onset: 'Inicio de acción' },
    sections: {
      mechanism: 'Mecanismo de acción',
      evidence: 'Resumen de evidencia clínica',
      effects: 'Matriz de efectos en humanos',
      benefits: 'Beneficios documentados',
      sideEffects: 'Efectos secundarios y precauciones',
      howTo: 'Cómo tomarlo',
      stacking: 'Recomendaciones de combinación',
      faq: 'Preguntas frecuentes',
      related: 'Ingredientes relacionados',
    },
    toc: {
      mechanism: 'Mecanismo',
      evidence: 'Evidencia clínica',
      effects: 'Matriz de efectos',
      benefits: 'Beneficios y efectos secundarios',
      howTo: 'Cómo tomarlo',
      stacking: 'Combinación',
      faq: 'Preguntas frecuentes',
      products: 'Productos que lo contienen',
      related: 'Ingredientes relacionados',
    },
    table: {
      effect: 'Efecto',
      evidence: 'Evidencia',
      magnitude: 'Magnitud',
      studies: 'Estudios',
      notes: 'Notas',
    },
    magnitude: { large: 'Grande', moderate: 'Moderado', small: 'Pequeño', negligible: 'Insignificante' },
    category: {
      adaptogen: 'Adaptógeno',
      cholinergic: 'Colinérgico',
      mushroom: 'Hongo',
      amino: 'Aminoácido',
      herb: 'Hierba',
      vitamin: 'Vitamina',
    },
    sidebar: {
      quickFacts: 'Datos rápidos',
      onThisPage: 'En esta página',
      category: 'Categoría',
      dose: 'Dosis',
      onset: 'Inicio',
      trials: 'Ensayos',
    },
    stackingLede: 'Ingredientes que se combinan bien con {name} y por qué.',
  },
  productDetail: {
    chips: {
      editorPick: 'Elección editorial',
      caffeineFree: 'Sin cafeína',
      hasCaffeine: 'Con cafeína',
      allClinicalDoses: 'Todas las dosis clínicas',
      handsOnTested: 'Probado en persona',
      npnLicensed: 'NPN de Health Canada',
      personalImport: 'Importación personal',
      ffcNotified: 'Notificado al FFC',
      austListed: 'AUST L',
      halalCertified: 'Certificado halal',
    },
    meta: {
      by: 'Por',
      productDescriptor: 'cápsula nootrópica diaria',
      countSuffix: 'cáps.',
      updated: 'Actualizado',
    },
    dateLocale: 'es-419',
    score: {
      label: 'Nuestra puntuación',
      outOf10: 'sobre 10,0',
    },
    stats: {
      price: 'Precio',
      perMonth: '/mes',
      capsules: 'Cáps.',
      perDay: '/día',
      moneyBack: 'Garantía',
      days: 'días',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/D',
      ourCut: 'Nuestra comisión',
    },
    visitBrand: 'Visitar marca →',
    tabs: {
      overview: 'Resumen',
      dosing: 'Auditoría de dosis',
      pillars: 'Pilares',
      reviews: 'Opiniones',
      pricing: 'Precios',
      ariaLabel: 'Secciones del producto',
    },
    alternatives: 'Alternativas similares',
    healthDisclaimerHeading: 'Aviso de salud',
    chipGroupLabel: 'Atributos del producto',
  },
};

const fr: UIStrings = {
  nav: {
    bestNootropics: 'Les Meilleurs',
    compare: 'Comparer',
    ingredients: 'Ingrédients',
    guides: 'Guides',
    methodology: 'Méthodologie',
    about: 'À propos',
    topPicks: 'Nos Choix',
    search: 'Rechercher',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    primaryLandmark: 'Navigation principale',
    openComparator: 'Ouvrir le comparateur →',
    skipToContent: 'Aller au contenu principal',
  },
  footer: {
    tagline:
      "Nous auditons chaque nootropique selon les doses des essais cliniques. Les commissions d'affiliation sont divulguées en ligne et n'influencent pas les notes.",
    copyrightLine:
      "© {year} Nootropic Lab · Les informations ne constituent pas un avis médical. Consultez un clinicien avant de commencer tout supplément.",
    lastAuditLabel: 'Dernier audit complet :',
    methodologyLabel: 'Méthodologie',
    bestByGoal: {
      heading: 'Meilleurs par objectif',
      focus: 'Pour la concentration',
      memory: 'Pour la mémoire',
      adhd: 'Pour le TDAH',
      aging: 'Pour le vieillissement',
      energy: "Pour l'énergie",
      mood: "Pour l'humeur",
      studying: "Pour l'étude",
    },
    headToHead: {
      heading: 'Face-à-face',
      allComparisons: 'Toutes les comparaisons →',
    },
    byRegion: {
      heading: 'Par région',
      us: 'États-Unis',
      eu: 'Union européenne',
      ca: 'Canada',
      au: 'Australie',
      jp: 'Japon',
      latam: 'Amérique latine',
    },
    about: {
      heading: 'À propos',
      methodology: 'Méthodologie',
      disclosures: 'Divulgations',
      privacy: 'Confidentialité',
      cookies: 'Cookies',
      imprint: 'Mentions légales',
      contact: 'Contact',
    },
  },
  cookie: {
    message: 'Nous utilisons des cookies analytiques pour améliorer votre expérience. Nous n\'utilisons pas de cookies publicitaires.',
    gdprNote: 'RGPD : Les analyses ne se déclenchent qu\'après votre acceptation. Les cookies nécessaires sont toujours actifs.',
    accept: 'Accepter',
    decline: 'Refuser',
    privacyPolicy: 'politique de confidentialité',
  },
  disclosure: {
    text: 'Divulgation d\'affiliation : Cette page contient des liens affiliés. Si vous achetez via nos liens, nous pouvons gagner une commission sans frais supplémentaires. Nos opinions éditoriales sont indépendantes.',
    methodology: 'Lire notre méthodologie',
  },
  table: {
    product: 'Produit',
    bestFor: 'Idéal pour',
    score: 'Note',
    priceMo: 'Prix/mois',
    caffeineFree: 'Sans Caféine',
    euStatus: 'Statut UE',
    moneyBack: 'Remboursement',
    trustpilot: 'Trustpilot',
    checkPrice: 'Voir le Prix →',
    noResults: 'Aucun produit ne correspond à vos filtres. Essayez d\'en supprimer un.',
    yes: 'Oui',
    no: 'Non',
    na: 'N/A',
    sortBy: 'Trier par',
    ascending: 'croissant',
    descending: 'décroissant',
  },
  breadcrumb: {
    home: 'Accueil',
    ingredients: 'Ingrédients',
    backToBestNootropics: '← Retour aux Meilleurs Nootropiques',
    backToIngredientsGuide: '← Retour au Guide des Ingrédients',
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Dose clinique', onset: 'Délai d\'action' },
    sections: {
      mechanism: 'Mécanisme d\'action',
      evidence: 'Résumé des preuves cliniques',
      effects: 'Matrice des effets humains',
      benefits: 'Bénéfices documentés',
      sideEffects: 'Effets indésirables et précautions',
      howTo: 'Comment le prendre',
      stacking: 'Recommandations de combinaison',
      faq: 'Questions fréquentes',
      related: 'Ingrédients connexes',
    },
    toc: {
      mechanism: 'Mécanisme',
      evidence: 'Preuves cliniques',
      effects: 'Matrice des effets',
      benefits: 'Bénéfices et effets indésirables',
      howTo: 'Comment le prendre',
      stacking: 'Combinaison',
      faq: 'FAQ',
      products: 'Produits qui en contiennent',
      related: 'Ingrédients connexes',
    },
    table: {
      effect: 'Effet',
      evidence: 'Preuves',
      magnitude: 'Ampleur',
      studies: 'Études',
      notes: 'Notes',
    },
    magnitude: { large: 'Grand', moderate: 'Modéré', small: 'Petit', negligible: 'Négligeable' },
    category: {
      adaptogen: 'Adaptogène',
      cholinergic: 'Cholinergique',
      mushroom: 'Champignon',
      amino: 'Acide aminé',
      herb: 'Plante',
      vitamin: 'Vitamine',
    },
    sidebar: {
      quickFacts: 'Faits clés',
      onThisPage: 'Sur cette page',
      category: 'Catégorie',
      dose: 'Dose',
      onset: 'Délai',
      trials: 'Essais',
    },
    stackingLede: 'Ingrédients qui se combinent bien avec {name} et pourquoi.',
  },
  productDetail: {
    chips: {
      editorPick: 'Choix de la rédaction',
      caffeineFree: 'Sans caféine',
      hasCaffeine: 'Contient de la caféine',
      allClinicalDoses: 'Toutes les doses cliniques',
      handsOnTested: 'Testé en main',
      npnLicensed: 'NPN Santé Canada',
      personalImport: 'Importation personnelle',
      ffcNotified: 'Notifié FFC',
      austListed: 'AUST L',
      halalCertified: 'Certifié halal',
    },
    meta: {
      by: 'Par',
      productDescriptor: 'capsule nootropique quotidienne',
      countSuffix: 'caps.',
      updated: 'Mis à jour',
    },
    dateLocale: 'fr-FR',
    score: {
      label: 'Notre note',
      outOf10: 'sur 10,0',
    },
    stats: {
      price: 'Prix',
      perMonth: '/mois',
      capsules: 'Caps.',
      perDay: '/jour',
      moneyBack: 'Garantie',
      days: 'jours',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/D',
      ourCut: 'Notre commission',
    },
    visitBrand: 'Visiter la marque →',
    tabs: {
      overview: 'Aperçu',
      dosing: 'Audit du dosage',
      pillars: 'Piliers',
      reviews: 'Avis',
      pricing: 'Tarification',
      ariaLabel: 'Sections du produit',
    },
    alternatives: 'Alternatives similaires',
    healthDisclaimerHeading: 'Avis de santé',
    chipGroupLabel: 'Attributs du produit',
  },
};

const ja: UIStrings = {
  nav: {
    bestNootropics: 'ベスト',
    compare: '比較',
    ingredients: '成分',
    guides: 'ガイド',
    methodology: '評価方法',
    about: '運営者情報',
    topPicks: 'おすすめ',
    search: '検索',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
    primaryLandmark: 'メインナビゲーション',
    openComparator: '比較ツールを開く →',
    skipToContent: 'メインコンテンツへスキップ',
  },
  footer: {
    tagline:
      'すべてのノートロピクスを臨床試験の用量で監査しています。アフィリエイト報酬はインラインで開示され、評価には影響しません。',
    copyrightLine:
      '© {year} Nootropic Lab · 情報は医学的助言ではありません。サプリメントを開始する前に医師に相談してください。',
    lastAuditLabel: '最終全面監査:',
    methodologyLabel: '評価方法',
    bestByGoal: {
      heading: '目的別ベスト',
      focus: '集中力向上',
      memory: '記憶力向上',
      adhd: 'ADHD対策',
      aging: 'エイジングケア',
      energy: 'エネルギー向上',
      mood: '気分改善',
      studying: '学習サポート',
    },
    headToHead: {
      heading: '直接比較',
      allComparisons: 'すべての比較 →',
    },
    byRegion: {
      heading: '地域別',
      us: 'アメリカ',
      eu: '欧州連合',
      ca: 'カナダ',
      au: 'オーストラリア',
      jp: '日本',
      latam: 'ラテンアメリカ',
    },
    about: {
      heading: '運営者情報',
      methodology: '評価方法',
      disclosures: '開示事項',
      privacy: 'プライバシー',
      cookies: 'Cookie',
      imprint: '特定商取引法に基づく表記',
      contact: 'お問い合わせ',
    },
  },
  cookie: {
    message: '体験向上のために分析Cookieを使用しています。広告Cookieは使用していません。',
    gdprNote: 'GDPR：分析は同意後にのみ有効になります。必要なCookieは常にアクティブです。',
    accept: '分析を許可',
    decline: '拒否',
    privacyPolicy: 'プライバシーポリシー',
  },
  disclosure: {
    text: 'アフィリエイト広告を含みます：このページにはアフィリエイトリンクが含まれています。当社のリンクを通じて購入された場合、追加費用なしでコミッションを受け取る場合があります。編集意見は独立しており、独自に調査した製品のみを推奨しています。',
    methodology: '評価方法を読む',
  },
  table: {
    product: '製品',
    bestFor: '最適な用途',
    score: 'スコア',
    priceMo: '価格/月',
    caffeineFree: 'カフェインフリー',
    euStatus: 'EU状態',
    moneyBack: '返金保証',
    trustpilot: 'Trustpilot',
    checkPrice: '価格を確認 →',
    noResults: 'フィルターに一致する製品がありません。フィルターを1つ削除してみてください。',
    yes: 'はい',
    no: 'いいえ',
    na: 'N/A',
    sortBy: '並べ替え',
    ascending: '昇順',
    descending: '降順',
  },
  breadcrumb: {
    home: 'ホーム',
    ingredients: '成分',
    backToBestNootropics: '← ベストノートロピクスに戻る',
    backToIngredientsGuide: '← 成分ガイドに戻る',
  },
  ingredientDetail: {
    chips: { clinicalDose: '臨床用量', onset: '効果発現時間' },
    sections: {
      mechanism: '作用機序',
      evidence: '臨床エビデンスの概要',
      effects: 'ヒト効果マトリクス',
      benefits: '実証された効果',
      sideEffects: '副作用と注意事項',
      howTo: '摂取方法',
      stacking: 'スタッキングの推奨',
      faq: 'よくある質問',
      related: '関連成分',
    },
    toc: {
      mechanism: '作用機序',
      evidence: '臨床エビデンス',
      effects: '効果マトリクス',
      benefits: '効果と副作用',
      howTo: '摂取方法',
      stacking: 'スタッキング',
      faq: 'FAQ',
      products: '含有製品',
      related: '関連成分',
    },
    table: {
      effect: '効果',
      evidence: 'エビデンス',
      magnitude: '効果の大きさ',
      studies: '研究数',
      notes: '備考',
    },
    magnitude: { large: '大', moderate: '中', small: '小', negligible: 'ごくわずか' },
    category: {
      adaptogen: 'アダプトゲン',
      cholinergic: 'コリン作動性',
      mushroom: 'きのこ類',
      amino: 'アミノ酸',
      herb: 'ハーブ',
      vitamin: 'ビタミン',
    },
    sidebar: {
      quickFacts: '基本情報',
      onThisPage: '目次',
      category: 'カテゴリ',
      dose: '用量',
      onset: '効果発現',
      trials: '試験数',
    },
    stackingLede: '{name}と相性の良い成分とその理由。',
  },
  productDetail: {
    chips: {
      editorPick: '編集部のおすすめ',
      caffeineFree: 'カフェインフリー',
      hasCaffeine: 'カフェイン含有',
      allClinicalDoses: '全成分が臨床用量',
      handsOnTested: '実機テスト済み',
      npnLicensed: 'カナダ保健省 NPN',
      personalImport: '個人輸入',
      ffcNotified: '機能性表示食品',
      austListed: 'AUST L',
      halalCertified: 'ハラール認証',
    },
    meta: {
      by: '販売：',
      productDescriptor: '毎日のノートロピクスカプセル',
      countSuffix: '粒',
      updated: '更新日：',
    },
    dateLocale: 'ja-JP',
    score: {
      label: '当社の評価',
      outOf10: '10.0点満点',
    },
    stats: {
      price: '価格',
      perMonth: '/月',
      capsules: 'カプセル',
      perDay: '/日',
      moneyBack: '返金保証',
      days: '日間',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/A',
      ourCut: '当社の手数料',
    },
    visitBrand: 'ブランドサイトへ →',
    tabs: {
      overview: '概要',
      dosing: '用量チェック',
      pillars: '柱',
      reviews: 'レビュー',
      pricing: '価格',
      ariaLabel: '製品セクション',
    },
    alternatives: '類似の代替品',
    healthDisclaimerHeading: '健康に関する免責事項',
    chipGroupLabel: '製品の属性',
  },
};

const pt: UIStrings = {
  nav: {
    bestNootropics: 'Os Melhores',
    compare: 'Comparar',
    ingredients: 'Ingredientes',
    guides: 'Guias',
    methodology: 'Metodologia',
    about: 'Sobre',
    topPicks: 'Melhores Escolhas',
    search: 'Pesquisar',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    primaryLandmark: 'Navegação principal',
    openComparator: 'Abrir comparador →',
    skipToContent: 'Ir para o conteúdo principal',
  },
  footer: {
    tagline:
      'Auditamos cada nootrópico contra as suas doses de ensaios clínicos. As comissões de afiliados são divulgadas em linha e não influenciam as pontuações.',
    copyrightLine:
      '© {year} Nootropic Lab · As informações não são aconselhamento médico. Consulte um clínico antes de iniciar qualquer suplemento.',
    lastAuditLabel: 'Última auditoria completa:',
    methodologyLabel: 'Metodologia',
    bestByGoal: {
      heading: 'Melhores por objetivo',
      focus: 'Para foco',
      memory: 'Para memória',
      adhd: 'Para TDAH',
      aging: 'Para envelhecimento',
      energy: 'Para energia',
      mood: 'Para humor',
      studying: 'Para estudo',
    },
    headToHead: {
      heading: 'Frente a frente',
      allComparisons: 'Todas as comparações →',
    },
    byRegion: {
      heading: 'Por região',
      us: 'Estados Unidos',
      eu: 'União Europeia',
      ca: 'Canadá',
      au: 'Austrália',
      jp: 'Japão',
      latam: 'América Latina',
    },
    about: {
      heading: 'Sobre',
      methodology: 'Metodologia',
      disclosures: 'Divulgações',
      privacy: 'Privacidade',
      cookies: 'Cookies',
      imprint: 'Aviso legal',
      contact: 'Contacto',
    },
  },
  cookie: {
    message: 'Utilizamos cookies de análise para melhorar a sua experiência. Não utilizamos cookies de publicidade.',
    gdprNote: 'RGPD: A análise só é ativada após a sua aceitação. Os cookies necessários estão sempre ativos.',
    accept: 'Aceitar',
    decline: 'Recusar',
    privacyPolicy: 'política de privacidade',
  },
  disclosure: {
    text: 'Divulgação de afiliação: Esta página contém links de afiliados. Se comprar através dos nossos links, podemos ganhar uma comissão sem custos adicionais. As nossas opiniões editoriais são independentes.',
    methodology: 'Ler a nossa metodologia',
  },
  table: {
    product: 'Produto',
    bestFor: 'Melhor para',
    score: 'Pontuação',
    priceMo: 'Preço/mês',
    caffeineFree: 'Sem Cafeína',
    euStatus: 'Estado UE',
    moneyBack: 'Devolução',
    trustpilot: 'Trustpilot',
    checkPrice: 'Ver Preço →',
    noResults: 'Nenhum produto corresponde aos seus filtros. Tente remover um.',
    yes: 'Sim',
    no: 'Não',
    na: 'N/A',
    sortBy: 'Ordenar por',
    ascending: 'ascendente',
    descending: 'descendente',
  },
  breadcrumb: {
    home: 'Início',
    ingredients: 'Ingredientes',
    backToBestNootropics: '← Voltar aos Melhores Nootrópicos',
    backToIngredientsGuide: '← Voltar ao Guia de Ingredientes',
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Dose clínica', onset: 'Início de ação' },
    sections: {
      mechanism: 'Mecanismo de ação',
      evidence: 'Resumo de evidências clínicas',
      effects: 'Matriz de efeitos em humanos',
      benefits: 'Benefícios documentados',
      sideEffects: 'Efeitos colaterais e precauções',
      howTo: 'Como tomar',
      stacking: 'Recomendações de combinação',
      faq: 'Perguntas frequentes',
      related: 'Ingredientes relacionados',
    },
    toc: {
      mechanism: 'Mecanismo',
      evidence: 'Evidências clínicas',
      effects: 'Matriz de efeitos',
      benefits: 'Benefícios e efeitos colaterais',
      howTo: 'Como tomar',
      stacking: 'Combinação',
      faq: 'Perguntas frequentes',
      products: 'Produtos que contêm',
      related: 'Ingredientes relacionados',
    },
    table: {
      effect: 'Efeito',
      evidence: 'Evidência',
      magnitude: 'Magnitude',
      studies: 'Estudos',
      notes: 'Notas',
    },
    magnitude: { large: 'Grande', moderate: 'Moderado', small: 'Pequeno', negligible: 'Insignificante' },
    category: {
      adaptogen: 'Adaptógeno',
      cholinergic: 'Colinérgico',
      mushroom: 'Cogumelo',
      amino: 'Aminoácido',
      herb: 'Erva',
      vitamin: 'Vitamina',
    },
    sidebar: {
      quickFacts: 'Dados rápidos',
      onThisPage: 'Nesta página',
      category: 'Categoria',
      dose: 'Dose',
      onset: 'Início',
      trials: 'Ensaios',
    },
    stackingLede: 'Ingredientes que combinam bem com {name} e por quê.',
  },
  productDetail: {
    chips: {
      editorPick: 'Escolha editorial',
      caffeineFree: 'Sem cafeína',
      hasCaffeine: 'Com cafeína',
      allClinicalDoses: 'Todas as doses clínicas',
      handsOnTested: 'Testado pessoalmente',
      npnLicensed: 'NPN Health Canada',
      personalImport: 'Importação pessoal',
      ffcNotified: 'Notificado FFC',
      austListed: 'AUST L',
      halalCertified: 'Certificado halal',
    },
    meta: {
      by: 'Por',
      productDescriptor: 'cápsula nootrópica diária',
      countSuffix: 'cáps.',
      updated: 'Atualizado',
    },
    dateLocale: 'pt-PT',
    score: {
      label: 'Nossa pontuação',
      outOf10: 'em 10,0',
    },
    stats: {
      price: 'Preço',
      perMonth: '/mês',
      capsules: 'Cáps.',
      perDay: '/dia',
      moneyBack: 'Garantia',
      days: 'dias',
      trustpilot: 'Trustpilot',
      notAvailable: 'N/D',
      ourCut: 'Nossa comissão',
    },
    visitBrand: 'Visitar marca →',
    tabs: {
      overview: 'Visão geral',
      dosing: 'Auditoria de dosagem',
      pillars: 'Pilares',
      reviews: 'Avaliações',
      pricing: 'Preços',
      ariaLabel: 'Secções do produto',
    },
    alternatives: 'Alternativas semelhantes',
    healthDisclaimerHeading: 'Aviso de saúde',
    chipGroupLabel: 'Atributos do produto',
  },
};

const de: UIStrings = {
  nav: {
    bestNootropics: 'Beste Nootropika',
    compare: 'Vergleichen',
    ingredients: 'Inhaltsstoffe',
    guides: 'Ratgeber',
    methodology: 'Methodik',
    about: 'Über uns',
    topPicks: 'Top-Empfehlungen',
    search: 'Suchen',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    primaryLandmark: 'Hauptnavigation',
    openComparator: 'Vergleichstool öffnen →',
    skipToContent: 'Zum Hauptinhalt springen',
  },
  footer: {
    tagline:
      'Wir prüfen jedes Nootropikum gegen die Dosen aus klinischen Studien. Affiliate-Provisionen werden inline offengelegt und beeinflussen die Bewertungen nicht.',
    copyrightLine:
      '© {year} Nootropic Lab · Informationen sind keine medizinische Beratung. Konsultieren Sie einen Arzt, bevor Sie ein Nahrungsergänzungsmittel einnehmen.',
    lastAuditLabel: 'Letzte vollständige Prüfung:',
    methodologyLabel: 'Methodik',
    bestByGoal: {
      heading: 'Beste nach Ziel',
      focus: 'Für Konzentration',
      memory: 'Für Gedächtnis',
      adhd: 'Für ADHS',
      aging: 'Für Altern',
      energy: 'Für Energie',
      mood: 'Für Stimmung',
      studying: 'Für das Lernen',
    },
    headToHead: {
      heading: 'Direktvergleich',
      allComparisons: 'Alle Vergleiche →',
    },
    byRegion: {
      heading: 'Nach Region',
      us: 'Vereinigte Staaten',
      eu: 'Europäische Union',
      ca: 'Kanada',
      au: 'Australien',
      jp: 'Japan',
      latam: 'Lateinamerika',
    },
    about: {
      heading: 'Über uns',
      methodology: 'Methodik',
      disclosures: 'Offenlegungen',
      privacy: 'Datenschutz',
      cookies: 'Cookies',
      imprint: 'Impressum',
      contact: 'Kontakt',
    },
  },
  cookie: {
    message: 'Wir verwenden Analyse-Cookies, um Ihre Erfahrung zu verbessern. Wir verwenden keine Werbe-Cookies.',
    gdprNote: 'DSGVO: Analytics wird erst nach Ihrer Zustimmung aktiviert. Notwendige Cookies sind immer aktiv.',
    accept: 'Analyse akzeptieren',
    decline: 'Ablehnen',
    privacyPolicy: 'Datenschutzerklärung',
  },
  disclosure: {
    text: 'Affiliate-Hinweis: Diese Seite enthält Affiliate-Links. Wenn Sie über unsere Links kaufen, erhalten wir eine Provision ohne zusätzliche Kosten für Sie. Unsere redaktionellen Meinungen sind unabhängig — wir empfehlen nur Produkte, die wir unabhängig recherchiert haben.',
    methodology: 'Methodik lesen',
  },
  table: {
    product: 'Produkt',
    bestFor: 'Geeignet für',
    score: 'Bewertung',
    priceMo: 'Preis/Monat',
    caffeineFree: 'Koffeinfrei',
    euStatus: 'EU-Status',
    moneyBack: 'Geld-zurück',
    trustpilot: 'Trustpilot',
    checkPrice: 'Preis prüfen →',
    noResults: 'Keine Produkte entsprechen Ihren Filtern. Bitte einen Filter entfernen.',
    yes: 'Ja',
    no: 'Nein',
    na: 'k. A.',
    sortBy: 'Sortieren nach',
    ascending: 'aufsteigend',
    descending: 'absteigend',
  },
  breadcrumb: {
    home: 'Start',
    ingredients: 'Inhaltsstoffe',
    backToBestNootropics: '← Zurück zu Beste Nootropika',
    backToIngredientsGuide: '← Zurück zum Inhaltsstoff-Ratgeber',
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Klinische Dosis', onset: 'Wirkungseintritt' },
    sections: {
      mechanism: 'Wirkmechanismus',
      evidence: 'Zusammenfassung klinischer Evidenz',
      effects: 'Effekt-Matrix beim Menschen',
      benefits: 'Dokumentierte Vorteile',
      sideEffects: 'Nebenwirkungen und Vorsichtsmaßnahmen',
      howTo: 'Einnahme',
      stacking: 'Kombinationsempfehlungen',
      faq: 'Häufig gestellte Fragen',
      related: 'Verwandte Inhaltsstoffe',
    },
    toc: {
      mechanism: 'Wirkmechanismus',
      evidence: 'Klinische Evidenz',
      effects: 'Effekt-Matrix',
      benefits: 'Vorteile und Nebenwirkungen',
      howTo: 'Einnahme',
      stacking: 'Kombination',
      faq: 'FAQ',
      products: 'Produkte mit diesem Inhaltsstoff',
      related: 'Verwandte Inhaltsstoffe',
    },
    table: {
      effect: 'Effekt',
      evidence: 'Evidenz',
      magnitude: 'Ausmaß',
      studies: 'Studien',
      notes: 'Anmerkungen',
    },
    magnitude: { large: 'Groß', moderate: 'Mäßig', small: 'Klein', negligible: 'Vernachlässigbar' },
    category: {
      adaptogen: 'Adaptogen',
      cholinergic: 'Cholinergikum',
      mushroom: 'Pilz',
      amino: 'Aminosäure',
      herb: 'Heilkraut',
      vitamin: 'Vitamin',
    },
    sidebar: {
      quickFacts: 'Kurzfakten',
      onThisPage: 'Auf dieser Seite',
      category: 'Kategorie',
      dose: 'Dosis',
      onset: 'Wirkungseintritt',
      trials: 'Studien',
    },
    stackingLede: 'Inhaltsstoffe, die gut mit {name} kombinieren — und warum.',
  },
  productDetail: {
    chips: {
      editorPick: 'Empfehlung der Redaktion',
      caffeineFree: 'Koffeinfrei',
      hasCaffeine: 'Koffeinhaltig',
      allClinicalDoses: 'Alle klinischen Dosen',
      handsOnTested: 'Praxistest absolviert',
      npnLicensed: 'Health-Canada-NPN',
      personalImport: 'Privatimport',
      ffcNotified: 'FFC-notifiziert',
      austListed: 'AUST L',
      halalCertified: 'Halal-zertifiziert',
    },
    meta: {
      by: 'Von',
      productDescriptor: 'tägliche Nootropika-Kapsel',
      countSuffix: 'Stück',
      updated: 'Aktualisiert',
    },
    dateLocale: 'de-DE',
    score: {
      label: 'Unsere Bewertung',
      outOf10: 'von 10,0',
    },
    stats: {
      price: 'Preis',
      perMonth: '/Monat',
      capsules: 'Kapseln',
      perDay: '/Tag',
      moneyBack: 'Geld-zurück',
      days: 'Tage',
      trustpilot: 'Trustpilot',
      notAvailable: 'k. A.',
      ourCut: 'Unsere Provision',
    },
    visitBrand: 'Zur Marke →',
    tabs: {
      overview: 'Übersicht',
      dosing: 'Dosierungsprüfung',
      pillars: 'Säulen',
      reviews: 'Bewertungen',
      pricing: 'Preise',
      ariaLabel: 'Produktbereiche',
    },
    alternatives: 'Ähnliche Alternativen',
    healthDisclaimerHeading: 'Gesundheitshinweis',
    chipGroupLabel: 'Produktmerkmale',
  },
};

// Quebec French (fr-CA). Generated by /tmp/translate-frca-uistrings.mts (Claude
// Sonnet 4.6, 2026-05-28). OQLF-compliant: "témoins" not "cookies", "RGPD" not
// "GDPR", "Santé Canada" not "Health Canada", "courriel" not "e-mail".
// `dateLocale: 'fr-CA'` carries the BCP-47 code for Intl.DateTimeFormat.
// Native-speaker review recommended before final ship.
const frCa: UIStrings = {
  nav: {
    bestNootropics: 'Meilleurs Nootropiques',
    compare: 'Comparer',
    ingredients: 'Ingrédients',
    guides: 'Guides',
    methodology: 'Méthodologie',
    about: 'À propos',
    topPicks: 'Nos coups de cœur',
    search: 'Rechercher',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    primaryLandmark: 'Navigation principale',
    openComparator: 'Ouvrir le comparateur →',
    skipToContent: 'Aller au contenu principal',
  },
  footer: {
    tagline:
      "Nous vérifions chaque nootropique selon les doses des essais cliniques. Les commissions d'affiliation sont divulguées en ligne et n'influencent pas les notes.",
    copyrightLine:
      "© {year} Nootropic Lab · L'information ne constitue pas un avis médical. Consultez un professionnel de la santé avant de prendre tout supplément.",
    lastAuditLabel: 'Dernière vérification complète :',
    methodologyLabel: 'Méthodologie',
    bestByGoal: {
      heading: 'Meilleurs par objectif',
      focus: 'Pour la concentration',
      memory: 'Pour la mémoire',
      adhd: 'Pour le TDAH',
      aging: 'Pour le vieillissement',
      energy: "Pour l'énergie",
      mood: "Pour l'humeur",
      studying: "Pour l'étude",
    },
    headToHead: {
      heading: 'Face-à-face',
      allComparisons: 'Toutes les comparaisons →',
    },
    byRegion: {
      heading: 'Par région',
      us: 'États-Unis',
      eu: 'Union européenne',
      ca: 'Canada',
      au: 'Australie',
      jp: 'Japon',
      latam: 'Amérique latine',
    },
    about: {
      heading: 'À propos',
      methodology: 'Méthodologie',
      disclosures: 'Divulgations',
      privacy: 'Confidentialité',
      cookies: 'Témoins',
      imprint: 'Mentions légales',
      contact: 'Contact',
    },
  },
  cookie: {
    message: 'Nous utilisons des témoins d\'analyse pour améliorer votre expérience. Nous n\'utilisons pas de témoins publicitaires.',
    gdprNote: 'RGPD : Les analyses ne sont activées qu\'après votre consentement. Les témoins nécessaires sont toujours actifs.',
    accept: 'Accepter les témoins d\'analyse',
    decline: 'Refuser',
    privacyPolicy: 'politique de confidentialité',
  },
  disclosure: {
    text: 'Divulgation de liens affiliés : Cette page contient des liens affiliés. Si vous effectuez un achat par l\'entremise de nos liens, nous pouvons toucher une commission sans frais supplémentaires pour vous. Nos opinions éditoriales sont indépendantes — nous recommandons uniquement des produits que nous avons évalués de façon indépendante.',
    methodology: 'Lire notre méthodologie',
  },
  table: {
    product: 'Produit',
    bestFor: 'Idéal pour',
    score: 'Score',
    priceMo: 'Prix/mois',
    caffeineFree: 'Sans caféine',
    euStatus: 'Statut UE',
    moneyBack: 'Remboursement',
    trustpilot: 'Trustpilot',
    checkPrice: 'Vérifier le prix →',
    noResults: 'Aucun produit ne correspond à vos filtres. Essayez d\'en retirer un.',
    yes: 'Oui',
    no: 'Non',
    na: 'S.O.',
    sortBy: 'Trier par',
    ascending: 'croissant',
    descending: 'décroissant',
  },
  breadcrumb: {
    home: 'Accueil',
    ingredients: 'Ingrédients',
    backToBestNootropics: '← Retour aux meilleurs nootropiques',
    backToIngredientsGuide: '← Retour au guide des ingrédients',
  },
  ingredientDetail: {
    chips: { clinicalDose: 'Dose clinique', onset: 'Délai d\'action' },
    sections: {
      mechanism: 'Mécanisme d\'action',
      evidence: 'Résumé des données cliniques',
      effects: 'Matrice des effets chez l\'humain',
      benefits: 'Bienfaits documentés',
      sideEffects: 'Effets secondaires et mises en garde',
      howTo: 'Mode d\'utilisation',
      stacking: 'Recommandations de combinaison',
      faq: 'Questions fréquemment posées',
      related: 'Ingrédients connexes',
    },
    toc: {
      mechanism: 'Mécanisme',
      evidence: 'Données cliniques',
      effects: 'Matrice des effets',
      benefits: 'Bienfaits et effets secondaires',
      howTo: 'Mode d\'utilisation',
      stacking: 'Combinaison',
      faq: 'FAQ',
      products: 'Produits qui en contiennent',
      related: 'Ingrédients connexes',
    },
    table: {
      effect: 'Effet',
      evidence: 'Preuves',
      magnitude: 'Ampleur',
      studies: 'Études',
      notes: 'Notes',
    },
    magnitude: { large: 'Importante', moderate: 'Modérée', small: 'Faible', negligible: 'Négligeable' },
    category: {
      adaptogen: 'Adaptogène',
      cholinergic: 'Cholinergique',
      mushroom: 'Champignon',
      amino: 'Acide aminé',
      herb: 'Plante médicinale',
      vitamin: 'Vitamine',
    },
    sidebar: {
      quickFacts: 'Faits rapides',
      onThisPage: 'Sur cette page',
      category: 'Catégorie',
      dose: 'Dose',
      onset: 'Délai d\'action',
      trials: 'Essais cliniques',
    },
    stackingLede: 'Ingrédients qui se combinent bien avec {name} et les raisons pour lesquelles.',
  },
  productDetail: {
    chips: {
      editorPick: 'Choix de la rédaction',
      caffeineFree: 'Sans caféine',
      hasCaffeine: 'Caféine',
      allClinicalDoses: 'Toutes les doses cliniques',
      handsOnTested: 'Testé en pratique',
      npnLicensed: 'NPN Santé Canada',
      personalImport: 'Importation personnelle',
      ffcNotified: 'Notifié FFC',
      austListed: 'AUST L',
      halalCertified: 'Certifié halal',
    },
    meta: {
      by: 'Par',
      productDescriptor: 'capsule nootropique quotidienne',
      countSuffix: 'gél.',
      updated: 'Mis à jour',
    },
    dateLocale: 'fr-CA',
    score: { label: 'Notre score', outOf10: 'sur 10,0' },
    stats: {
      price: 'Prix',
      perMonth: '/mois',
      capsules: 'Gélules',
      perDay: '/jour',
      moneyBack: 'Remboursement',
      days: 'jours',
      trustpilot: 'Trustpilot',
      notAvailable: 'S.O.',
      ourCut: 'Notre commission',
    },
    visitBrand: 'Visiter la marque →',
    tabs: {
      overview: 'Aperçu',
      dosing: 'Vérification des doses',
      pillars: 'Piliers',
      reviews: 'Évaluations',
      pricing: 'Tarification',
      ariaLabel: 'Sections du produit',
    },
    alternatives: 'Alternatives similaires',
    healthDisclaimerHeading: 'Avis de santé',
    chipGroupLabel: 'Caractéristiques du produit',
  },
};

const translations: Record<Locale, UIStrings> = { en, es, fr, ja, pt, de, 'fr-CA': frCa };

export function getStrings(locale: Locale): UIStrings {
  return translations[locale] || translations.en;
}

export function getLocaleForMarket(market: string): Locale {
  switch (market) {
    case 'latam': return 'es';
    case 'jp': return 'ja';
    default: return 'en';
  }
}
