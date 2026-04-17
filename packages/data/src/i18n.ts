export type Locale = 'en' | 'es' | 'fr' | 'ja' | 'pt';

export interface UIStrings {
  nav: {
    bestNootropics: string;
    compare: string;
    ingredients: string;
    guides: string;
    methodology: string;
    topPicks: string;
    search: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    brand: string;
    tagline: string;
    reviews: string;
    learn: string;
    legal: string;
    whatAreNootropics: string;
    howToStack: string;
    privacyPolicy: string;
    cookiePolicy: string;
    healthDisclaimer: string;
    copyright: string;
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
}

const en: UIStrings = {
  nav: {
    bestNootropics: 'Best Nootropics',
    compare: 'Compare',
    ingredients: 'Ingredients',
    guides: 'Guides',
    methodology: 'Methodology',
    topPicks: 'Top Picks',
    search: 'Search',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  footer: {
    brand: 'The Nootropic Lab',
    tagline: 'Independent cognitive supplement reviews. Evidence-graded. Affiliate-disclosed.',
    reviews: 'Reviews',
    learn: 'Learn',
    legal: 'Legal',
    whatAreNootropics: 'What Are Nootropics?',
    howToStack: 'How to Stack',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    healthDisclaimer: 'Health Disclaimer: The information on this website is for educational purposes only and is not intended as medical advice. Nootropic supplements are not approved by the FDA to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any supplement regimen, especially if you are pregnant, nursing, taking medication, or have a medical condition. Individual results may vary.',
    copyright: 'All rights reserved. This site contains affiliate links. We earn a commission if you purchase through our links. Our editorial reviews are independent and not influenced by affiliate relationships.',
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
};

const es: UIStrings = {
  nav: {
    bestNootropics: 'Los Mejores',
    compare: 'Comparar',
    ingredients: 'Ingredientes',
    guides: 'Guías',
    methodology: 'Metodología',
    topPicks: 'Mejores Opciones',
    search: 'Buscar',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
  footer: {
    brand: 'The Nootropic Lab',
    tagline: 'Reseñas independientes de suplementos cognitivos. Basadas en evidencia. Afiliados divulgados.',
    reviews: 'Reseñas',
    learn: 'Aprender',
    legal: 'Legal',
    whatAreNootropics: '¿Qué son los nootrópicos?',
    howToStack: 'Cómo combinar',
    privacyPolicy: 'Política de Privacidad',
    cookiePolicy: 'Política de Cookies',
    healthDisclaimer: 'Aviso de salud: La información en este sitio web es solo con fines educativos y no pretende ser un consejo médico. Los suplementos nootrópicos no están aprobados por la FDA para diagnosticar, tratar, curar o prevenir ninguna enfermedad. Siempre consulte a un profesional de la salud calificado antes de comenzar cualquier régimen de suplementos, especialmente si está embarazada, amamantando, tomando medicamentos o tiene una condición médica. Los resultados individuales pueden variar.',
    copyright: 'Todos los derechos reservados. Este sitio contiene enlaces de afiliados. Ganamos una comisión si compra a través de nuestros enlaces. Nuestras reseñas editoriales son independientes y no están influenciadas por relaciones de afiliados.',
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
};

const fr: UIStrings = {
  nav: {
    bestNootropics: 'Les Meilleurs',
    compare: 'Comparer',
    ingredients: 'Ingrédients',
    guides: 'Guides',
    methodology: 'Méthodologie',
    topPicks: 'Nos Choix',
    search: 'Rechercher',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  footer: {
    brand: 'The Nootropic Lab',
    tagline: 'Avis indépendants sur les suppléments cognitifs. Basés sur des preuves. Affiliations divulguées.',
    reviews: 'Avis',
    learn: 'Apprendre',
    legal: 'Mentions légales',
    whatAreNootropics: 'Que sont les nootropiques?',
    howToStack: 'Comment combiner',
    privacyPolicy: 'Politique de confidentialité',
    cookiePolicy: 'Politique de cookies',
    healthDisclaimer: 'Avis de santé : Les informations sur ce site sont à des fins éducatives uniquement et ne constituent pas un avis médical. Les suppléments nootropiques ne sont pas approuvés par la FDA pour diagnostiquer, traiter, guérir ou prévenir une maladie. Consultez toujours un professionnel de la santé qualifié avant de commencer tout régime de suppléments. Les résultats individuels peuvent varier.',
    copyright: 'Tous droits réservés. Ce site contient des liens affiliés. Nous gagnons une commission si vous achetez via nos liens. Nos avis éditoriaux sont indépendants.',
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
};

const ja: UIStrings = {
  nav: {
    bestNootropics: 'ベスト',
    compare: '比較',
    ingredients: '成分',
    guides: 'ガイド',
    methodology: '評価方法',
    topPicks: 'おすすめ',
    search: '検索',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
  },
  footer: {
    brand: 'The Nootropic Lab',
    tagline: '独立系認知機能サプリメントレビュー。エビデンスに基づく評価。アフィリエイト開示済み。',
    reviews: 'レビュー',
    learn: '学ぶ',
    legal: '法的情報',
    whatAreNootropics: 'ノートロピクスとは？',
    howToStack: '組み合わせ方',
    privacyPolicy: 'プライバシーポリシー',
    cookiePolicy: 'Cookieポリシー',
    healthDisclaimer: '健康に関する免責事項：このウェブサイトの情報は教育目的のみであり、医学的アドバイスを意図するものではありません。ノートロピクスサプリメントは、疾病の診断、治療、治癒、予防のためにFDAによって承認されていません。サプリメントを開始する前に、必ず資格のある医療専門家にご相談ください。個人の結果は異なる場合があります。',
    copyright: '全著作権所有。このサイトにはアフィリエイトリンクが含まれています。当社のリンクを通じて購入された場合、コミッションを受け取ります。編集レビューは独立しており、アフィリエイト関係の影響を受けません。',
  },
  cookie: {
    message: '体験向上のために分析Cookieを使用しています。広告Cookieは使用していません。',
    gdprNote: 'GDPR：分析は同意後にのみ有効になります。必要なCookieは常にアクティブです。',
    accept: '分析を許可',
    decline: '拒否',
    privacyPolicy: 'プライバシーポリシー',
  },
  disclosure: {
    text: 'アフィリエイト開示：このページにはアフィリエイトリンクが含まれています。当社のリンクを通じて購入された場合、追加費用なしでコミッションを受け取る場合があります。編集意見は独立しており、独自に調査した製品のみを推奨しています。',
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
};

const pt: UIStrings = {
  nav: {
    bestNootropics: 'Os Melhores',
    compare: 'Comparar',
    ingredients: 'Ingredientes',
    guides: 'Guias',
    methodology: 'Metodologia',
    topPicks: 'Melhores Escolhas',
    search: 'Pesquisar',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
  },
  footer: {
    brand: 'The Nootropic Lab',
    tagline: 'Análises independentes de suplementos cognitivos. Baseadas em evidências. Afiliações divulgadas.',
    reviews: 'Análises',
    learn: 'Aprender',
    legal: 'Legal',
    whatAreNootropics: 'O que são nootrópicos?',
    howToStack: 'Como combinar',
    privacyPolicy: 'Política de Privacidade',
    cookiePolicy: 'Política de Cookies',
    healthDisclaimer: 'Aviso de saúde: As informações neste website são apenas para fins educativos e não pretendem constituir aconselhamento médico. Os suplementos nootrópicos não são aprovados pela FDA para diagnosticar, tratar, curar ou prevenir qualquer doença. Consulte sempre um profissional de saúde qualificado antes de iniciar qualquer regime de suplementos. Os resultados individuais podem variar.',
    copyright: 'Todos os direitos reservados. Este site contém links de afiliados. Ganhamos uma comissão se comprar através dos nossos links. As nossas análises editoriais são independentes.',
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
};

const translations: Record<Locale, UIStrings> = { en, es, fr, ja, pt };

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
