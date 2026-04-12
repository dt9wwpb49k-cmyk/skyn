import { useState, useRef, useCallback } from "react";

const BACKEND = "https://skyn-red.vercel.app";

const PRODUKTE = {
  combination: {
    drogerie: {
      morning: [
        { step: "Reinigung", name: "CeraVe Foaming Cleanser", brand: "CeraVe", price: "12,99 €", link: "https://www.lookfantastic.de/cerave-foaming-cleanser/11288806.html", ev: "B", evNote: "Ceramid-Reiniger schützt Hautbarriere." },
        { step: "Serum", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "RCTs: Talgregulation & Porenverfeinerung." },
        { step: "Feuchtigkeitspflege", name: "Neutrogena Hydro Boost Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "HA-Gel klinisch getestet." },
        { step: "Sonnenschutz ☀️", name: "Altruist Fluid SPF50", brand: "Altruist", price: "3,99 €", link: "https://www.amazon.de/s?k=altruist+spf+50", ev: "A", evNote: "SPF täglich = 24% weniger Hautalterung.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Simple Micellar Water", brand: "Simple", price: "4,99 €", link: "https://www.dm.de/simple-kind-to-skin-micellar-cleansing-water/", ev: "B", evNote: "Mizellenwasser klinisch bestätigt." },
        { step: "Exfoliant", name: "The Ordinary AHA 30% + BHA 2%", brand: "The Ordinary", price: "8,90 €", link: "https://www.notino.de/the-ordinary/aha-30-bha-2-peeling-solution/", ev: "A", evNote: "AHA/BHA RCT-belegt.", highlight: true, freq: "2× pro Woche" },
        { step: "Creme", name: "Neutrogena Hydro Boost Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "HA-Gel klinisch getestet." },
      ]
    },
    midrange: {
      morning: [
        { step: "Reinigung", name: "CeraVe Foaming Cleanser", brand: "CeraVe", price: "12,99 €", link: "https://www.lookfantastic.de/cerave-foaming-cleanser/11288806.html", ev: "B", evNote: "Ceramid-Reiniger." },
        { step: "Toner", name: "Paula's Choice 2% BHA", brand: "Paula's Choice", price: "18,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peeling/", ev: "A", evNote: ">20 RCTs, AAD-empfohlen." },
        { step: "Serum", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Talgregulation & Poren." },
        { step: "Sonnenschutz ☀️", name: "La Roche-Posay Anthelios SPF50+", brand: "La Roche-Posay", price: "19,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-anthelios-spf50/", ev: "A", evNote: "AAD-Goldstandard.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Simple Micellar Water", brand: "Simple", price: "4,99 €", link: "https://www.dm.de/simple-kind-to-skin-micellar-cleansing-water/", ev: "B", evNote: "Klinisch bestätigt." },
        { step: "Exfoliant", name: "The Ordinary AHA 30% + BHA 2%", brand: "The Ordinary", price: "8,90 €", link: "https://www.notino.de/the-ordinary/aha-30-bha-2-peeling-solution/", ev: "A", evNote: "AHA/BHA RCT-belegt.", highlight: true, freq: "2× pro Woche" },
        { step: "Serum", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Niacinamid: meistbelegter Wirkstoff." },
        { step: "Creme", name: "Neutrogena Hydro Boost Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "HA-Gel." },
      ]
    },
    premium: {
      morning: [
        { step: "Reinigung", name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/", ev: "C", evNote: "Hochwertig, limitierte RCT-Daten." },
        { step: "Toner", name: "Paula's Choice 2% BHA", brand: "Paula's Choice", price: "32,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peeling/", ev: "A", evNote: "Goldstandard für Poren." },
        { step: "Serum", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Bester Preis-Wirkung-Wirkstoff." },
        { step: "Sonnenschutz ☀️", name: "Isdin Eryfotona Actinica SPF100", brand: "Isdin", price: "38,00 €", link: "https://www.lookfantastic.de/isdin-eryfotona-actinica-spf100/", ev: "A", evNote: "SPF100 + Photolyase.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/", ev: "C", evNote: "Nährend." },
        { step: "Exfoliant", name: "The Ordinary AHA 30% + BHA 2%", brand: "The Ordinary", price: "8,90 €", link: "https://www.notino.de/the-ordinary/aha-30-bha-2-peeling-solution/", ev: "A", evNote: "AHA/BHA RCT-belegt.", highlight: true, freq: "2× pro Woche" },
        { step: "Serum", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Niacinamid." },
        { step: "Nachtcreme", name: "Laneige Water Sleeping Mask", brand: "Laneige", price: "29,00 €", link: "https://www.yesstyle.com/en/laneige-water-sleeping-mask/", ev: "B", evNote: "Overnight-Hydration klinisch bestätigt." },
      ]
    }
  },
  dry: {
    drogerie: {
      morning: [
        { step: "Reinigung", name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-hydrating-facial-cleanser/11288802.html", ev: "B", evNote: "Ceramide + HA klinisch belegt." },
        { step: "Serum", name: "The Inkey List Hyaluronic Acid", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list-hyaluronic-acid-serum/", ev: "B", evNote: "HA bindet 1000× ihr Gewicht an Wasser." },
        { step: "Creme", name: "Neutrogena Hydro Boost Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "Klinisch getestet." },
        { step: "Sonnenschutz ☀️", name: "Altruist Fluid SPF50", brand: "Altruist", price: "3,99 €", link: "https://www.amazon.de/s?k=altruist+spf+50", ev: "A", evNote: "SPF täglich = 24% weniger Hautalterung.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-hydrating-facial-cleanser/11288802.html", ev: "B", evNote: "Ceramid-Reiniger." },
        { step: "Serum", name: "The Inkey List Hyaluronic Acid", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list-hyaluronic-acid-serum/", ev: "B", evNote: "HA klinisch belegt." },
        { step: "Öl", name: "The Ordinary Rosehip Seed Oil", brand: "The Ordinary", price: "10,90 €", link: "https://www.notino.de/the-ordinary/100-organisches-kaltgepresstes-hagebuttenoel/", ev: "B", evNote: "Klinisch belegt.", highlight: true, freq: "3–4× pro Woche" },
      ]
    },
    midrange: {
      morning: [
        { step: "Reinigung", name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-hydrating-facial-cleanser/11288802.html", ev: "B", evNote: "Ceramide + HA klinisch belegt." },
        { step: "Essence", name: "Hada Labo Gokujyun Lotion", brand: "Hada Labo", price: "16,50 €", link: "https://www.yesstyle.com/en/hada-labo-gokujyun-premium-lotion/", ev: "B", evNote: "Multi-HA verschiedene Penetrationstiefen." },
        { step: "Serum", name: "The Inkey List Hyaluronic Acid", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list-hyaluronic-acid-serum/", ev: "B", evNote: "HA klinisch belegt." },
        { step: "Sonnenschutz ☀️", name: "La Roche-Posay Anthelios SPF50+", brand: "La Roche-Posay", price: "19,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-anthelios-spf50/", ev: "A", evNote: "AAD-Goldstandard.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-hydrating-facial-cleanser/11288802.html", ev: "B", evNote: "Ceramid-Reiniger." },
        { step: "Serum", name: "The Inkey List Hyaluronic Acid", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list-hyaluronic-acid-serum/", ev: "B", evNote: "HA klinisch belegt." },
        { step: "Öl", name: "The Ordinary Rosehip Seed Oil", brand: "The Ordinary", price: "10,90 €", link: "https://www.notino.de/the-ordinary/100-organisches-kaltgepresstes-hagebuttenoel/", ev: "B", evNote: "Klinisch belegt.", highlight: true, freq: "3–4× pro Woche" },
        { step: "Nachtcreme", name: "Laneige Water Sleeping Mask", brand: "Laneige", price: "29,00 €", link: "https://www.yesstyle.com/en/laneige-water-sleeping-mask/", ev: "B", evNote: "Overnight-Hydration." },
      ]
    },
    premium: {
      morning: [
        { step: "Reinigung", name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/", ev: "C", evNote: "Hochwertig." },
        { step: "Essence", name: "Hada Labo Gokujyun Lotion", brand: "Hada Labo", price: "16,50 €", link: "https://www.yesstyle.com/en/hada-labo-gokujyun-premium-lotion/", ev: "B", evNote: "Bestes HA-Produkt." },
        { step: "Serum", name: "The Inkey List Hyaluronic Acid", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list-hyaluronic-acid-serum/", ev: "B", evNote: "HA klinisch belegt." },
        { step: "Sonnenschutz ☀️", name: "Isdin Eryfotona Actinica SPF100", brand: "Isdin", price: "38,00 €", link: "https://www.lookfantastic.de/isdin-eryfotona-actinica-spf100/", ev: "A", evNote: "SPF100 + Photolyase.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/", ev: "C", evNote: "Nährend." },
        { step: "Serum", name: "The Inkey List Hyaluronic Acid", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list-hyaluronic-acid-serum/", ev: "B", evNote: "HA klinisch belegt." },
        { step: "Öl", name: "The Ordinary Rosehip Seed Oil", brand: "The Ordinary", price: "10,90 €", link: "https://www.notino.de/the-ordinary/100-organisches-kaltgepresstes-hagebuttenoel/", ev: "B", evNote: "Klinisch belegt.", highlight: true, freq: "3–4× pro Woche" },
        { step: "Nachtcreme", name: "Laneige Water Sleeping Mask", brand: "Laneige", price: "29,00 €", link: "https://www.yesstyle.com/en/laneige-water-sleeping-mask/", ev: "B", evNote: "Overnight-Hydration." },
      ]
    }
  },
  oily: {
    drogerie: {
      morning: [
        { step: "Reinigung", name: "Cetaphil Gentle Skin Cleanser", brand: "Cetaphil", price: "10,99 €", link: "https://www.shop-apotheke.com/beauty/cetaphil-gentle-skin-cleanser/", ev: "B", evNote: "AAD-empfohlen." },
        { step: "Serum", name: "The Ordinary Niacinamide 10% + Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "52% Mitesser-Reduktion im RCT." },
        { step: "Gel", name: "Neutrogena Hydro Boost Water Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "Ölfrei, klinisch getestet." },
        { step: "Sonnenschutz ☀️", name: "Altruist Fluid SPF50", brand: "Altruist", price: "3,99 €", link: "https://www.amazon.de/s?k=altruist+spf+50", ev: "A", evNote: "SPF täglich = 24% weniger Hautalterung.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Cetaphil Gentle Skin Cleanser", brand: "Cetaphil", price: "10,99 €", link: "https://www.shop-apotheke.com/beauty/cetaphil-gentle-skin-cleanser/", ev: "B", evNote: "AAD-empfohlen." },
        { step: "Exfoliant", name: "COSRX AHA/BHA Toner", brand: "COSRX", price: "18,00 €", link: "https://www.yesstyle.com/en/cosrx-aha-bha-clarifying-treatment-toner/", ev: "B", evNote: "Täglich nutzbar." },
        { step: "Retinol", name: "The Ordinary Retinol 0.5%", brand: "The Ordinary", price: "6,50 €", link: "https://www.notino.de/the-ordinary/retinol-0-5-in-squalan/", ev: "A", evNote: ">100 RCTs, FDA-anerkannt.", highlight: true, freq: "3× pro Woche" },
      ]
    },
    midrange: {
      morning: [
        { step: "Reinigung", name: "La Roche-Posay Effaclar Gel", brand: "La Roche-Posay", price: "14,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-effaclar-gel/", ev: "B", evNote: "Klinisch getestet." },
        { step: "Toner", name: "Paula's Choice 2% BHA", brand: "Paula's Choice", price: "32,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peeling/", ev: "A", evNote: "Goldstandard für Poren." },
        { step: "Serum", name: "The Ordinary Niacinamide 10% + Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "52% Mitesser-Reduktion." },
        { step: "Sonnenschutz ☀️", name: "La Roche-Posay Anthelios SPF50+", brand: "La Roche-Posay", price: "19,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-anthelios-spf50/", ev: "A", evNote: "AAD-Goldstandard.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "La Roche-Posay Effaclar Gel", brand: "La Roche-Posay", price: "14,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-effaclar-gel/", ev: "B", evNote: "Klinisch getestet." },
        { step: "Exfoliant", name: "COSRX AHA/BHA Toner", brand: "COSRX", price: "18,00 €", link: "https://www.yesstyle.com/en/cosrx-aha-bha-clarifying-treatment-toner/", ev: "B", evNote: "Täglich nutzbar." },
        { step: "Retinol", name: "The Ordinary Retinol 0.5%", brand: "The Ordinary", price: "6,50 €", link: "https://www.notino.de/the-ordinary/retinol-0-5-in-squalan/", ev: "A", evNote: ">100 RCTs.", highlight: true, freq: "3× pro Woche" },
        { step: "Gel", name: "Neutrogena Hydro Boost Water Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "Ölfrei." },
      ]
    },
    premium: {
      morning: [
        { step: "Reinigung", name: "La Roche-Posay Effaclar Gel", brand: "La Roche-Posay", price: "14,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-effaclar-gel/", ev: "B", evNote: "Klinisch getestet." },
        { step: "Toner", name: "Paula's Choice 2% BHA", brand: "Paula's Choice", price: "32,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peeling/", ev: "A", evNote: "Bestes BHA." },
        { step: "Serum", name: "The Ordinary Niacinamide 10% + Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Unschlagbar." },
        { step: "Sonnenschutz ☀️", name: "Isdin Eryfotona Actinica SPF100", brand: "Isdin", price: "38,00 €", link: "https://www.lookfantastic.de/isdin-eryfotona-actinica-spf100/", ev: "A", evNote: "SPF100 + Photolyase.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/", ev: "C", evNote: "Luxuriös." },
        { step: "Toner", name: "Paula's Choice 2% BHA", brand: "Paula's Choice", price: "32,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peeling/", ev: "A", evNote: "Goldstandard." },
        { step: "Retinol", name: "The Ordinary Retinol 0.5%", brand: "The Ordinary", price: "6,50 €", link: "https://www.notino.de/the-ordinary/retinol-0-5-in-squalan/", ev: "A", evNote: ">100 RCTs.", highlight: true, freq: "3× pro Woche" },
        { step: "Nachtcreme", name: "Laneige Water Sleeping Mask", brand: "Laneige", price: "29,00 €", link: "https://www.yesstyle.com/en/laneige-water-sleeping-mask/", ev: "B", evNote: "Overnight-Hydration." },
      ]
    }
  }
};

const PROFILE_INFO = {
  combination: { type: "Mischhaut", emoji: "⚖️", score: 72, traits: { Feuchtigkeit: 45, Talgproduktion: 65, Empfindlichkeit: 30, Elastizität: 70 }, concerns: ["T-Zone Glanz", "Vergrößerte Poren", "Leichte Unreinheiten"], summary: "Die T-Zone neigt zu erhöhter Talgproduktion, während die Wangen normal bis leicht trocken sind." },
  dry: { type: "Trockene Haut", emoji: "🌿", score: 58, traits: { Feuchtigkeit: 22, Talgproduktion: 18, Empfindlichkeit: 60, Elastizität: 45 }, concerns: ["Trockenheitsgefühl", "Spannungsgefühl", "Feine Linien"], summary: "Deine Haut produziert wenig Talg und verliert schnell Feuchtigkeit. Priorität: Barriere stärken." },
  oily: { type: "Fettige Haut", emoji: "💧", score: 65, traits: { Feuchtigkeit: 68, Talgproduktion: 88, Empfindlichkeit: 25, Elastizität: 80 }, concerns: ["Übermäßiger Glanz", "Mitesser", "Unreinheiten"], summary: "Deine Haut produziert viel Talg. Mit BHA, Niacinamid und Retinol bekommst du Poren unter Kontrolle." },
};
async function analyseHaut(base64) {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
        { type: "text", text: `Schau dir dieses Bild an und antworte NUR mit JSON.\n\nWenn KEIN Gesicht sichtbar: {"ok":false,"issue":"Kein Gesicht erkannt — bitte Selfie aufnehmen"}\nWenn von unten: {"ok":false,"issue":"Kamera zu weit unten — auf Augenhöhe halten"}\nWenn von oben: {"ok":false,"issue":"Kamera zu weit oben — auf Augenhöhe halten"}\nWenn zu dunkel/unscharf: {"ok":false,"issue":"Zu dunkel oder unscharf"}\nWenn normales Selfie: {"ok":true,"skinType":"combination"} oder "dry" oder "oily"\n\nNur JSON.` }
      ]
    }]
  };

  const res = await fetch(`${BACKEND}/api/analyse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.type === "error") throw new Error(data.error?.type);
  const text = data.content?.[0]?.text || "";
  const match = text.match(/\{[^{}]*\}/);
  if (!match) throw new Error("Keine Antwort");
  return JSON.parse(match[0]);
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function TraitBar({ label, value }) {
  const c = { Feuchtigkeit: "#3b82f6", Talgproduktion: "#f59e0b", Empfindlichkeit: "#ef4444", Elastizität: "#10b981" };
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: "#6b7280" }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>{value}%</span>
      </div>
      <div style={{ height: 3, background: "#f0f0f0", borderRadius: 99 }}>
        <div style={{ height: 3, borderRadius: 99, background: c[label] || "#3b82f6", width: value + "%" }} />
      </div>
    </div>
  );
}

function ProductCard({ item, idx }) {
  const [evOpen, setEvOpen] = useState(false);
  const ev = { A: ["#dcfce7","#15803d","★★★"], B: ["#dbeafe","#1d4ed8","★★☆"], C: ["#fef9c3","#92400e","★☆☆"] }[item.ev] || ["#f0f0f0","#6b7280","★☆☆"];
  return (
    <div style={{ background: "white", borderRadius: 12, padding: 12, marginBottom: 8, border: item.spf ? "1.5px solid #fde68a" : item.highlight ? "1.5px solid #bfdbfe" : "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: item.spf ? "#fef9c3" : "#f0f7ff", color: item.spf ? "#92400e" : "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
          {item.spf ? "☀" : idx + 1}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em" }}>{item.step}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{item.name}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{item.brand}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{item.price}</div>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, background: "#111827", color: "white", padding: "3px 9px", borderRadius: 99, textDecoration: "none", fontWeight: 600, display: "inline-block", marginTop: 3 }}>Kaufen →</a>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
            {item.freq && <span style={{ fontSize: 9, background: "#fff7ed", color: "#c2410c", padding: "2px 6px", borderRadius: 99, fontWeight: 600 }}>⚠ {item.freq}</span>}
            <button onClick={() => setEvOpen(v => !v)} style={{ fontSize: 9, background: ev[0], color: ev[1], padding: "2px 6px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 600 }}>
              {ev[2]} Evidenz {item.ev} {evOpen ? "▲" : "▼"}
            </button>
          </div>
          {evOpen && <div style={{ marginTop: 5, fontSize: 10, color: ev[1], background: ev[0], borderRadius: 6, padding: "4px 8px", lineHeight: 1.6 }}>{item.evNote}</div>}
        </div>
      </div>
    </div>
  );
}
export default function App() {
  const [tab, setTab] = useState("analyse");
  const [phase, setPhase] = useState("upload");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [skinType, setSkinType] = useState(null);
  const [issue, setIssue] = useState(null);
  const [budget, setBudget] = useState("drogerie");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [history, setHistory] = useState([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileRef = useRef();
  const STEPS = ["Foto wird geprüft...", "Hauttyp wird bestimmt...", "Routine wird erstellt..."];

  const reset = () => { setPhase("upload"); setPhotoUrl(null); setSkinType(null); setIssue(null); setLoadingStep(0); };

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPhase("loading");
    setLoadingStep(0);
    const timer = setInterval(() => setLoadingStep(s => s < STEPS.length - 1 ? s + 1 : s), 1200);
    try {
      const base64 = await toBase64(file);
      const result = await analyseHaut(base64);
      clearInterval(timer);
      if (!result.ok) { setIssue(result.issue || "Foto nicht geeignet"); setPhase("rejected"); return; }
      const st = ["combination","dry","oily"].includes(result.skinType) ? result.skinType : "combination";
      setSkinType(st);
      setTimeout(() => {
        setPhase("result");
        const info = PROFILE_INFO[st];
        setHistory(prev => [{ url, type: info.type, score: info.score, date: new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) }, ...prev]);
      }, 400);
    } catch (err) {
      clearInterval(timer);
      setIssue("Analyse fehlgeschlagen — bitte erneut versuchen");
      setPhase("rejected");
    }
  }, []);

  const info = skinType ? PROFILE_INFO[skinType] : null;
  const produkte = skinType ? PRODUKTE[skinType][budget] : null;

  return (
    <div style={{ fontFamily: "-apple-system, sans-serif", maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 20px 12px", background: "white", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>skyn<span style={{ color: "#3b82f6" }}>.</span></div>
        {info && <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#eff6ff", borderRadius: 99, padding: "4px 10px" }}><span style={{ fontSize: 11 }}>{info.emoji}</span><span style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6" }}>{info.type}</span></div>}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        {tab === "analyse" && (
          <div style={{ padding: 20 }}>
            {phase === "upload" && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>Foto rein.<br /><span style={{ color: "#3b82f6" }}>Routine raus.</span></div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6, lineHeight: 1.6 }}>Ein Selfie — KI analysiert Hauttyp und erstellt deine Routine.</div>
                </div>
                <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #dbeafe", borderRadius: 20, padding: "48px 20px", textAlign: "center", cursor: "pointer", background: "#f0f7ff", marginBottom: 12 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1d4ed8" }}>Selfie aufnehmen</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Frontal · Augenhöhe · Tageslicht · kein Make-up</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ""; }} />
                <div style={{ background: "#f9fafb", borderRadius: 10, padding: "8px 12px", fontSize: 10, color: "#9ca3af" }}>⚠️ Keine medizinische Beratung · Fotos nicht gespeichert · Affiliate-Links</div>
              </>
            )}

            {phase === "loading" && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                {photoUrl && <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}><img src={photoUrl} alt="" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid #dbeafe" }} /><div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#3b82f6", animation: "spin 1s linear infinite" }} /></div>}
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Analyse läuft</div>
                {STEPS.map((s, i) => <div key={i} style={{ fontSize: 12, marginBottom: 8, color: i < loadingStep ? "#16a34a" : i === loadingStep ? "#3b82f6" : "#d1d5db", fontWeight: i === loadingStep ? 600 : 400 }}>{i < loadingStep ? "✓" : i === loadingStep ? "›" : "·"} {s}</div>)}
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {phase === "rejected" && (
              <>
                <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
                  {photoUrl && <img src={photoUrl} alt="" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid #fee2e2", marginBottom: 14, opacity: 0.6 }} />}
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>Foto nicht geeignet</div>
                </div>
                <div style={{ background: "white", borderRadius: 12, padding: 14, marginBottom: 14, border: "1px solid #fee2e2" }}>
                  <div style={{ display: "flex", gap: 8 }}><span style={{ color: "#ef4444" }}>→</span><span style={{ fontSize: 13, color: "#374151" }}>{issue}</span></div>
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#111827", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>📸 Neues Foto aufnehmen</button>
                <button onClick={reset} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "none", color: "#6b7280", fontSize: 12, cursor: "pointer" }}>Zurück</button>
                <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ""; }} />
              </>
            )}

            {phase === "result" && info && (
              <>
                <div style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", borderRadius: 16, padding: 16, marginBottom: 12, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 11, opacity: 0.75, marginBottom: 2 }}>DEIN HAUTTYP</div><div style={{ fontSize: 20, fontWeight: 800 }}>{info.emoji} {info.type}</div><div style={{ fontSize: 11, opacity: 0.8, marginTop: 3 }}>{info.concerns.join(" · ")}</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>{info.score}</div><div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>Score</div></div>
                </div>
                <div style={{ background: "white", borderRadius: 12, padding: 12, marginBottom: 10, border: "1px solid #f0f0f0", fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{info.summary}</div>
                <div style={{ background: "white", borderRadius: 12, padding: 12, marginBottom: 10, border: "1px solid #f0f0f0" }}>{Object.entries(info.traits).map(([k,v]) => <TraitBar key={k} label={k} value={v} />)}</div>
                <button onClick={() => setTab("routine")} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#111827", color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>Meine Routine ansehen →</button>
                <button onClick={reset} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "none", color: "#6b7280", fontSize: 12, cursor: "pointer" }}>Neues Foto</button>
              </>
            )}
          </div>
        )}

        {tab === "routine" && (
          <div style={{ padding: 20 }}>
            {!skinType ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>☀️</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Noch keine Analyse</div>
                <button onClick={() => setTab("analyse")} style={{ padding: "10px 22px", borderRadius: 99, background: "#3b82f6", color: "white", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Zur Analyse →</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {[["drogerie","💚","Drogerie","#16a34a","#f0fdf4"],["midrange","💙","Mid-Range","#1d4ed8","#eff6ff"],["premium","💜","Premium","#7c3aed","#f5f3ff"]].map(([id,emoji,label,col,bg]) => (
                    <button key={id} onClick={() => setBudget(id)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `1.5px solid ${budget===id?col:"#e5e7eb"}`, background: budget===id?bg:"white", cursor: "pointer", textAlign: "center" }}>
                      <div style={{ fontSize: 14 }}>{emoji}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: budget===id?col:"#6b7280", marginTop: 1 }}>{label}</div>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", background: "#f0f0f0", borderRadius: 10, padding: 3, marginBottom: 14 }}>
                  {[["morning","☀️ Morgens"],["evening","🌙 Abends"]].map(([id,label]) => (
                    <button key={id} onClick={() => setTimeOfDay(id)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: timeOfDay===id?"white":"none", color: timeOfDay===id?"#111827":"#6b7280", fontWeight: timeOfDay===id?700:400, fontSize: 12, cursor: "pointer", boxShadow: timeOfDay===id?"0 1px 3px rgba(0,0,0,0.08)":"none" }}>{label}</button>
                  ))}
                </div>
                {produkte && produkte[timeOfDay].map((item,i) => <ProductCard key={i} item={item} idx={i} />)}
                <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", marginTop: 10 }}>Markenunabhängig · Evidenzbasiert · Affiliate-Links, kein Aufpreis</div>
              </>
            )}
          </div>
        )}

        {tab === "history" && (
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 16 }}>Verlauf</div>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}><div style={{ fontSize: 32, marginBottom: 8 }}>📈</div><div style={{ fontSize: 13 }}>Nach deiner ersten Analyse erscheint sie hier.</div></div>
            ) : history.map((e,i) => (
              <div key={i} style={{ background: "white", borderRadius: 12, padding: 12, marginBottom: 8, border: "1px solid #f0f0f0", display: "flex", gap: 10, alignItems: "center" }}>
                <img src={e.url} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{e.type}</div><div style={{ fontSize: 11, color: "#9ca3af" }}>{e.date}</div></div>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: e.score>70?"#dcfce7":e.score>55?"#fef9c3":"#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: e.score>70?"#16a34a":e.score>55?"#ca8a04":"#dc2626" }}>{e.score}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "white", borderTop: "1px solid #f0f0f0", display: "flex", paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
        {[["analyse","◎","ANALYSE"],["routine","☀","ROUTINE"],["history","📈","VERLAUF"]].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer", color: tab===id?"#3b82f6":"#9ca3af", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 17 }}>{icon}</span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
