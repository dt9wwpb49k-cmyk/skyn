import { useState, useRef, useCallback, useEffect } from "react";

const BACKEND = "https://skyn-red.vercel.app";

// ============================================================
// WIRKSTOFF-BIBLIOTHEK (9 Wirkstoffe × 3 Budget-Stufen)
// ============================================================

const WIRKSTOFFE = {
  vitaminC: {
    name: "Vitamin C",
    kategorie: "antioxidans",
    zeit: "morning",
    wofuer: "Antioxidativer Schutz vor UV-induzierten freien Radikalen, Aufhellung von Hyperpigmentierung, Unterstützung der Kollagensynthese.",
    studien: "Meta-Analyse (Al-Niaimi & Chiang, 2017, J Clin Aesthet Dermatol): L-Ascorbinsäure ≥10 % reduziert Pigmentflecken signifikant nach 12 Wochen (p < 0.001).",
    effekt: "Nach 8 Wochen: spürbar ebenmäßigerer Teint. Nach 12 Wochen: Reduktion sichtbarer Pigmentflecken um ~30 %.",
    anwendung: "3–4 Tropfen auf trockene Haut. 60 Sekunden einziehen lassen.",
    ev: "hoch",
    produkte: {
      drogerie: { name: "L'Oréal Revitalift 12% Vitamin C", brand: "L'Oréal", price: "14,99 €", link: "https://www.dm.de/l-oreal-paris-revitalift-clinical-vitamin-c-serum/" },
      midrange: { name: "Garnier Vitamin C Serum", brand: "Garnier", price: "12,99 €", link: "https://www.dm.de/garnier-skin-active-vitamin-c-serum/" },
      premium: { name: "Paula's Choice C15 Super Booster", brand: "Paula's Choice", price: "48,00 €", link: "https://www.paulaschoice.de/c15-super-booster/" },
    },
  },
  retinol: {
    name: "Retinol",
    kategorie: "aktivstoff",
    zeit: "evening",
    konfliktMit: ["bha", "azelain"],
    wofuer: "Goldstandard gegen Falten, Pigmentflecken und verstopfte Poren. Beschleunigt Zellerneuerung und regt Kollagensynthese an.",
    studien: "Cochrane Review (2023, n = 4.200): Retinoide verbessern Photoaging signifikant. Kligman & Leyden: 0.3–1 % Retinol = klinisch wirksam bei guter Verträglichkeit.",
    effekt: "Nach 4 Wochen: feinere Poren. Nach 12 Wochen: sichtbare Reduktion feiner Linien. Nach 6 Monaten: deutlich verbesserte Hautstruktur.",
    anwendung: "3× pro Woche, erbsengroße Menge auf trockene Haut. Nicht gleichzeitig mit BHA anwenden.",
    frequenz: "3× pro Woche",
    ev: "hoch",
    produkte: {
      drogerie: { name: "The Ordinary Retinol 0.5%", brand: "The Ordinary", price: "6,50 €", link: "https://www.notino.de/the-ordinary/retinol-0-5-in-squalan/" },
      midrange: { name: "La Roche-Posay Redermic Retinol", brand: "La Roche-Posay", price: "25,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-redermic-retinol/" },
      premium: { name: "Paula's Choice 1% Retinol", brand: "Paula's Choice", price: "62,00 €", link: "https://www.paulaschoice.de/clinical-1pct-retinol-treatment/" },
    },
  },
  bha: {
    name: "BHA (Salicylsäure)",
    kategorie: "exfoliant",
    zeit: "evening",
    konfliktMit: ["retinol"],
    wofuer: "Löst Talg und abgestorbene Hautzellen in den Poren. Anti-entzündlich, ideal bei Unreinheiten und vergrößerten Poren.",
    studien: "Meta-Analyse (Arif, 2015, Clin Cosmet Investig Dermatol): 2 % Salicylsäure reduziert Akne-Läsionen um 47 % nach 12 Wochen. AAD-Goldstandard.",
    effekt: "Nach 2 Wochen: weniger Mitesser. Nach 8 Wochen: sichtbar feinere Poren und ebenmäßigere Textur.",
    anwendung: "3× pro Woche, an Retinol-freien Abenden. Mit Pad oder Fingern auftragen, nicht abspülen.",
    frequenz: "3× pro Woche (abwechselnd mit Retinol)",
    ev: "hoch",
    produkte: {
      drogerie: { name: "The Ordinary Salicylic Acid 2%", brand: "The Ordinary", price: "8,90 €", link: "https://www.notino.de/the-ordinary/" },
      midrange: { name: "COSRX BHA Blackhead Power Liquid", brand: "COSRX", price: "18,00 €", link: "https://www.yesstyle.com/en/cosrx-bha-blackhead-power-liquid/" },
      premium: { name: "Paula's Choice 2% BHA Liquid", brand: "Paula's Choice", price: "32,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peeling/" },
    },
  },
  niacinamid: {
    name: "Niacinamid",
    kategorie: "multitalent",
    zeit: "both",
    wofuer: "Reguliert Talgproduktion, verfeinert Poren, stärkt die Hautbarriere und reduziert Rötungen.",
    studien: "Hakozaki et al. (2002, Br J Dermatol, RCT): 5 % Niacinamid reduziert Hyperpigmentierung signifikant. Weitere RCTs zeigen 52 % Mitesser-Reduktion nach 8 Wochen.",
    effekt: "Nach 4 Wochen: sichtbar weniger Glanz und verfeinerte Poren. Nach 8 Wochen: ebenmäßigerer Teint.",
    anwendung: "Wenige Tropfen vor der Feuchtigkeitspflege. Verträgt sich mit fast allen anderen Wirkstoffen.",
    ev: "hoch",
    produkte: {
      drogerie: { name: "The Ordinary Niacinamide 10% + Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/" },
      midrange: { name: "The Inkey List Niacinamide", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list/" },
      premium: { name: "Paula's Choice 10% Niacinamide Booster", brand: "Paula's Choice", price: "42,00 €", link: "https://www.paulaschoice.de/" },
    },
  },
  ha: {
    name: "Hyaluronsäure",
    kategorie: "feuchtigkeit",
    zeit: "both",
    wofuer: "Bindet Feuchtigkeit in der Haut, polstert fein auf und verbessert das Hautgefühl spürbar.",
    studien: "Pavicic et al. (2011, J Drugs Dermatol): Hyaluronsäure-Seren erhöhen Hautfeuchtigkeit signifikant nach 2 Monaten. Multi-Molekulargewicht zeigt bessere Penetration.",
    effekt: "Sofort: pralleres Hautgefühl. Nach 4 Wochen: dauerhaft verbesserte Hautfeuchtigkeit.",
    anwendung: "Auf leicht feuchte Haut auftragen, danach Feuchtigkeitspflege versiegelt die Wirkung.",
    ev: "hoch",
    produkte: {
      drogerie: { name: "The Inkey List Hyaluronic Acid", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list-hyaluronic-acid-serum/" },
      midrange: { name: "Hada Labo Gokujyun Lotion", brand: "Hada Labo", price: "16,50 €", link: "https://www.yesstyle.com/en/hada-labo-gokujyun-premium-lotion/" },
      premium: { name: "Paula's Choice HA Booster", brand: "Paula's Choice", price: "44,00 €", link: "https://www.paulaschoice.de/" },
    },
  },
  ceramide: {
    name: "Ceramide",
    kategorie: "barriere",
    zeit: "both",
    wofuer: "Reparieren und stärken die Hautbarriere. Essentiell bei trockener, empfindlicher oder gestresster Haut.",
    studien: "Draelos (2018, J Cosmet Dermatol, Meta-Analyse): Ceramid-haltige Pflege reduziert transepidermalen Wasserverlust um 32 % gegenüber Standard-Pflege.",
    effekt: "Nach 1 Woche: weniger Spannungsgefühl. Nach 4 Wochen: spürbar widerstandsfähigere Hautbarriere.",
    anwendung: "Als Feuchtigkeitspflege morgens und abends. Kann bei Bedarf auch als Nachtpflege verwendet werden.",
    ev: "hoch",
    produkte: {
      drogerie: { name: "CeraVe Moisturising Cream", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-moisturising-cream/" },
      midrange: { name: "First Aid Beauty Ultra Repair Cream", brand: "First Aid Beauty", price: "18,00 €", link: "https://www.lookfantastic.de/first-aid-beauty-ultra-repair-cream/" },
      premium: { name: "Dr. Jart+ Ceramidin Cream", brand: "Dr. Jart+", price: "49,00 €", link: "https://www.lookfantastic.de/dr-jart/" },
    },
  },
  azelain: {
    name: "Azelainsäure",
    kategorie: "aktivstoff",
    zeit: "evening",
    konfliktMit: ["retinol"],
    wofuer: "Wirkt gegen Unreinheiten, Rötungen und Pigmentflecken. Besonders geeignet bei empfindlicher Haut und Rosacea.",
    studien: "Meta-Analyse (Liu et al., 2020, Dermatol Ther): 15–20 % Azelainsäure wirksam bei Akne und Rosacea, vergleichbar mit BHA bei besserer Verträglichkeit.",
    effekt: "Nach 4 Wochen: weniger Rötungen. Nach 12 Wochen: sichtbar gleichmäßigerer Teint.",
    anwendung: "Dünne Schicht auf betroffene Stellen. Kann leichtes Kribbeln verursachen in den ersten Tagen.",
    frequenz: "Täglich möglich (sanfter als BHA)",
    ev: "hoch",
    produkte: {
      drogerie: { name: "The Ordinary Azelaic Acid 10%", brand: "The Ordinary", price: "8,90 €", link: "https://www.notino.de/the-ordinary/" },
      midrange: { name: "The Inkey List Azelaic Acid", brand: "The Inkey List", price: "12,99 €", link: "https://www.lookfantastic.de/the-inkey-list/" },
      premium: { name: "Paula's Choice 10% Azelaic Acid Booster", brand: "Paula's Choice", price: "48,00 €", link: "https://www.paulaschoice.de/" },
    },
  },
  peptide: {
    name: "Peptide",
    kategorie: "antiaging",
    zeit: "both",
    wofuer: "Signalisieren der Haut, mehr Kollagen zu produzieren. Unterstützen Festigkeit und Elastizität.",
    studien: "Schagen (2017, Cosmetics, Review): Signalpeptide wie Matrixyl zeigen in RCTs messbare Faltenreduktion nach 8–12 Wochen Anwendung.",
    effekt: "Nach 8 Wochen: feinere Linien sichtbar reduziert. Nach 12 Wochen: spürbar festere Haut.",
    anwendung: "Auf gereinigte Haut vor der Feuchtigkeitspflege. Gut kombinierbar mit anderen Wirkstoffen.",
    ev: "mittel",
    produkte: {
      drogerie: { name: "The Ordinary Buffet Peptide Serum", brand: "The Ordinary", price: "15,50 €", link: "https://www.notino.de/the-ordinary/" },
      midrange: { name: "The Inkey List Peptide Moisturizer", brand: "The Inkey List", price: "17,99 €", link: "https://www.lookfantastic.de/the-inkey-list/" },
      premium: { name: "Paula's Choice Peptide Booster", brand: "Paula's Choice", price: "52,00 €", link: "https://www.paulaschoice.de/" },
    },
  },
  centella: {
    name: "Centella Asiatica",
    kategorie: "beruhigung",
    zeit: "both",
    wofuer: "Beruhigt gereizte Haut, reduziert Rötungen und unterstützt die Hautbarriere. Ideal bei Empfindlichkeit.",
    studien: "Bylka et al. (2013, Arch Dermatol Res, Review): Centella-Extrakte (Madecassosid) wirken klinisch belegt entzündungshemmend und wundheilungsfördernd.",
    effekt: "Nach 2 Wochen: spürbar weniger Reizungen. Nach 6 Wochen: beruhigterer Hautton.",
    anwendung: "Als Serum oder Essence vor der Feuchtigkeitspflege. Besonders hilfreich nach aktiven Wirkstoffen.",
    ev: "mittel",
    produkte: {
      drogerie: { name: "Purito Centella Green Level Serum", brand: "Purito", price: "15,90 €", link: "https://www.yesstyle.com/" },
      midrange: { name: "COSRX Centella Blemish Ampoule", brand: "COSRX", price: "22,00 €", link: "https://www.yesstyle.com/" },
      premium: { name: "Dr. Jart+ Cicapair Serum", brand: "Dr. Jart+", price: "46,00 €", link: "https://www.lookfantastic.de/dr-jart/" },
    },
  },
};

const BASIS = {
  reinigung: {
    name: "Sanfte Reinigung",
    wofuer: "Entfernt Talg, Schweiß und Sonnenschutzreste ohne die Hautbarriere anzugreifen.",
    studien: "Draelos (2018): Milde Syndet-Reiniger erhalten den Haut-pH und reduzieren Barriereschäden.",
    effekt: "Sofort: saubere Haut ohne Spannungsgefühl. Dauerhaft: stabile Hautbarriere.",
    anwendung: "20 Sekunden sanft einmassieren, lauwarm abspülen.",
    ev: "hoch",
    produkte: {
      drogerie: { name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-hydrating-facial-cleanser/11288802.html" },
      midrange: { name: "La Roche-Posay Toleriane Cleanser", brand: "La Roche-Posay", price: "16,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay/" },
      premium: { name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/" },
    },
  },
  spf: {
    name: "Sonnenschutz",
    wofuer: "Schutz vor UVA/UVB, Prävention von Photoaging, Pigmentflecken und Hautkrebs. Wichtigster Anti-Aging-Schritt überhaupt.",
    studien: "Green et al. (2013, Annals of Internal Medicine, RCT, n = 903): Tägliche SPF-Nutzung reduziert sichtbares Hautaltern um 24 % über 4,5 Jahre.",
    effekt: "Unmittelbar: Schutz vor UV-Schäden. Langfristig: signifikant weniger Falten und Pigmentflecken.",
    anwendung: "Als letzter Schritt morgens. Ca. 1/4 Teelöffel fürs Gesicht. Alle 2 Std. nachcremen bei Sonnenexposition.",
    ev: "hoch",
    produkte: {
      drogerie: { name: "Altruist Face Fluid SPF50", brand: "Altruist", price: "7,99 €", link: "https://www.amazon.de/s?k=altruist+spf+50" },
      midrange: { name: "La Roche-Posay Anthelios UVmune SPF50+", brand: "La Roche-Posay", price: "19,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-anthelios-spf50/" },
      premium: { name: "Isdin Eryfotona Actinica SPF100", brand: "Isdin", price: "38,00 €", link: "https://www.lookfantastic.de/isdin-eryfotona-actinica-spf100/" },
    },
  },
};

function buildRoutine(skinType, budget, regler, concerns) {
  const r = regler || { trockenheit: 50, fettigkeit: 50, empfindlichkeit: 30, unreinheiten: 40 };
  const sehrEmpfindlich = r.empfindlichkeit > 75;
  const sensibel = r.empfindlichkeit > 55;
  const sehrTrocken = r.trockenheit > 65;
  const sehrFettig = r.fettigkeit > 65;
  const starkeUnreinheiten = r.unreinheiten > 60;
  const concernsStr = (concerns || []).join(" ").toLowerCase();
  const hatPigment = /pigment|fleck|verf(a|ä)rb|unebenheit/i.test(concernsStr);
  const hatFalten = /falt|linie|alter|elastiz/i.test(concernsStr);
  const hatRoetung = /rötung|roetung|rosacea|reiz/i.test(concernsStr);

  const morning = [
    { ...BASIS.reinigung, step: "Reinigung", zeit: "morning" },
  ];
  morning.push({ ...WIRKSTOFFE.vitaminC, step: "Serum" });
  morning.push({ ...WIRKSTOFFE.niacinamid, step: "Wirkstoff-Serum" });
  morning.push({ ...WIRKSTOFFE.ceramide, step: "Feuchtigkeitspflege" });
  morning.push({ ...BASIS.spf, step: "Sonnenschutz", spf: true });

  const evening = [
    { ...BASIS.reinigung, step: "Reinigung", zeit: "evening" },
  ];
  evening.push({ ...WIRKSTOFFE.niacinamid, step: "Wirkstoff-Serum" });

  let hauptaktiv = null;
  let sekundaer = null;
  if (sehrEmpfindlich) {
    hauptaktiv = { ...WIRKSTOFFE.centella, step: "Beruhigendes Serum", highlight: true };
  } else if (sensibel) {
    hauptaktiv = { ...WIRKSTOFFE.azelain, step: "Aktivstoff", highlight: true };
  } else if (starkeUnreinheiten && (hatFalten || hatPigment)) {
    hauptaktiv = { ...WIRKSTOFFE.retinol, step: "Aktivstoff (3×/Woche)", highlight: true };
    sekundaer = { ...WIRKSTOFFE.bha, step: "Exfoliant (3×/Woche, im Wechsel)", highlight: true };
  } else if (starkeUnreinheiten) {
    hauptaktiv = { ...WIRKSTOFFE.bha, step: "Exfoliant", highlight: true };
  } else if (hatFalten || hatPigment) {
    hauptaktiv = { ...WIRKSTOFFE.retinol, step: "Aktivstoff", highlight: true };
  } else {
    if (skinType === "dry" || sehrTrocken) {
      hauptaktiv = { ...WIRKSTOFFE.azelain, step: "Aktivstoff", highlight: true };
    } else {
      hauptaktiv = { ...WIRKSTOFFE.retinol, step: "Aktivstoff", highlight: true };
    }
  }
  if (hauptaktiv) evening.push(hauptaktiv);
  if (sekundaer) evening.push(sekundaer);
  evening.push({ ...WIRKSTOFFE.ceramide, step: "Nachtpflege" });

  const fillProduct = (item) => {
    const prod = item.produkte?.[budget];
    if (!prod) return item;
    return { ...item, ...prod };
  };
  return {
    morning: morning.map(fillProduct),
    evening: evening.map(fillProduct),
    hauptaktiv: hauptaktiv?.name,
    sekundaer: sekundaer?.name,
  };
}

function buildWochenplan(routine) {
  const hauptIstRetinol = routine.hauptaktiv === "Retinol";
  const hatBHA = routine.sekundaer === "BHA (Salicylsäure)" || routine.hauptaktiv === "BHA (Salicylsäure)";
  const hatAzelain = routine.hauptaktiv === "Azelainsäure" || routine.sekundaer === "Azelainsäure";
  const tage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const plan = {};
  if (hauptIstRetinol && hatBHA) {
    plan.Mo = { abend: "Retinol", farbe: "retinol" };
    plan.Di = { abend: "BHA", farbe: "bha" };
    plan.Mi = { abend: "Retinol", farbe: "retinol" };
    plan.Do = { abend: "BHA", farbe: "bha" };
    plan.Fr = { abend: "Retinol", farbe: "retinol" };
    plan.Sa = { abend: "BHA", farbe: "bha" };
    plan.So = { abend: "Pause", farbe: "pause" };
  } else if (hauptIstRetinol) {
    ["Mo", "Mi", "Fr"].forEach(t => plan[t] = { abend: "Retinol", farbe: "retinol" });
    ["Di", "Do", "Sa", "So"].forEach(t => plan[t] = { abend: "Basispflege", farbe: "pause" });
  } else if (!hauptIstRetinol && hatBHA) {
    ["Mo", "Mi", "Fr"].forEach(t => plan[t] = { abend: "BHA", farbe: "bha" });
    ["Di", "Do", "Sa", "So"].forEach(t => plan[t] = { abend: "Basispflege", farbe: "pause" });
  } else if (hatAzelain) {
    tage.forEach(t => plan[t] = { abend: "Azelainsäure", farbe: "azelain" });
  } else {
    tage.forEach(t => plan[t] = { abend: "Basispflege", farbe: "pause" });
  }
  return plan;
}

function getDemoResult(regler) {
  const r = regler || { trockenheit: 50, fettigkeit: 50, empfindlichkeit: 30, unreinheiten: 40 };
  let skinType = "combination";
  if (r.trockenheit > 60 && r.fettigkeit < 40) skinType = "dry";
  else if (r.fettigkeit > 60 && r.trockenheit < 40) skinType = "oily";
  const feuchtigkeit = Math.max(20, Math.min(85, 100 - r.trockenheit + Math.random() * 15 - 7));
  const talg = Math.max(25, Math.min(90, r.fettigkeit + Math.random() * 15 - 7));
  const empfindlichkeit = Math.max(15, Math.min(85, r.empfindlichkeit + Math.random() * 15 - 7));
  const elastizitaet = Math.max(40, Math.min(90, 75 + Math.random() * 15 - 7));
  const score = Math.round((feuchtigkeit + (100 - empfindlichkeit) + elastizitaet + (100 - Math.abs(talg - 50))) / 4);
  const concerns = [];
  if (r.fettigkeit > 55) concerns.push("T-Zone Glanz");
  if (r.unreinheiten > 50) concerns.push("Vergroesserte Poren");
  if (r.trockenheit > 55) concerns.push("Trockene Stellen");
  if (r.empfindlichkeit > 55) concerns.push("Roetungen");
  if (concerns.length === 0) concerns.push("Ausgewogenes Hautbild");
  const typeLabel = skinType === "combination" ? "Mischhaut" : skinType === "dry" ? "trockene Haut" : "fettige Haut";
  const summary = `Deine Analyse zeigt typische Merkmale einer ${typeLabel}. ${
    r.empfindlichkeit > 55 ? "Deine Selbsteinschätzung deutet auf erhöhte Empfindlichkeit hin – wir haben die Routine entsprechend sanft ausgelegt." :
    r.unreinheiten > 55 ? "Deine Haut profitiert von einer Routine mit Fokus auf Porenverfeinerung und Talgregulation." :
    r.trockenheit > 55 ? "Der Fokus liegt auf Feuchtigkeitsaufbau und Stärkung der Hautbarriere." :
    "Deine Haut ist in einer guten Balance – wir konzentrieren uns auf Erhalt und sanfte Optimierung."
  }`;
  return {
    ok: true, skinType, score,
    scores: {
      Feuchtigkeit: Math.round(feuchtigkeit),
      Talgproduktion: Math.round(talg),
      Empfindlichkeit: Math.round(empfindlichkeit),
      Elastizitaet: Math.round(elastizitaet),
    },
    concerns, summary, _demo: true,
  };
}

async function analyseHaut(base64, regler, mediaType) {
  const reglerText = regler
    ? ` Selbsteinschaetzung User 0-100: Trockenheit=${regler.trockenheit}, Fettigkeit=${regler.fettigkeit}, Empfindlichkeit=${regler.empfindlichkeit}, Unreinheiten=${regler.unreinheiten}. Beruecksichtige diese Werte in summary und scores.`
    : "";
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const safeMediaType = allowed.includes(mediaType) ? mediaType : "image/jpeg";
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 400,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: safeMediaType, data: base64 } },
        { type: "text", text: "Analysiere dieses Gesichtsfoto. Antworte NUR mit JSON ohne Text davor oder danach.\n\nWenn KEIN Gesicht sichtbar: {\"ok\":false,\"issue\":\"Kein Gesicht erkannt - bitte Selfie aufnehmen\"}\nWenn von unten/oben/dunkel/unscharf: {\"ok\":false,\"issue\":\"Hinweis auf Deutsch\"}\n\nWenn normales Selfie: {\"ok\":true,\"skinType\":\"combination\",\"score\":69,\"scores\":{\"Feuchtigkeit\":42,\"Talgproduktion\":68,\"Empfindlichkeit\":35,\"Elastizitaet\":71},\"concerns\":[\"T-Zone Glanz\",\"Vergroesserte Poren\"],\"summary\":\"Kurze individuelle Beschreibung auf Deutsch.\"}\n\nskinType: combination, dry oder oily. Alle Scores 0-100 realistisch. Nur JSON." + reglerText }
      ]
    }]
  };
  try {
    const res = await fetch(BACKEND + "/api/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Server ${res.status}: ${errText.slice(0, 100)}`);
    }
    const data = await res.json();
    if (data.type === "error") throw new Error(data.error?.type || "API-Fehler");
    const text = data.content?.[0]?.text || "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Keine Antwort");
    return JSON.parse(match[0]);
  } catch (err) {
    console.warn("[skyn] API nicht erreichbar, Demo-Modus:", err?.message);
    await new Promise(r => setTimeout(r, 800));
    return getDemoResult(regler);
  }
}

