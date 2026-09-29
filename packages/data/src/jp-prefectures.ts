export interface JPPrefecture {
  slug: string;
  name: string;
  nameJa: string;
  note: string;
}

export const jpPrefectures: JPPrefecture[] = [
  { slug: 'tokyo', name: 'Tokyo', nameJa: '東京都', note: 'Tokyo is Japan\'s largest supplement market. Delivery estimates vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'osaka', name: 'Osaka', nameJa: '大阪府', note: 'Delivery estimates to Osaka (Kansai region) vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'kanagawa', name: 'Kanagawa', nameJa: '神奈川県', note: 'Delivery estimates to Kanagawa (Yokohama area) vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'aichi', name: 'Aichi', nameJa: '愛知県', note: 'Delivery estimates to Aichi (Nagoya area) vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'saitama', name: 'Saitama', nameJa: '埼玉県', note: 'Saitama is close to Tokyo. Delivery estimates vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'chiba', name: 'Chiba', nameJa: '千葉県', note: 'Chiba hosts Narita Airport. Delivery estimates vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'hokkaido', name: 'Hokkaido', nameJa: '北海道', note: 'Delivery estimates to Hokkaido vary by brand and carrier, so check the estimate at checkout.' },
  { slug: 'fukuoka', name: 'Fukuoka', nameJa: '福岡県', note: 'Delivery estimates to Fukuoka (Kyushu region) vary by brand and carrier, so check the estimate at checkout.' },
];
