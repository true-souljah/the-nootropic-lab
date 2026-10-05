export interface LatamCountry {
  code: string;       // 2-letter ISO
  name: string;
  slug: string;
  currency: string;   // e.g. 'MXN'
  language: string;   // primary language
  shippingNote: string;
  /** Spanish; every figure carries "(fuente: <domain>, consultado <date>)". */
  customsNote: string;
  /** Official pages the customsNote figures were confirmed against. */
  customsSources: { label: string; url: string }[];
  popularBrands: string[];  // 2-3 brand names popular there
}

export const latamCountries: LatamCountry[] = [
  {
    code: 'MX',
    name: 'Mexico',
    slug: 'mexico',
    currency: 'MXN',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Mexico as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Según la Agencia Nacional de Aduanas de México (ANAM), los envíos por mensajería con valor en aduana de hasta USD 2,500 por destinatario pueden usar el procedimiento simplificado, cuya tasa global general es del 33.5% (fuente: anam.gob.mx, consultado 2026-10-05). Solo para envíos procedentes de un país del Tratado entre México, Estados Unidos y Canadá (T-MEC), y siempre que la mercancía no esté sujeta a regulaciones y restricciones no arancelarias, hasta USD 50 se despacha sin Impuesto General de Importación (IGI) ni impuesto al valor agregado (IVA) pagando la cuota del Derecho de Trámite Aduanero (DTA), de USD 50 a USD 117 se aplica una tasa global del 17% y por encima de USD 117 una del 19% (fuente: anam.gob.mx, consultado 2026-10-05). La ANAM no indica si los suplementos alimenticios están sujetos a esas restricciones no arancelarias, así que no confirmamos que califiquen para los tramos del T-MEC; confírmalo con la aduana o la marca antes de comprar. La Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) define los suplementos alimenticios como productos cuya finalidad es incrementar, complementar o suplir la ingesta dietética, conforme al artículo 215, fracción V, de la Ley General de Salud (fuente: gob.mx/cofepris, consultado 2026-10-05).',
    customsSources: [
      { label: 'ANAM: Mensajería y paquetería (procedimiento simplificado y tramos del T-MEC)', url: 'https://www.anam.gob.mx/mensajeria-y-paqueteria/' },
      { label: 'COFEPRIS: Suplementos alimenticios', url: 'https://www.gob.mx/cofepris/acciones-y-programas/suplementos-alimenticios-62063' },
    ],
    popularBrands: ['Mind Lab Pro', 'Alpha Brain', 'Nootropics Depot'],
  },
  {
    code: 'BR',
    name: 'Brazil',
    slug: 'brazil',
    currency: 'BRL',
    language: 'Portuguese',
    shippingNote: 'International supplement parcels enter Brazil as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Las fuentes oficiales no coinciden: la Receita Federal indica para compras en sitios del programa Remessa Conforme un impuesto de importación del 0% hasta USD 50 y del 60% menos un descuento de USD 30 por encima de ese valor (fuente: gov.br/receitafederal, consultado 2026-10-05), mientras que la tabla de Correios para compras desde el 01/08/2024 indica 20% hasta USD 50 y 60% menos USD 20 entre USD 50,01 y USD 3.000 (fuente: correios.com.br, consultado 2026-10-05); confirma la tasa aplicable al momento de la compra. Además se paga siempre el Imposto sobre Circulação de Mercadorias e Serviços (ICMS), cuya alícuota varía según el estado entre el 17% y el 20% (fuente: gov.br/receitafederal, consultado 2026-10-05). La Receita aclara que los suplementos no entran en la exención para medicamentos y tributan normalmente (fuente: gov.br/receitafederal, consultado 2026-10-05). La Agência Nacional de Vigilância Sanitária (ANVISA) define el suplemento alimentar en la Resolução da Diretoria Colegiada (RDC) 243/2018 como un producto de ingestión oral destinado a complementar la alimentación de personas sanas (fuente: bvsms.saude.gov.br, consultado 2026-10-05).',
    customsSources: [
      { label: 'Receita Federal: Quanto pagarei de imposto', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/preciso-pagar-impostos-nas-compras-internacionais/quanto-pagarei-de-imposto' },
      { label: 'Receita Federal: Programa Remessa Conforme', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/programa-remessa-conforme-o-que-e-como-funciona' },
      { label: 'Receita Federal: Como importar medicamentos', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/como-importar-medicamentos/como-importar-medicamentos' },
      { label: 'Correios: Novas regras de declarações de importações de remessas', url: 'https://www.correios.com.br/central-de-informacoes/boletim-aos-clientes/novas-regras-declaracoes-de-importacoes-de-remessas' },
      { label: 'ANVISA: RDC 243/2018 (suplementos alimentares)', url: 'https://bvsms.saude.gov.br/bvs/saudelegis/anvisa/2018/rdc0243_26_07_2018.pdf' },
    ],
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Qualia Mind'],
  },
  {
    code: 'AR',
    name: 'Argentina',
    slug: 'argentina',
    currency: 'ARS',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Argentina as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout. Currency controls and economic volatility may affect payment processing with international merchants.',
    customsNote: 'Según la Agencia de Recaudación y Control Aduanero (ARCA), en el régimen courier de pequeños envíos cada envío puede valer hasta USD 3.000, y los primeros 5 envíos del año de hasta USD 400 FOB (Free On Board) cada uno están exentos de derechos de importación y de la tasa de estadística, aunque se paga el impuesto al valor agregado (IVA) e impuestos internos si corresponde (fuente: afip.gob.ar, consultado 2026-10-05). Para recibir suplementos dietarios por correo postal, ARCA exige autorización previa de la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica (ANMAT) (fuente: afip.gob.ar, consultado 2026-10-05). ARCA remite además a la Disposición N° 537/2025 de la ANMAT para las intervenciones sobre envíos postales (fuente: afip.gob.ar, consultado 2026-10-05); no verificamos su contenido, así que confírmalo con ARCA o la ANMAT antes de comprar. No encontramos en las páginas de ARCA un límite de cantidad específico para suplementos. El Código Alimentario Argentino (artículo 1381) define los suplementos dietarios como productos destinados a incrementar la ingesta dietaria habitual de personas sanas (fuente: servicios.infoleg.gob.ar, consultado 2026-10-05).',
    customsSources: [
      { label: 'ARCA: Pequeños envíos (courier)', url: 'https://www.afip.gob.ar/envios-internacionales/courier/importacion/pequenios-envios.asp' },
      { label: 'ARCA: Puerta a Puerta, montos y franquicia', url: 'https://www.afip.gob.ar/envios-internacionales/puerta-a-puerta/monto.asp' },
      { label: 'ARCA: Puerta a Puerta, medicamentos y suplementos dietarios', url: 'https://www.afip.gob.ar/envios-internacionales/puerta-a-puerta/medicamentos.asp' },
      { label: 'ARCA: Puerta a Puerta, intervenciones (Disposición ANMAT N° 537/2025)', url: 'https://www.afip.gob.ar/envios-internacionales/puerta-a-puerta/intervenciones.asp' },
      { label: 'Código Alimentario Argentino, artículo 1381 (InfoLEG)', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/50000-54999/50664/norma.htm' },
    ],
    popularBrands: ['Mind Lab Pro', 'Alpha Brain', 'NooCube'],
  },
  {
    code: 'CO',
    name: 'Colombia',
    slug: 'colombia',
    currency: 'COP',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Colombia as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Según la Dirección de Impuestos y Aduanas Nacionales (DIAN), los envíos por tráfico postal y envíos urgentes pagan un arancel del 10% sobre el valor FOB (Free On Board), incluidos fletes y seguros, más el 19% de impuesto al valor agregado (IVA), y su valor no debe exceder USD 2.000 (fuente: dian.gov.co, consultado 2026-10-05). Si el valor FOB es de USD 200 o menos no se paga arancel, pero el IVA solo se exime cuando el envío procede de un país con el que Colombia tenga un tratado de libre comercio que así lo disponga (fuente: dian.gov.co, consultado 2026-10-05). Las mercancías con restricciones legales y administrativas, como medicamentos, alimentos o productos bajo regulación del Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA), pueden ingresar hasta 6 unidades cumpliendo esas condiciones; la DIAN no menciona los suplementos de forma expresa (fuente: dian.gov.co, consultado 2026-10-05). El Decreto 3249 de 2006, en la compilación normativa del INVIMA, define el suplemento dietario como un producto cuyo propósito es adicionar la dieta normal y que es fuente concentrada de nutrientes; no confirmamos su vigencia actual (fuente: normograma.invima.gov.co, consultado 2026-10-05).',
    customsSources: [
      { label: 'DIAN: Modalidad de tráfico postal y envíos urgentes', url: 'https://www.dian.gov.co/Viajeros-y-Servicios-aduaneros/Paginas/Modalidad-de-trafico-postal-y-envios-urgentes.aspx' },
      { label: 'INVIMA: Decreto 3249 de 2006 (compilación normativa)', url: 'https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm' },
    ],
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
  {
    code: 'CL',
    name: 'Chile',
    slug: 'chile',
    currency: 'CLP',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Chile as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Según un comunicado del Servicio Nacional de Aduanas del 15 de octubre de 2025, desde el 25 de octubre de 2025 se eliminó la franquicia que permitía ingresar compras menores a USD 41 sin impuestos (fuente: aduana.cl, consultado 2026-10-05). Desde esa fecha, las compras online en el extranjero de hasta USD 500 incluyen el impuesto al valor agregado (IVA) del 19% en el precio cuando la plataforma está inscrita en el Servicio de Impuestos Internos (SII); si no lo está, el IVA se cobra al ingreso (fuente: aduana.cl, consultado 2026-10-05). Aduanas sigue revisando los envíos y exige los permisos correspondientes para productos como medicamentos y cosméticos (fuente: aduana.cl, consultado 2026-10-05); el comunicado no menciona los suplementos y no pudimos verificar en una página oficial posterior que estas reglas sigan vigentes, así que confírmalo antes de comprar. La página del regulador sanitario chileno sobre suplementos no fue confirmada en nuestra revisión del 2026-10-05.',
    customsSources: [
      { label: 'Aduanas de Chile: Cambios en tus compras internacionales (comunicado del 15/10/2025)', url: 'https://www.aduana.cl/cambios-en-tus-compras-internacionales/aduana/2025-10-15/153938.html' },
    ],
    popularBrands: ['Mind Lab Pro', 'Nootropics Depot', 'Alpha Brain'],
  },
  {
    code: 'PE',
    name: 'Peru',
    slug: 'peru',
    currency: 'PEN',
    language: 'Spanish',
    shippingNote: 'International supplement parcels enter Peru as personal-use imports. Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
    customsNote: 'Según la Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT), en su servicio Importa Fácil por vía postal (Serpost) los envíos con valor de hasta USD 200 no requieren trámite aduanero ni pagan tributos a la importación; la regla excluye las mercancías restringidas y no se aplica cuando varios envíos a un mismo destinatario superan en conjunto USD 200 (fuente: sunat.gob.pe, consultado 2026-10-05). La misma página exige permiso de la Dirección General de Medicamentos, Insumos y Drogas (DIGEMID) para medicinas y vitaminas (fuente: sunat.gob.pe, consultado 2026-10-05). Para envíos por courier no confirmamos las reglas en una página oficial, así que confírmalas con la aduana o la marca antes de comprar. La DIGEMID define el producto dietético como aquel cuyo propósito es complementar la dieta normal con fuentes concentradas de nutrientes o de otras sustancias con efecto nutricional o fisiológico (fuente: digemid.minsa.gob.pe, consultado 2026-10-05).',
    customsSources: [
      { label: 'SUNAT: Importa Fácil (envíos postales por Serpost)', url: 'https://www.sunat.gob.pe/orientacionaduanera/importaFacil/index.html' },
      { label: 'DIGEMID: Registro sanitario de producto dietético y edulcorante', url: 'https://www.digemid.minsa.gob.pe/webDigemid/registro-sanitario/producto-dietetico-y-edulcorante/' },
    ],
    popularBrands: ['Mind Lab Pro', 'NooCube', 'Alpha Brain'],
  },
];