function fileToBase64Direct(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") { reject(new Error("FileReader lieferte kein String-Ergebnis")); return; }
      const parts = result.split(",");
      if (parts.length < 2 || !parts[1]) { reject(new Error("Base64 leer")); return; }
      resolve(parts[1]);
    };
    reader.onerror = () => reject(new Error("FileReader Fehler"));
    reader.readAsDataURL(file);
  });
}

function fileToBase64Canvas(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    const timeout = setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error("Bild-Lade-Timeout"));
    }, 5000);
    img.onload = () => {
      clearTimeout(timeout);
      try {
        const MAX = 768;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) { URL.revokeObjectURL(url); reject(new Error("Canvas-Context nicht verfügbar")); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        const parts = dataUrl.split(",");
        if (parts.length < 2 || !parts[1]) { reject(new Error("Canvas-Base64 leer")); return; }
        resolve(parts[1]);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      reject(new Error("Bild konnte nicht als Image-Element geladen werden"));
    };
    img.src = url;
  });
}

async function toBase64(file) {
  try {
    return await fileToBase64Canvas(file);
  } catch (canvasErr) {
    console.warn("[skyn] Canvas fehlgeschlagen, FileReader-Fallback:", canvasErr?.message);
    return await fileToBase64Direct(file);
  }
}

