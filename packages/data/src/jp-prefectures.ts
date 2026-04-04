export interface JPPrefecture {
  slug: string;
  name: string;
  nameJa: string;
  note: string;
}

export const jpPrefectures: JPPrefecture[] = [
  { slug: 'tokyo', name: 'Tokyo', nameJa: '東京都', note: 'Tokyo is Japan\'s largest supplement market. International orders typically arrive in 7-10 business days from the UK/US. Customs clearance at Narita/Haneda Airport is efficient for personal import orders.' },
  { slug: 'osaka', name: 'Osaka', nameJa: '大阪府', note: 'Osaka (Kansai region) receives international shipments in 7-10 business days. Kansai Airport handles a high volume of international personal import parcels.' },
  { slug: 'kanagawa', name: 'Kanagawa', nameJa: '神奈川県', note: 'Kanagawa (Yokohama area) receives international orders through Narita/Haneda in 7-10 business days.' },
  { slug: 'aichi', name: 'Aichi', nameJa: '愛知県', note: 'Aichi (Nagoya area) receives international shipments in 8-12 business days.' },
  { slug: 'saitama', name: 'Saitama', nameJa: '埼玉県', note: 'Saitama is close to Tokyo and receives international shipments in 7-10 business days.' },
  { slug: 'chiba', name: 'Chiba', nameJa: '千葉県', note: 'Chiba hosts Narita Airport — making it one of Japan\'s fastest delivery regions for international orders (6-9 business days).' },
  { slug: 'hokkaido', name: 'Hokkaido', nameJa: '北海道', note: 'Hokkaido may add 1-2 extra days for domestic forwarding after Tokyo customs clearance — expect 9-13 business days total for international orders.' },
  { slug: 'fukuoka', name: 'Fukuoka', nameJa: '福岡県', note: 'Fukuoka (Kyushu region) receives international shipments in 8-12 business days.' },
];
