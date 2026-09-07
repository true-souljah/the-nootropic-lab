import type { RegionalNotes } from '../regional';

// Authored regional notes for JP (PR B, 2026-09). Every entry cites the
// primary source it was checked against; `quote` is the verbatim passage that
// supports the entry and is re-checked mechanically before changes ship.
// Generated from the reviewed draft by scratchpad/gen-notes.py — edit the facts,
// keep the shape.

export const regionalNotesJP: RegionalNotes = {
  guides: {
    "what-are-nootropics":
    {
      summary: "Nootropics sold or imported into Japan fall under two very different legal tracks. A product the maker has notified to the Consumer Affairs Agency (CAA) as a Food with Function Claims (FFC), or one approved as a Food for Specified Health Use (FOSHU, widely called Tokuho), may state a specific function on its label; a third category, Foods with Nutrient Function Claims (栄養機能食品), covers standardised claims for specified nutrients only. A product with neither a notification nor an approval behind it — which is the position of an imported stack brought in through personal import — has no route to state a memory, focus or brain-function claim on its label. The CAA does not independently test an FFC product's evidence; it reviews the notification, and the notifying business carries responsibility for the science behind the claim.",
      sections: [
        { heading: "A notification system, not a government approval", content: "The CAA explains the Foods with Function Claims system in its own words: a business can display a functionality claim if it notifies the Commissioner of the Consumer Affairs Agency of the necessary matters, such as scientific evidence on the safety and function of the food, before sale (our translation), based on rules the government sets. Crucially, the same CAA page states that unlike FOSHU, the government does not conduct an examination (our translation), so the notifying business must, at its own responsibility, provide appropriate labeling grounded in scientific evidence. A notification is a filing, not a stamp of government-verified efficacy." },
        { heading: "Why an unnotified imported stack cannot make claims", content: "Japan's health-food guidance from the Ministry of Health, Labour and Welfare (MHLW) is direct about products outside this notified or approved system: even without an added pharmaceutical ingredient, a food carrying wording like \"effective against ○○\" or \"cures △△\" is described as a drug-like label or expression, and MHLW states this also violates the Pharmaceutical Affairs Act (our translation). A nootropic stack imported for personal use, with no CAA notification behind it, sits in this unclaimable category — it can be sold or used as a food, but the label cannot legally describe a cognitive effect." },
      ],
      faqs: [
        { question: "Does \"機能性表示食品\" (Foods with Function Claims) on a Japanese label mean the government verified the product works?", answer: "No. The CAA's own description of the system says a business may display a function claim once it notifies the Commissioner of the Consumer Affairs Agency of its supporting evidence before sale (our translation), and explicitly notes that, unlike FOSHU/Tokuho, the government does not conduct an examination (our translation) The filing is reviewed for completeness, not independently tested by the CAA." },
        { question: "Can an imported nootropic supplement legally say it improves memory in Japan?", answer: "Only if it has gone through CAA notification (FFC) or FOSHU approval. MHLW's health-food guidance states that a food using \"drug-like\" wording such as claiming a product is effective against or cures a condition violates the Pharmaceutical Affairs Act (our translation) even when no pharmaceutical ingredient is present — a rule that applies squarely to unnotified imported stacks." },
        { question: "What's the difference between FOSHU (Tokuho) and Foods with Function Claims?", answer: "Per the CAA, FOSHU involves government examination of the individual product, while under the FFC system the government does not conduct an examination (our translation) — the business notifies the CAA of its own evidence and takes responsibility for the label's accuracy. Both are legal categories distinct from an ordinary, unnotified imported supplement." },
      ],
      sources: [
        { label: "Consumer Affairs Agency (CAA) — 機能性表示食品について (About Foods with Function Claims)", url: "https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/", quote: "機能性表示食品制度とは、国の定めるルールに基づき、事業者が食品の安全性と機能性に関する科学的根拠などの必要な事項を、販売前に消費者庁長官に届け出れば、機能性を表示することができる制度です。 特定保健用食品(トクホ)と異なり、国が審査を行いませんので、事業者は自らの責任において、科学的根拠を基に適正な表示を行う必要があります。" },
        { label: "MHLW / National Institute of Health and Nutrition — 健康食品の正しい利用法 (Correct Use of Health Foods)", url: "https://www.mhlw.go.jp/topics/bukyoku/iyaku/syoku-anzen/dl/kenkou_shokuhin00.pdf", quote: "また、薬の成分が添加されていなくても「○○に効く」「△△が治る」など、「薬のような表示・表現」をしているものも薬事法に違反します" },
        { label: "CAA — food labelling categories (栄養機能食品 / 機能性表示食品 / 特定保健用食品)", url: "https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/", quote: "栄養機能食品について 機能性表示食品について 特定保健用食品について" },
      ],
    },
    "how-to-stack-nootropics":
    {
      summary: "Building a stack from products bought outside Japan runs into two separate MHLW rules. First, an individual may bring in a personal-use quantity of medication-type goods without a license — MHLW's guidance sets this at up to two months' supply for a drug or quasi-drug and up to four months for a vitamin-type product. Second, MHLW separately lists specific ingredients common in nootropic stacks — including piracetam, aniracetam, oxiracetam, vinpocetine and DHEA — that require an advance import confirmation regardless of quantity, because of health-harm or misuse concerns when self-administered without a doctor.",
      sections: [
        { heading: "The personal-use quantity allowance", content: "MHLW's guidance on bringing medication into Japan states plainly: \"There is no need for a License for individual's importing or bringing medication into Japan for personal use. An individual can import the following restricted quantities of medication without special procedures.\" The listed allowances include a drug or quasi-drug at up to two months' supply and a vitamin-type product at up to four months' supply. The same guidance adds that anything imported this way \"must not be sold or given to others\" — it covers a stack for one person's own use only." },
        { heading: "Racetams and related ingredients need advance confirmation", content: "A separate MHLW notice on personal imports of products claiming to enhance brain function found that many overseas medicines and supplements marketed this way contained ingredients used in prescription drugs. It lists named substances — among them piracetam, aniracetam, oxiracetam, nefiracetam, pramiracetam, levetiracetam, vinpocetine, adrafinil and DHEA — and states that when a product sold overseas contains one of these, obtaining an import confirmation (輸入確認証) in advance is required regardless of quantity (数量に関わらず), with one stated exception: a person entering Japan who carries the product for their own treatment during their stay (海外からの入国者が国内滞在中の自己の治療のために携帯して輸入する場合を除いて) before it may be personally imported at all." },
      ],
      faqs: [
        { question: "How much of a nootropic supplement can I personally import into Japan without a license?", answer: "MHLW's guidance sets the general allowance at \"Up to 2 months' supply\" for a drug or quasi-drug-type product and \"Up to 4 months' supply\" for a vitamin-type product, without needing special import procedures — but this general allowance does not apply to the specific ingredients MHLW separately restricts (see below)." },
        { question: "Can I bring piracetam, aniracetam, or vinpocetine into Japan as part of a personal stack?", answer: "MHLW's 2018 notice (revised 2020) on brain-function-enhancement products names these among substances requiring an import confirmation certificate before entry regardless of quantity (the only stated exception is a traveller carrying the product for their own treatment during their stay), because unsupervised self-use of them was judged to carry a real risk of health harm or misuse without a doctor's prescription or instruction." },
        { question: "Is an imported nootropic stack covered if it causes a health problem?", answer: "No. MHLW's health-food guidance notes that medication personally imported from overseas is excluded from Japan's Adverse Drug Reaction Relief System, the state fund that covers medical costs for people harmed despite proper use of a domestically supplied medicine — a gap worth weighing before importing a multi-ingredient stack." },
      ],
      sources: [
        { label: "MHLW — Importing or Bringing Medication into Japan for Personal Use", url: "https://www.mhlw.go.jp/www1/english/importing/e0813-1.html", quote: "There is no need for a License for individual's importing or bringing medication into Japan for personal use. An individual can import the following restricted quantities of medication without special procedures. Medication imported or brought into Japan for personal use must not be sold or given to others. Drug or 'Iyakubugaihin'(quasi-drug) : Up to 2 months' supply Prescription Drug : Up to 1 month's supply Vitamin : Up to 4 months' supply" },
        { label: "MHLW (Kinki Regional Bureau of Health and Welfare) — 脳機能の向上等を標ぼうする医薬品等を個人輸入する場合の取扱いについて (Handling of personal imports of medicines etc. claiming to enhance brain function)", url: "https://kouseikyoku.mhlw.go.jp/kinki/yakuji/000343091.pdf", quote: "厚生労働省において、脳機能の向上等を標ぼうして海外で販売されている医薬品やサプリメント等の食品について調査した結果、医療用医薬品に使用されている成分を含んでいることを標ぼうしているものが多数認められた。" },
        { label: "MHLW / National Institute of Health and Nutrition — 健康食品の正しい利用法 (Correct Use of Health Foods)", url: "https://www.mhlw.go.jp/topics/bukyoku/iyaku/syoku-anzen/dl/kenkou_shokuhin00.pdf", quote: "海外から個人輸入した医薬品等は「医薬品副作用被害救済制度」（※１）の対象にならないことも覚えておきましょう。" },
        { label: "MHLW (Kinki Regional Bureau) — traveller exception in the brain-function import notice", url: "https://kouseikyoku.mhlw.go.jp/kinki/yakuji/000343091.pdf", quote: "海外からの入国者が国内滞在中の自己の治療のために携帯して輸入する場合を除いて、数量に関わらず" },
      ],
    },
    "how-nootropics-work":
    {
      summary: "In Japan, whether a supplement is allowed to describe how it works comes down to whether a business has notified the CAA of the scientific evidence behind that mechanism. The CAA's Foods with Function Claims system lets a business state a function once it has filed that evidence, but the agency itself does not verify it — the government does not conduct an examination (our translation) MHLW's own review of overseas products marketed as improving brain function found a different problem in that market: many of the products were found to claim that they contained ingredients used in prescription medicines.",
      sections: [
        { heading: "A function claim rests on the notifier's own evidence", content: "The CAA describes its Foods with Function Claims framework as a system where a business notifies the Commissioner of the Consumer Affairs Agency of the necessary matters, such as scientific evidence on the safety and function of the food, before sale (our translation), and can then display that function. The same source is explicit that, unlike FOSHU, the government does not conduct an examination (our translation) of that evidence — so a mechanism claim on a Japanese label reflects the filing business's own scientific dossier, not an independent government finding." },
        { heading: "Why some 'brain function' products turned out to be something else", content: "MHLW's investigation into overseas medicines and supplements marketed as enhancing brain function found that many of them claimed to contain ingredients used in prescription medicines (our translation) while being sold and described as food or supplement products. That finding is why MHLW now requires an import confirmation for specific named ingredients regardless of quantity — the concern was not a nootropic's ordinary mechanism of action, but that self-administered pharmaceutical-grade compounds carried a real risk of health harm without medical supervision." },
      ],
      faqs: [
        { question: "If a Japanese supplement label describes how it improves cognitive function, has that mechanism been independently verified?", answer: "Not by the government. Under the CAA's Foods with Function Claims system, a business displays the claim after notifying the agency of its supporting evidence, but the CAA states the government does not conduct an examination (our translation) — verification is the notifying business's own responsibility, not an independent scientific review." },
        { question: "Why did MHLW investigate overseas 'brain function' products specifically?", answer: "MHLW's own inquiry found that products marketed abroad as enhancing brain function in many cases claimed to contain ingredients used in prescription medicines (our translation), which is a materially different regulatory situation from a food-grade nootropic ingredient and is why a specific ingredient list now requires advance import confirmation." },
      ],
      sources: [
        { label: "Consumer Affairs Agency (CAA) — 機能性表示食品について (About Foods with Function Claims)", url: "https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/", quote: "機能性表示食品制度とは、国の定めるルールに基づき、事業者が食品の安全性と機能性に関する科学的根拠などの必要な事項を、販売前に消費者庁長官に届け出れば、機能性を表示することができる制度です。 特定保健用食品(トクホ)と異なり、国が審査を行いませんので、事業者は自らの責任において、科学的根拠を基に適正な表示を行う必要があります。" },
        { label: "MHLW (Kinki Regional Bureau of Health and Welfare) — 脳機能の向上等を標ぼうする医薬品等を個人輸入する場合の取扱いについて (Handling of personal imports of medicines etc. claiming to enhance brain function)", url: "https://kouseikyoku.mhlw.go.jp/kinki/yakuji/000343091.pdf", quote: "厚生労働省において、脳機能の向上等を標ぼうして海外で販売されている医薬品やサプリメント等の食品について調査した結果、医療用医薬品に使用されている成分を含んでいることを標ぼうしているものが多数認められた。" },
      ],
    },
  },
  ingredients: {
    "citicoline":
    {
      summary: "Citicoline sits on the pharmaceutical side of Japan's records. It is not an entry in either half of MHLW's food-drug demarcation list, 「食薬区分における成分本質（原材料）の取扱いの例示」 — neither the list of ingredients treated exclusively as pharmaceuticals nor the list of ingredients not judged pharmaceutical when no drug-like claim is made — while citicoline appears in Japan's NHI drug-price code records as an injectable prescription item: a September 2025 MHLW notice lists code 620004406 シチコリン注５００ｍｇ／２ｍＬ「日医工」 ２５％ among transitional-measure products being removed from the price list from October 2025. A buyer in Japan should therefore treat citicoline as a prescription-drug ingredient in the domestic system, not as a notified functional food ingredient.",
      sections: [
        { heading: "Citicoline's place in Japan's food-drug divide", content: "MHLW maintains two linked lists under 「食薬区分における成分本質（原材料）の取扱いの例示」: 別添１「専ら医薬品として使用される成分本質（原材料）リスト」 for ingredients treated exclusively as drugs, and 別添２「医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質（原材料）リスト」 for ingredients not automatically drug-classified absent a drug-like claim. The consolidated text of both lists, as amended through the 令和5年2月17日 notification, carries no entry for citicoline under any of its names. What Japan's records do document is citicoline's presence in the NHI drug-price code records as an injectable pharmaceutical item — the form in which citicoline has been used in Japanese medicine — including a 2025 notice removing one such product code from the price list." },
      ],
      faqs: [
        { question: "Is citicoline a notified functional food ingredient in Japan?", answer: "Citicoline does not appear in either half of MHLW's food-drug ingredient lists, and what Japan's records document instead is citicoline as an injectable prescription item in the NHI drug-price code records (\"シチコリン注５００ｍｇ／２ｍＬ\"). An imported citicoline supplement has no domestic food-side classification to point to." },
        { question: "What does citicoline's absence from MHLW's ingredient lists mean?", answer: "The 食薬区分 lists record ingredients whose status MHLW has set out; an ingredient that is not on either list has no published food-side determination. Combined with citicoline's documented presence in the NHI drug-price code records as an injectable pharmaceutical item, that leaves citicoline in Japan as a prescription-drug ingredient rather than a food ingredient with a notified claim." },
      ],
      sources: [
        { label: "MHLW — 食薬区分における成分本質（原材料）の取扱いの例示の一部改正について (令和5年2月17日薬生監麻発第217001号)", url: "https://www.mhlw.go.jp/web/t_doc?dataId=00tc7344&dataType=1", quote: "医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質(原材料)リスト" },
        { label: "MHLW 診療報酬情報提供サービス — 医薬品コード 省略漢字名称変更のお知らせ（令和7年10月診療分から適用）", url: "https://shinryohoshu.mhlw.go.jp/shinryohoshu/file/info/ymente250919.pdf", quote: "620004406 シチコリン注５００ｍｇ／２ｍＬ「日医工」　２５％" },
      ],
    },
    "l-theanine":
    {
      summary: "L-theanine has an established presence in Japan's Foods with Function Claims system. A Consumer Affairs Agency verification report tags multiple L-theanine notifications 「食添」 in its ingredient-category column, and one such notification, Kyowa Co.'s D295 「ヘルス スイッチ 睡眠」, carries the CAA-recorded claim wording: \"本品はL-テアニンを含みます。L-テアニンは起床時の疲労感や眠気の軽減をサポートすることが報告されています。また、L-テアニンは一過性の作業などによるストレス（精神的負担）を和らげる機能が報告されています。\" Multiple other L-theanine notifications with sleep- and stress-related claims appear in the same report, indicating L-theanine has been notified as a functional ingredient more than once in Japan.",
      sections: [
        { heading: "L-theanine's FFC notification record", content: "The Consumer Affairs Agency's own FY2019 Foods with Function Claims verification report tags multiple L-theanine notifications 「食添」 in its ingredient-category column, alongside the notified functional ingredient name \"L-テアニン\". One entry, notification D295 for Kyowa Co.'s 「ヘルス スイッチ 睡眠」, records the notified claim text verbatim, covering both a morning-fatigue/drowsiness claim and a transient work-stress-relief claim tied to L-theanine intake. The same report lists further L-theanine notifications from multiple manufacturers across the document, showing L-theanine has been notified as a functional ingredient more than once in Japan's Foods with Function Claims system." },
      ],
      faqs: [
        { question: "Can L-theanine be sold as a food ingredient in Japan?", answer: "Yes. The Consumer Affairs Agency's own verification report tags L-theanine notifications 「食添」 and records multiple Foods with Function Claims notifications built around \"L-テアニン\" as the functional ingredient, including Kyowa Co.'s D295 「ヘルス スイッチ 睡眠」 notification, which the same report lists across several manufacturers and product formats." },
        { question: "What functional claims has L-theanine carried in Japanese notifications?", answer: "Per the CAA-recorded text for notification D295, L-theanine has carried a claim that it supports reducing morning fatigue and drowsiness (\"起床時の疲労感や眠気の軽減をサポートする\") and eases transient work-related stress — claims specific to that notified product, not a general effect established for the ingredient itself." },
      ],
      sources: [
        { label: "CAA — H31年度 機能性表示食品検証 報告書 (FY2019 Foods with Function Claims verification report)", url: "https://www.caa.go.jp/policies/policy/food_labeling/information/research/report_01/assets/food_labeling_cms203_251211_04.pdf", quote: "本品はL-テアニンを含みます。L-テアニンは起床時の疲労感や眠気の軽減をサポートすることが報告されています。また、L-テアニンは一過性の作業などによるストレス（精神的負担）を和らげる機能が報告されています。" },
        { label: "CAA — H31年度 機能性表示食品検証 報告書, existing-food-additive tag on L-theanine notifications", url: "https://www.caa.go.jp/policies/policy/food_labeling/information/research/report_01/assets/food_labeling_cms203_251211_04.pdf", quote: "食添L-テアニン、L-テアニン×L-テアニン" },
      ],
    },
    "alpha-gpc":
    {
      summary: "Alpha-GPC — chemically L-alpha-glycerylphosphorylcholine, sn-glycero(3)phosphocholine — is entered under its chemical name in MHLW's 別添２「医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質（原材料）リスト」, the half of Japan's food-drug demarcation list covering ingredients not automatically treated as pharmaceuticals when no drug-like claim is made. The consolidated list text records the entry as \"sn―グリセロ(3)ホスホコリン\" with the alternate name \"L―α―グリセリルホスホリルコリン／sn―Glycero(3) phosphocholine\", with no cross-reference marking it as also appearing on the exclusively-pharmaceutical list.",
      sections: [
        { heading: "Where alpha-GPC sits on MHLW's list", content: "MHLW's 食薬区分 lists work as a pair: 別添１ names ingredients treated exclusively as drugs, and 別添２ names ingredients not automatically drug-classified provided no drug-like efficacy is claimed for them. Alpha-GPC's chemical entry, \"sn―グリセロ(3)ホスホコリン\" (alternate name \"L―α―グリセリルホスホリルコリン／sn―Glycero(3) phosphocholine\"), sits in 別添２ in both the 令和2年3月31日 base text and the 令和5年2月17日 amendment. That placement is what allows glycerophosphocholine-based ingredients to be marketed as food in Japan without being treated as an unapproved drug, so long as the product carries no medicinal efficacy claim." },
      ],
      faqs: [
        { question: "Is alpha-GPC treated as a drug ingredient in Japan?", answer: "No — MHLW's consolidated food-drug list places alpha-GPC's chemical entry (\"sn―グリセロ(3)ホスホコリン\", alternate name \"L―α―グリセリルホスホリルコリン／sn―Glycero(3) phosphocholine\") on 別添２, the list of ingredients not automatically judged pharmaceutical when no drug-like claim is made, not on the exclusively-pharmaceutical list, and that placement holds in both consolidated revisions cited below." },
        { question: "Does the 別添２ listing mean a label may claim a cognitive effect?", answer: "No. 別添２ placement means the ingredient is not judged a pharmaceutical as long as no drug-like efficacy is claimed for it. A cognitive claim on a label would need its own basis — in Japan, a Foods with Function Claims notification to the Consumer Affairs Agency — independent of the ingredient's food-drug classification." },
      ],
      sources: [
        { label: "MHLW — 食薬区分における成分本質（原材料）の取扱いの例示の一部改正について (令和5年2月17日薬生監麻発第217001号), 別添２ entry", url: "https://www.mhlw.go.jp/web/t_doc?dataId=00tc7344&dataType=1", quote: "sn―グリセロ(3)ホスホコリン L―α―グリセリルホスホリルコリン／sn―Glycero(3) phosphocholine" },
        { label: "MHLW — 食薬区分における成分本質（原材料）の取扱いの例示 (令和2年3月31日薬生監麻発0331第9号), base list confirming 別添２ placement", url: "https://www.mhlw.go.jp/web/t_doc?dataId=00tc4935&dataType=1", quote: "sn―グリセロ(3)ホスホコリン L―α―グリセリルホスホリルコリン／sn―Glycero(3) phosphocholine" },
        { label: "MHLW — 別添2 heading: 医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質（原材料）リスト, 1. 植物由来物等", url: "https://www.mhlw.go.jp/web/t_doc?dataId=00tc7344&dataType=1", quote: "(別添2)○医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質(原材料)リスト1．植物由来物等(例)" },
      ],
    },
    "bacopa-monnieri":
    {
      summary: "Bacopa monnieri is entered in MHLW's food-drug list under the Japanese name オトメアゼア (the CAA report writes it オトメアゼナ; alternate name バコパモニエラ), part 全草 (whole plant), on 別添２ — the half of the list covering ingredients not automatically treated as pharmaceuticals absent a drug-like claim. A Consumer Affairs Agency Foods with Function Claims verification report cites this directly, noting \"バコパ（オトメアゼナ）は非医。\", and records a real notification, D235 「記憶の小箱」 by Nihon Shinyaku Co., built on バコパサポニン (bacopa saponin) as the functional ingredient, with claim text: \"本品にはバコパサポニンが含まれます。バコパサポニンには、認知機能の一部である記憶力（加齢により低下する日常生活で見聞きした情報を覚え、思い出す力）を維持する機能があることが報告されています。\" That report also records the product as suspended from sale as of its 2019 reference date.",
      sections: [
        { heading: "Bacopa's MHLW classification and a CAA-notified product", content: "MHLW's food-drug list carries bacopa monnieri under the Japanese name オトメアゼア (spelled オトメアゼナ in the CAA report), with バコパモニエラ recorded as the alternate name and 全草 (whole plant) as the part covered, placed on 別添２, the non-exclusively-pharmaceutical half of the list. The Consumer Affairs Agency's own FY2019 verification report cross-references this MHLW determination directly (\"バコパ（オトメアゼナ）は非医。\") while reviewing notification D235, 「記憶の小箱」, a Nihon Shinyaku Co. product notified with bacopa saponin （バコパサポニン） as its functional ingredient and a memory-maintenance claim. The same report entry notes the product's sales status as suspended as of the report's 2019/5/27 reference date, which does not necessarily reflect current availability." },
      ],
      faqs: [
        { question: "Is bacopa monnieri treated as a food ingredient in Japan?", answer: "Yes — MHLW's list places bacopa monnieri (オトメアゼア, alternate name バコパモニエラ, whole plant) on 別添２, the half of its food-drug classification list for ingredients not automatically judged pharmaceutical absent a drug-like claim, and a CAA verification report explicitly notes \"バコパ（オトメアゼナ）は非医。\"" },
        { question: "Has bacopa monnieri carried a notified functional claim in Japan?", answer: "Yes, per the CAA's FY2019 report: notification D235, 「記憶の小箱」 by Nihon Shinyaku Co., used bacopa saponin （バコパサポニン） as the functional ingredient with a memory-maintenance claim, though that report recorded the product as suspended from sale as of its 2019 reference date." },
      ],
      sources: [
        { label: "CAA — H31年度 機能性表示食品検証 報告書, MHLW non-pharmaceutical cross-reference for bacopa", url: "https://www.caa.go.jp/policies/policy/food_labeling/information/research/report_01/assets/food_labeling_cms203_251211_04.pdf", quote: "バコパ（オトメアゼナ）は非医。" },
        { label: "CAA — H31年度 機能性表示食品検証 報告書, notification D235 claim text", url: "https://www.caa.go.jp/policies/policy/food_labeling/information/research/report_01/assets/food_labeling_cms203_251211_04.pdf", quote: "本品にはバコパサポニンが含まれます。バコパサポニンには、認知機能の一部である記憶力（加齢により低下する日常生活で見聞きした情報を覚え、思い出す力）を維持する機能があることが報告されています。" },
        { label: "MHLW — 食薬区分における成分本質（原材料）の取扱いの例示の一部改正について (令和5年2月17日薬生監麻発第217001号), 別添２ entry", url: "https://www.mhlw.go.jp/web/t_doc?dataId=00tc7344&dataType=1", quote: "オトメアゼア バコパモニエラ 全草" },
        { label: "MHLW — 別添2 heading: 医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質（原材料）リスト, 1. 植物由来物等", url: "https://www.mhlw.go.jp/web/t_doc?dataId=00tc7344&dataType=1", quote: "(別添2)○医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質(原材料)リスト1．植物由来物等(例)" },
      ],
    },
    "lions-mane":
    {
      summary: "Lion's mane mushroom is entered in MHLW's food-drug list under its Japanese name ヤマブシタケ, part 子実体 (fruiting body), on 別添２ — the half of Japan's food-drug demarcation list for ingredients not automatically treated as pharmaceuticals when no drug-like claim is made. The entry appears in the consolidated list as amended by the 令和5年2月17日 notification.",
      sections: [
        { heading: "Lion's mane on MHLW's food-drug list", content: "MHLW's consolidated 食薬区分 list carries ヤマブシタケ (lion's mane, Hericium erinaceus) with 子実体 (fruiting body) specified as the part covered, entered on 別添２ — the list of ingredients not automatically drug-classified provided no medicinal efficacy is claimed for them, rather than on 別添１, the exclusively-pharmaceutical list. The entry is limited to the fruiting body; it says nothing about mycelium preparations, which a buyer should not assume are covered by the same line." },
      ],
      faqs: [
        { question: "Is lion's mane mushroom classified as a food ingredient in Japan?", answer: "MHLW's food-drug list places ヤマブシタケ (lion's mane, fruiting body) on 別添２, the half of its classification list for ingredients not automatically judged pharmaceutical absent a drug-like claim, not on the exclusively-pharmaceutical list." },
        { question: "Does the 別添２ listing cover a label claim about cognition?", answer: "No. The listing settles only that fruiting-body lion's mane is not judged a pharmaceutical when no drug-like claim is made. A cognitive claim on a Japanese label would need a Foods with Function Claims notification to the Consumer Affairs Agency, which is a separate step from the ingredient's food-drug classification." },
      ],
      sources: [
        { label: "MHLW — 食薬区分における成分本質（原材料）の取扱いの例示の一部改正について (令和5年2月17日薬生監麻発第217001号), 別添２ entry", url: "https://www.mhlw.go.jp/web/t_doc?dataId=00tc7344&dataType=1", quote: "ヤマブシタケ子実体ヤマブドウ葉・実ヤマモモヨ" },
        { label: "MHLW — 別添2 heading: 医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質（原材料）リスト, 1. 植物由来物等", url: "https://www.mhlw.go.jp/web/t_doc?dataId=00tc7344&dataType=1", quote: "(別添2)○医薬品的効能効果を標ぼうしない限り医薬品と判断しない成分本質(原材料)リスト1．植物由来物等(例)" },
      ],
    },
  },
};