function EvidenzBadge({ level, onClick, open }) {
  const styles = {
    hoch: { bg: "#ecfdf5", color: "#065f46", label: "Evidenz: Hoch" },
    mittel: { bg: "#eff6ff", color: "#1e40af", label: "Evidenz: Mittel" },
    begrenzt: { bg: "#fef3c7", color: "#92400e", label: "Evidenz: Begrenzt" },
  };
  const s = styles[level] || styles.mittel;
  return (
    <button onClick={onClick} style={{ fontSize: 10, background: s.bg, color: s.color, padding: "4px 10px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}>
      {s.label}
      <span style={{ fontSize: 8, opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
    </button>
  );
}

function TraitBar({ label, value }) {
  const c = { Feuchtigkeit: "#3b82f6", Talgproduktion: "#f59e0b", Empfindlichkeit: "#ef4444", Elastizität: "#10b981", Elastizitaet: "#10b981" };
  const displayLabel = label === "Elastizitaet" ? "Elastizität" : label;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "#475569", fontWeight: 500 }}>{displayLabel}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#0f172a" }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: "#f1f5f9", borderRadius: 99 }}>
        <div style={{ height: 4, borderRadius: 99, background: c[label] || "#3b82f6", width: value + "%" }} />
      </div>
    </div>
  );
}

function ProductCard({ item, idx, personalReason }) {
  const [evOpen, setEvOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  return (
    <div style={{ background: "white", borderRadius: 14, padding: 14, marginBottom: 10, border: item.spf ? "1.5px solid #fde68a" : item.highlight ? "1.5px solid #bfdbfe" : "1px solid #eef0f3" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: item.spf ? "#fef9c3" : "#eff6ff", color: item.spf ? "#92400e" : "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1, fontFamily: "'Lora', serif" }}>
          {item.spf ? "☀" : idx + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{item.step}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", fontFamily: "'Lora', serif", lineHeight: 1.3 }}>{item.name}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{item.brand}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.price}</div>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, background: "#0f172a", color: "white", padding: "4px 10px", borderRadius: 99, textDecoration: "none", fontWeight: 600, marginTop: 4, display: "inline-block" }}>Kaufen</a>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 8, paddingTop: 8, borderTop: "1px dashed #e2e8f0", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>Anwendung: </span>{item.anwendung}
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 9, flexWrap: "wrap" }}>
            <EvidenzBadge level={item.ev} onClick={() => setEvOpen((v) => !v)} open={evOpen} />
            {personalReason && (
              <button onClick={() => setWhyOpen((v) => !v)} style={{ fontSize: 10, background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
                Warum für dich {whyOpen ? "▲" : "▼"}
              </button>
            )}
          </div>
          {whyOpen && personalReason && (
            <div style={{ marginTop: 8, fontSize: 11, color: "#334155", background: "#f8fafc", borderRadius: 8, padding: "8px 10px", lineHeight: 1.6, borderLeft: "3px solid #3b82f6" }}>
              {personalReason}
            </div>
          )}
          {evOpen && (
            <div style={{ marginTop: 8, background: "#f8fafc", borderRadius: 8, padding: 12, fontSize: 11, lineHeight: 1.6, border: "1px solid #e2e8f0" }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 3 }}>Wofür</div>
                <div style={{ color: "#0f172a" }}>{item.wofuer}</div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 3 }}>Studienlage</div>
                <div style={{ color: "#0f172a" }}>{item.studien}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 3 }}>Erwartbarer Effekt</div>
                <div style={{ color: "#0f172a" }}>{item.effekt}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function downloadWochenplan(skinData, skinType, budget, routine, regler) {
  const typeLabel = skinType === "combination" ? "Mischhaut" : skinType === "dry" ? "Trockene Haut" : "Fettige Haut";
  const budgetLabel = budget === "drogerie" ? "Drogerie" : budget === "midrange" ? "Mid-Range" : "Premium";
  const tage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const getAnwendungsTage = (produktName) => {
    if (produktName === "Retinol") return { Mo: true, Di: false, Mi: true, Do: false, Fr: true, Sa: false, So: false };
    if (produktName === "BHA (Salicylsäure)") {
      if (routine.hauptaktiv === "Retinol" && routine.sekundaer === "BHA (Salicylsäure)") {
        return { Mo: false, Di: true, Mi: false, Do: true, Fr: false, Sa: true, So: false };
      }
      return { Mo: true, Di: false, Mi: true, Do: false, Fr: true, Sa: false, So: false };
    }
    return { Mo: true, Di: true, Mi: true, Do: true, Fr: true, Sa: true, So: true };
  };
  const buildProductRow = (p) => {
    const t = getAnwendungsTage(p.name);
    return `<tr><td class="prod-cell"><div class="prod-name">${p.name}</div><div class="prod-step">${p.step} · ${p.brand}</div></td>${tage.map(d => `<td class="day-cell ${t[d] ? "check" : "dash"}">${t[d] ? "✓" : "–"}</td>`).join("")}</tr>`;
  };
  const allMorning = routine.morning.map(buildProductRow).join("");
  const allEvening = routine.evening.map(buildProductRow).join("");
  const alleProdukte = [...routine.morning, ...routine.evening].filter((p, i, arr) => arr.findIndex(x => x.name === p.name) === i);
  const productDetailCard = (p) => `<div class="detail-card"><div class="detail-header"><div><div class="detail-step">${p.step}</div><div class="detail-name">${p.name}</div><div class="detail-brand">${p.brand} · ${p.price}</div></div></div><div class="detail-body"><div class="detail-label">Anwendung</div><div class="detail-text">${p.anwendung}</div></div></div>`;
  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>skyn. Wochenplan – ${typeLabel}</title><style>*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:800px;margin:0 auto;padding:40px 24px;color:#0f172a;background:#f8fafc;line-height:1.5}h1{font-family:Georgia,serif;font-size:36px;font-weight:500;letter-spacing:-0.02em;margin:0}h1 .accent{color:#3b82f6;font-style:italic}h2{font-family:Georgia,serif;font-size:20px;font-weight:500;margin:0 0 16px}h3{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;margin:0 0 10px}.header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;padding-bottom:20px;border-bottom:1px solid #e2e8f0}.hero{background:linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%);color:white;border-radius:18px;padding:24px;display:flex;justify-content:space-between;align-items:center;margin:24px 0}.hero-type{font-family:Georgia,serif;font-size:28px;font-weight:500}.score-circle{width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:500;font-family:Georgia,serif}.summary{background:white;border:1px solid #eef0f3;border-radius:14px;padding:20px;font-size:14px;color:#334155;line-height:1.7;margin-bottom:28px}.section{background:white;border:1px solid #eef0f3;border-radius:14px;padding:24px;margin-bottom:20px}.week-table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px}.week-table thead th{padding:10px 6px;font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.1em;border-bottom:2px solid #e2e8f0;text-align:center;background:#f8fafc}.week-table thead th:first-child{text-align:left;padding-left:14px}.week-table .time-row td{padding:10px 14px;font-family:Georgia,serif;font-size:14px;font-weight:500;background:#f1f5f9}.prod-cell{padding:14px;border-bottom:1px solid #f1f5f9;min-width:220px}.prod-name{font-size:13px;font-weight:600;font-family:Georgia,serif}.prod-step{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-top:2px}.day-cell{text-align:center;padding:10px 4px;border-bottom:1px solid #f1f5f9;font-size:16px;font-weight:600;width:40px}.day-cell.check{color:#10b981;background:#f0fdf4}.day-cell.dash{color:#cbd5e1}.detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}.detail-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px}.detail-step{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;font-weight:700}.detail-name{font-family:Georgia,serif;font-size:14px;font-weight:600;margin:2px 0 3px}.detail-brand{font-size:11px;color:#64748b}.detail-body{margin-top:10px;padding-top:10px;border-top:1px dashed #cbd5e1}.detail-label{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin-bottom:4px}.detail-text{font-size:12px;color:#475569;line-height:1.6}.rules{background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;margin-top:20px;font-size:12px;color:#78350f;line-height:1.7}.disc{font-size:10px;color:#94a3b8;line-height:1.7;margin-top:28px;padding-top:20px;border-top:1px solid #e2e8f0}@media print{body{background:white}.day-cell.check{print-color-adjust:exact;-webkit-print-color-adjust:exact}.hero{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body><div class="header"><h1>skyn<span class="accent">.</span></h1><div style="font-size:11px;color:#94a3b8;letter-spacing:0.1em">EVIDENZBASIERTE HAUTPFLEGE</div></div><div style="font-size:12px;color:#64748b;margin-bottom:8px">Erstellt am ${new Date().toLocaleDateString("de-DE",{day:"2-digit",month:"long",year:"numeric"})}</div><div class="hero"><div><div style="font-size:10px;opacity:0.7;letter-spacing:0.12em;margin-bottom:4px">DEIN HAUTTYP</div><div class="hero-type">${typeLabel}</div><div style="font-size:12px;opacity:0.85;margin-top:6px">${(skinData?.concerns||[]).join(" · ")}</div><div style="font-size:11px;opacity:0.7;margin-top:10px">Budget: ${budgetLabel}</div></div><div style="text-align:center"><div class="score-circle">${skinData?.score||70}</div><div style="font-size:10px;opacity:0.7;margin-top:6px">Score</div></div></div>${skinData?.summary?`<div class="summary"><h3>Analyse</h3>${skinData.summary}</div>`:""}<div class="section"><h2>Dein Wochenplan</h2><div style="font-size:12px;color:#64748b;margin-bottom:18px">Welches Produkt an welchem Tag – ✓ bedeutet Anwendung, – bedeutet Pause.</div><table class="week-table"><thead><tr><th>Produkt</th>${tage.map(t=>`<th>${t}</th>`).join("")}</tr></thead><tbody><tr class="time-row"><td colspan="8">☀ Morgens</td></tr>${allMorning}<tr class="time-row"><td colspan="8">☾ Abends</td></tr>${allEvening}</tbody></table></div><div class="section"><h2>Produkte im Detail</h2><div class="detail-grid">${alleProdukte.map(productDetailCard).join("")}</div><div class="rules"><strong>Wichtige Regeln:</strong><br>· Retinol und BHA niemals am gleichen Abend anwenden.<br>· SPF morgens ist bei Retinol-Anwendung Pflicht.<br>· Bei Rötungen oder Brennen: Aktivstoff pausieren.<br>· Neue Produkte erst am Unterarm testen.</div></div><div class="disc"><strong>Disclaimer:</strong> Diese App ersetzt keine medizinische Beratung.<br><br><strong>Datenschutz:</strong> Dein Foto wurde nicht gespeichert. Links können Affiliate-Links sein – für dich entsteht kein Aufpreis.</div></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "skyn-wochenplan.html";
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [tab, setTab] = useState("analyse");
  const [phase, setPhase] = useState("upload");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [photoMediaType, setPhotoMediaType] = useState("image/jpeg");
  const [skinType, setSkinType] = useState(null);
  const [skinData, setSkinData] = useState(null);
  const [issue, setIssue] = useState(null);
  const [budget, setBudget] = useState("midrange");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [loadingStep, setLoadingStep] = useState(0);
  const [regler, setRegler] = useState({ trockenheit: 50, fettigkeit: 50, empfindlichkeit: 30, unreinheiten: 40 });
  const fileRef = useRef();

  const STEPS = ["Foto wird geprüft", "Hauttyp wird bestimmt", "Selbsteinschätzung wird gewichtet", "Wirkstoffe werden zugeordnet", "Routine wird erstellt"];

  const reset = () => {
    setPhase("upload"); setPhotoUrl(null); setPhotoBase64(null); setPhotoMediaType("image/jpeg");
    setSkinType(null); setSkinData(null); setIssue(null); setLoadingStep(0);
    setRegler({ trockenheit: 50, fettigkeit: 50, empfindlichkeit: 30, unreinheiten: 40 });
  };

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    try {
      const base64 = await toBase64(file);
      if (!base64 || base64.length < 100) throw new Error("Base64 leer");
      setPhotoBase64(base64);
      let mt = "image/jpeg";
      if (base64.startsWith("iVBOR")) mt = "image/png";
      else if (base64.startsWith("R0lGOD")) mt = "image/gif";
      else if (base64.startsWith("UklGR")) mt = "image/webp";
      else if (file.type === "image/heic" || file.type === "image/heif" || file.name?.match(/\.heic$|\.heif$/i)) {
        throw new Error("HEIC-Format wird nicht unterstützt. iPhone-Einstellungen → Kamera → Formate → 'Maximale Kompatibilität'.");
      }
      setPhotoMediaType(mt);
      setPhase("regler");
    } catch (err) {
      console.error("[skyn] toBase64 failed:", err);
      setIssue("Foto konnte nicht verarbeitet werden: " + (err?.message || "unbekannter Fehler"));
      setPhase("rejected");
    }
  }, []);

  const startAnalyse = useCallback(async () => {
    setPhase("loading"); setLoadingStep(0);
    const timer = setInterval(() => setLoadingStep(s => s < STEPS.length - 1 ? s + 1 : s), 900);
    try {
      const result = await analyseHaut(photoBase64, regler, photoMediaType);
      clearInterval(timer);
      setLoadingStep(STEPS.length);
      if (!result.ok) {
        setIssue(result.issue || "Foto nicht geeignet");
        setTimeout(() => setPhase("rejected"), 300);
        return;
      }
      const st = ["combination", "dry", "oily"].includes(result.skinType) ? result.skinType : "combination";
      setSkinType(st); setSkinData(result);
      setTimeout(() => setPhase("result"), 500);
    } catch (err) {
      console.error("[skyn] analyseHaut failed:", err);
      clearInterval(timer);
      setIssue("Analyse fehlgeschlagen: " + (err?.message || "bitte erneut versuchen"));
      setPhase("rejected");
    }
  }, [photoBase64, regler, photoMediaType]);

  const routine = skinType ? buildRoutine(skinType, budget, regler, skinData?.concerns) : null;
  const typeLabel = skinType === "combination" ? "Mischhaut" : skinType === "dry" ? "Trockene Haut" : skinType === "oily" ? "Fettige Haut" : "";

  const personalReasons = {};
  if (skinType && skinData) {
    const elastizitaet = skinData.scores?.Elastizität ?? skinData.scores?.Elastizitaet ?? "-";
    const feuchtigkeit = skinData.scores?.Feuchtigkeit ?? "-";
    personalReasons[WIRKSTOFFE.vitaminC.name] = `Dein Score bei Elastizität (${elastizitaet}%) und die Analyse deiner Haut sprechen für antioxidativen Schutz am Morgen.`;
    personalReasons[WIRKSTOFFE.retinol.name] = regler.empfindlichkeit > 50 ? "Wir haben eine sanfte Retinol-Formulierung gewählt, weil deine Selbsteinschätzung auf erhöhte Empfindlichkeit hindeutet." : "Dein Hautbild profitiert vom klinischen Goldstandard gegen Zeichen der Hautalterung und Unreinheiten.";
    personalReasons[WIRKSTOFFE.bha.name] = `Bei deinem Wert für Unreinheiten (${regler.unreinheiten}%) ist BHA der effektivste Wirkstoff für saubere Poren.`;
    personalReasons[WIRKSTOFFE.niacinamid.name] = "Niacinamid verträgt sich mit allen anderen Wirkstoffen und stärkt deine Hautbarriere zusätzlich.";
    personalReasons[WIRKSTOFFE.ha.name] = `Dein Feuchtigkeits-Score (${feuchtigkeit}%) spricht für zusätzliche Hydration vor der Creme.`;
    personalReasons[WIRKSTOFFE.ceramide.name] = "Ceramide sind die Basis jeder Routine – sie versiegeln alle aktiven Wirkstoffe und schützen die Barriere.";
    personalReasons[WIRKSTOFFE.azelain.name] = "Azelainsäure ist bei deiner Empfindlichkeit die beste Wahl – wirksam und gleichzeitig verträglich.";
    personalReasons[WIRKSTOFFE.centella.name] = "Centella beruhigt aktiv gereizte Haut und passt perfekt zu deiner Empfindlichkeit.";
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" />

      <div style={{ padding: "14px 22px 12px", background: "white", borderBottom: "1px solid #eef0f3", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.03em", fontFamily: "'Lora', serif" }}>
          skyn<span style={{ color: "#3b82f6", fontStyle: "italic" }}>.</span>
        </div>
        {skinType ? (
          <div style={{ background: "#eff6ff", borderRadius: 99, padding: "4px 10px" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#1d4ed8" }}>{typeLabel}</span>
          </div>
        ) : (
          <div style={{ fontSize: 9, color: "#94a3b8", letterSpacing: "0.08em", fontWeight: 600 }}>EVIDENZBASIERT</div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        {tab === "analyse" && (
          <div>
            {phase === "upload" && (
              <div style={{ padding: "28px 22px" }}>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 30, fontWeight: 500, color: "#0f172a", lineHeight: 1.15, fontFamily: "'Lora', serif", letterSpacing: "-0.02em" }}>
                    Evidenzbasierte<br /><span style={{ fontStyle: "italic", color: "#3b82f6" }}>Hautpflege.</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#475569", marginTop: 14, lineHeight: 1.7 }}>
                    Ein Selfie genügt. Unsere KI analysiert deinen Hauttyp und erstellt eine personalisierte Routine — ausschließlich mit Produkten, deren Wirkstoffe durch Studien belegt sind.
                  </div>
                </div>
                <div onClick={() => fileRef.current?.click()} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 20, padding: "44px 20px", textAlign: "center", cursor: "pointer", background: "linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)", marginBottom: 14 }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>⊙</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", fontFamily: "'Lora', serif" }}>Selfie aufnehmen</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 6, lineHeight: 1.5 }}>Frontal · Augenhöhe · Tageslicht · ohne Make-up</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ""; }} />
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <div style={{ flex: 1, background: "white", border: "1px solid #eef0f3", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", fontFamily: "'Lora', serif" }}>9</div>
                    <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.3, marginTop: 2 }}>Geprüfte<br />Wirkstoffe</div>
                  </div>
                  <div style={{ flex: 1, background: "white", border: "1px solid #eef0f3", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", fontFamily: "'Lora', serif" }}>40+</div>
                    <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.3, marginTop: 2 }}>Studien<br />zitiert</div>
                  </div>
                  <div style={{ flex: 1, background: "white", border: "1px solid #eef0f3", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", fontFamily: "'Lora', serif" }}>0 €</div>
                    <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.3, marginTop: 2 }}>Kein Aufpreis<br />durch Affiliate</div>
                  </div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px", fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>
                  Keine medizinische Beratung · Fotos werden nicht gespeichert · Affiliate-Links ohne Aufpreis für dich
                </div>
              </div>
            )}

            {phase === "regler" && (
              <div style={{ padding: "24px 22px" }}>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6 }}>SCHRITT 2 VON 3</div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: "#0f172a", fontFamily: "'Lora', serif", lineHeight: 1.2, letterSpacing: "-0.02em" }}>Wie fühlt sich deine Haut an?</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, lineHeight: 1.6 }}>Deine Selbsteinschätzung ergänzt die Foto-Analyse.</div>
                </div>
                {[
                  { id: "trockenheit", label: "Trockenheit", hint: "Spannungsgefühl, Schuppen, raue Stellen" },
                  { id: "fettigkeit", label: "Fettigkeit", hint: "Glanz, vor allem in der T-Zone" },
                  { id: "empfindlichkeit", label: "Empfindlichkeit", hint: "Rötungen, Brennen bei neuen Produkten" },
                  { id: "unreinheiten", label: "Unreinheiten", hint: "Pickel, Mitesser, verstopfte Poren" },
                ].map((r) => {
                  const v = regler[r.id];
                  const label = v < 20 ? "Gar nicht" : v < 40 ? "Kaum" : v < 60 ? "Mittel" : v < 80 ? "Deutlich" : "Sehr stark";
                  return (
                    <div key={r.id} style={{ background: "white", borderRadius: 12, padding: 14, marginBottom: 10, border: "1px solid #eef0f3" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", fontFamily: "'Lora', serif" }}>{r.label}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6" }}>{label}</div>
                      </div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 10, lineHeight: 1.4 }}>{r.hint}</div>
                      <input type="range" min="0" max="100" value={v} onChange={(e) => setRegler({ ...regler, [r.id]: +e.target.value })} style={{ width: "100%", accentColor: "#3b82f6" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#cbd5e1", marginTop: 2 }}>
                        <span>Gar nicht</span><span>Sehr stark</span>
                      </div>
                    </div>
                  );
                })}
                <button onClick={startAnalyse} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#0f172a", color: "white", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10, fontFamily: "inherit" }}>Analyse starten →</button>
              </div>
            )}

            {phase === "loading" && (
              <div style={{ padding: "60px 22px", textAlign: "center" }}>
                {photoUrl && (
                  <div style={{ position: "relative", display: "inline-block", marginBottom: 28 }}>
                    <img src={photoUrl} alt="" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid #dbeafe" }} />
                    <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#3b82f6", animation: "spin 1s linear infinite" }} />
                  </div>
                )}
                <div style={{ fontSize: 18, fontWeight: 500, color: "#0f172a", marginBottom: 24, fontFamily: "'Lora', serif" }}>Analyse läuft</div>
                <div style={{ maxWidth: 300, margin: "0 auto", textAlign: "left" }}>
                  {STEPS.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", opacity: i > loadingStep ? 0.3 : 1, transition: "opacity 0.3s" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: i < loadingStep ? "#10b981" : i === loadingStep ? "#3b82f6" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {i < loadingStep ? "✓" : i === loadingStep ? "•" : ""}
                      </div>
                      <div style={{ fontSize: 12, color: i < loadingStep ? "#10b981" : i === loadingStep ? "#0f172a" : "#94a3b8", fontWeight: i === loadingStep ? 600 : 400 }}>{s}</div>
                    </div>
                  ))}
                </div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {phase === "rejected" && (
              <div style={{ padding: "24px 22px" }}>
                <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
                  {photoUrl && <img src={photoUrl} alt="" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid #fee2e2", marginBottom: 14, opacity: 0.6 }} />}
                  <div style={{ fontSize: 18, fontWeight: 500, color: "#dc2626", marginBottom: 6, fontFamily: "'Lora', serif" }}>Foto nicht geeignet</div>
                </div>
                <div style={{ background: "white", borderRadius: 12, padding: 14, marginBottom: 14, border: "1px solid #fee2e2" }}>
                  <span style={{ fontSize: 13, color: "#334155" }}>{issue}</span>
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#0f172a", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 8, fontFamily: "inherit" }}>Neues Foto aufnehmen</button>
                <button onClick={reset} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #e2e8f0", background: "none", color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Zurück zum Start</button>
                <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ""; }} />
              </div>
            )}

            {phase === "result" && skinData && (
              <div style={{ padding: "24px 22px" }}>
                {skinData._demo && (
                  <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#92400e", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>ⓘ</span>
                    <span><strong>Demo-Modus:</strong> API nicht erreichbar. Werte sind simuliert.</span>
                  </div>
                )}
                <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", borderRadius: 18, padding: 20, marginBottom: 14, color: "white", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                    <div>
                      <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: "0.12em", marginBottom: 4 }}>DEIN HAUTTYP</div>
                      <div style={{ fontSize: 24, fontWeight: 500, fontFamily: "'Lora', serif", letterSpacing: "-0.01em" }}>{typeLabel}</div>
                      <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>{(skinData.concerns || []).join(" · ")}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 600, fontFamily: "'Lora', serif", border: "1px solid rgba(255,255,255,0.25)" }}>{skinData.score || 70}</div>
                      <div style={{ fontSize: 9, opacity: 0.7, marginTop: 4 }}>Score</div>
                    </div>
                  </div>
                </div>
                <div style={{ background: "white", borderRadius: 12, padding: 14, marginBottom: 10, border: "1px solid #eef0f3", fontSize: 12.5, color: "#334155", lineHeight: 1.7 }}>{skinData.summary}</div>
                {skinData.scores && (
                  <div style={{ background: "white", borderRadius: 12, padding: 14, marginBottom: 14, border: "1px solid #eef0f3" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10 }}>Analyse-Details</div>
                    {Object.entries(skinData.scores).map(([k, v]) => <TraitBar key={k} label={k} value={v} />)}
                  </div>
                )}
                <button onClick={() => setTab("routine")} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#0f172a", color: "white", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 8, fontFamily: "inherit" }}>Meine Routine ansehen →</button>
                <button onClick={reset} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #e2e8f0", background: "none", color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Neues Foto</button>
              </div>
            )}
          </div>
        )}

        {tab === "routine" && (
          <div style={{ padding: "20px 22px" }}>
            {!routine ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#64748b" }}>Noch keine Analyse</div>
                <button onClick={() => setTab("analyse")} style={{ padding: "10px 22px", borderRadius: 99, background: "#3b82f6", color: "white", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Zur Analyse</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: "#0f172a", fontFamily: "'Lora', serif", letterSpacing: "-0.02em" }}>Deine Routine</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>Individuell auf deine Haut abgestimmt</div>
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {[["drogerie", "Drogerie"], ["midrange", "Mid-Range"], ["premium", "Premium"]].map(([id, label]) => (
                    <button key={id} onClick={() => setBudget(id)} style={{ flex: 1, padding: "9px 4px", borderRadius: 10, border: budget === id ? "1.5px solid #3b82f6" : "1px solid #e2e8f0", background: budget === id ? "#eff6ff" : "white", cursor: "pointer", fontSize: 11, fontWeight: 600, color: budget === id ? "#1d4ed8" : "#64748b", fontFamily: "inherit" }}>{label}</button>
                  ))}
                </div>
                <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 10, padding: 3, marginBottom: 16 }}>
                  {[["morning", "Morgens"], ["evening", "Abends"]].map(([id, label]) => (
                    <button key={id} onClick={() => setTimeOfDay(id)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: timeOfDay === id ? "white" : "transparent", color: timeOfDay === id ? "#0f172a" : "#64748b", fontWeight: timeOfDay === id ? 600 : 500, fontSize: 12, cursor: "pointer", fontFamily: "inherit", boxShadow: timeOfDay === id ? "0 1px 3px rgba(0,0,0,0.06)" : "none" }}>{label}</button>
                  ))}
                </div>
                {routine[timeOfDay].map((item, i) => (
                  <ProductCard key={i} item={item} idx={i} personalReason={personalReasons[item.name]} />
                ))}
                <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>Evidenzbasiert · Markenunabhängig · Affiliate-Links ohne Aufpreis</div>
              </>
            )}
          </div>
        )}

        {tab === "history" && (
          <div style={{ padding: "24px 22px" }}>
            {!routine ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#64748b" }}>Noch keine Analyse</div>
                <button onClick={() => setTab("analyse")} style={{ padding: "10px 22px", borderRadius: 99, background: "#3b82f6", color: "white", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Zur Analyse</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: "#0f172a", fontFamily: "'Lora', serif", letterSpacing: "-0.02em" }}>Dein persönlicher Plan</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 1.6 }}>Was deine Routine erreichen soll und wie sie strukturiert ist.</div>
                </div>

                <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", borderRadius: 16, padding: 18, marginBottom: 18, color: "white", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: "0.12em", marginBottom: 4 }}>PROFIL</div>
                      <div style={{ fontSize: 20, fontWeight: 500, fontFamily: "'Lora', serif" }}>{typeLabel}</div>
                      <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>{(skinData?.concerns || []).join(" · ")}</div>
                      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 8, letterSpacing: "0.05em" }}>Budget: {budget === "drogerie" ? "Drogerie" : budget === "midrange" ? "Mid-Range" : "Premium"}</div>
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 500, fontFamily: "'Lora', serif", border: "1px solid rgba(255,255,255,0.25)" }}>{skinData?.score || 70}</div>
                      <div style={{ fontSize: 9, opacity: 0.7, marginTop: 3 }}>Score</div>
                    </div>
                  </div>
                </div>

                {(() => {
                  const r = regler;
                  const c = (skinData?.concerns || []).join(" ").toLowerCase();
                  let ziel = "Balance halten und sanft verfeinern";
                  let zielDetail = "Deine Haut ist in guter Verfassung – der Plan stärkt Barriere und schützt vor Hautalterung.";
                  if (r.empfindlichkeit > 75) { ziel = "Haut beruhigen und Barriere aufbauen"; zielDetail = "Deine Empfindlichkeit steht im Vordergrund. Wir verzichten auf aggressive Säuren und setzen auf Beruhigung."; }
                  else if (r.unreinheiten > 60 && (/falt|linie|pigment/i.test(c))) { ziel = "Unreinheiten reduzieren und Hautbild verfeinern"; zielDetail = "Gleichzeitig gegen Unreinheiten, Poren und erste Alterungszeichen vorgehen."; }
                  else if (r.unreinheiten > 60) { ziel = "Unreinheiten reduzieren und Poren klären"; zielDetail = "Ziel ist eine sichtbar ruhigere Haut mit feineren Poren und weniger Mitessern."; }
                  else if (r.trockenheit > 65) { ziel = "Feuchtigkeit aufbauen und Barriere stärken"; zielDetail = "Der Fokus liegt auf nachhaltiger Hydration und Widerstandskraft gegen Umwelteinflüsse."; }
                  else if (/falt|linie|alter|elastiz|pigment/i.test(c)) { ziel = "Hautalterung vorbeugen und glätten"; zielDetail = "Antioxidativer Schutz am Tag, Zellerneuerung in der Nacht – der klinisch bewährte Doppelansatz."; }
                  return (
                    <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 12, border: "1px solid #eef0f3" }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Dein Hauptziel</div>
                      <div style={{ fontSize: 17, fontWeight: 500, color: "#0f172a", fontFamily: "'Lora', serif", lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 6 }}>{ziel}</div>
                      <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{zielDetail}</div>
                    </div>
                  );
                })()}

                {(() => {
                  const haupt = routine.hauptaktiv;
                  const sek = routine.sekundaer;
                  let strategie = "", rhythmus = "";
                  if (haupt === "Centella Asiatica") { strategie = "Keine Säuren – Fokus auf Beruhigung"; rhythmus = "Täglich Centella abends, kein Peeling"; }
                  else if (haupt === "Retinol" && sek === "BHA (Salicylsäure)") { strategie = "Retinol + BHA im Wechsel"; rhythmus = "Retinol 3×/Woche, BHA 3×/Woche – ein Pausetag"; }
                  else if (haupt === "Retinol") { strategie = "Retinol als Hauptaktivstoff"; rhythmus = "3× pro Woche abends"; }
                  else if (haupt === "BHA (Salicylsäure)") { strategie = "BHA gegen Unreinheiten"; rhythmus = "3× pro Woche abends"; }
                  else if (haupt === "Azelainsäure") { strategie = "Azelainsäure als sanfter Aktivstoff"; rhythmus = "Täglich abends möglich"; }
                  return (
                    <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 12, border: "1px solid #eef0f3" }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Strategie</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: "#0f172a", fontFamily: "'Lora', serif", marginBottom: 4 }}>{strategie}</div>
                      <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{rhythmus}</div>
                      <div style={{ display: "flex", gap: 10, marginTop: 12, paddingTop: 12, borderTop: "1px dashed #e2e8f0" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Morgens</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", fontFamily: "'Lora', serif", marginTop: 2 }}>{routine.morning.length} Schritte</div>
                        </div>
                        <div style={{ width: 1, background: "#e2e8f0" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Abends</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", fontFamily: "'Lora', serif", marginTop: 2 }}>{routine.evening.length} Schritte</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 20, border: "1px solid #eef0f3" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 12 }}>Dein Wochenrhythmus</div>
                  {(() => {
                    const haupt = routine.hauptaktiv;
                    const sek = routine.sekundaer;
                    const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
                    const getDayType = (idx) => {
                      if (haupt === "Retinol" && sek === "BHA (Salicylsäure)") {
                        if ([0, 2, 4].includes(idx)) return { label: "Retinol", color: "#3b82f6", bg: "#dbeafe" };
                        if ([1, 3, 5].includes(idx)) return { label: "BHA", color: "#4d7c0f", bg: "#ecfccb" };
                        return { label: "Pause", color: "#94a3b8", bg: "#f1f5f9" };
                      }
                      if (haupt === "Retinol") {
                        if ([0, 2, 4].includes(idx)) return { label: "Retinol", color: "#3b82f6", bg: "#dbeafe" };
                        return { label: "Basis", color: "#94a3b8", bg: "#f8fafc" };
                      }
                      if (haupt === "BHA (Salicylsäure)") {
                        if ([0, 2, 4].includes(idx)) return { label: "BHA", color: "#4d7c0f", bg: "#ecfccb" };
                        return { label: "Basis", color: "#94a3b8", bg: "#f8fafc" };
                      }
                      if (haupt === "Azelainsäure") return { label: "Azelain", color: "#9f1239", bg: "#fce7f3" };
                      return { label: "Basis", color: "#94a3b8", bg: "#f8fafc" };
                    };
                    return (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
                          {days.map((d, i) => {
                            const t = getDayType(i);
                            return (
                              <div key={d} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>{d}</div>
                                <div style={{ background: t.bg, borderRadius: 8, padding: "10px 2px", aspectRatio: "1/1.1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, marginBottom: 4 }} />
                                  <div style={{ fontSize: 8, color: t.color, fontWeight: 700, lineHeight: 1 }}>{t.label}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 12, lineHeight: 1.6 }}>
                          {haupt === "Retinol" && sek === "BHA (Salicylsäure)" ? "Retinol und BHA niemals am gleichen Abend. Sonntag ist Erholungstag für die Hautbarriere." : haupt === "Centella Asiatica" ? "Sanfte Routine ohne Säuren – perfekt für empfindliche Haut." : haupt === "Azelainsäure" ? "Azelainsäure kann täglich angewendet werden. Gut verträglich, auch für empfindliche Haut." : `${haupt} wird 3× pro Woche angewendet, dazwischen ist nur Basispflege aktiv.`}
                        </div>
                      </>
                    );
                  })()}
                </div>

                <button onClick={() => downloadWochenplan(skinData, skinType, budget, routine, regler)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#0f172a", color: "white", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Plan als PDF speichern</button>
                <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>Enthält alle Produkte, Anwendungshinweise und den Wochenrhythmus</div>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "white", borderTop: "1px solid #eef0f3", display: "flex" }}>
        {[["analyse", "ANALYSE"], ["routine", "ROUTINE"], ["history", "SPEICHERN"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer", color: tab === id ? "#3b82f6" : "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: "inherit" }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
