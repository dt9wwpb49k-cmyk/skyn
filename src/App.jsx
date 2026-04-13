import { useState, useRef, useCallback } from "react";

const BACKEND = "https://skyn-red.vercel.app";

const PRODUKTE = {
  combination: {
    drogerie: {
      morning: [
        { step: "Reinigung", name: "CeraVe Foaming Cleanser", brand: "CeraVe", price: "12,99 €", link: "https://www.lookfantastic.de/cerave-foaming-cleanser/11288806.html", ev: "B", evNote: "Ceramid-Reiniger schuetzt Hautbarriere." },
        { step: "Vitamin C Serum", name: "LOreal Revitalift 12% Vitamin C", brand: "LOreal", price: "14,99 €", link: "https://www.dm.de/l-oreal-paris-revitalift-clinical-vitamin-c-serum/", ev: "A", evNote: "Vitamin C morgens: hemmt Talg, schuetzt vor freien Radikalen, hellt Pigmentflecken auf." },
        { step: "Serum", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "RCTs: Talgregulation und Porenverfeinerung." },
        { step: "Feuchtigkeitspflege", name: "Neutrogena Hydro Boost Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "HA-Gel klinisch getestet." },
        { step: "Sonnenschutz", name: "Altruist Fluid SPF50", brand: "Altruist", price: "3,99 €", link: "https://www.amazon.de/s?k=altruist+spf+50", ev: "A", evNote: "SPF taeglich = 24% weniger Hautalterung.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Simple Micellar Water", brand: "Simple", price: "4,99 €", link: "https://www.dm.de/simple-kind-to-skin-micellar-cleansing-water/", ev: "B", evNote: "Mizellenwasser klinisch bestaetigt." },
        { step: "BHA Exfoliant", name: "The Ordinary AHA 30% BHA 2%", brand: "The Ordinary", price: "8,90 €", link: "https://www.notino.de/the-ordinary/aha-30-bha-2-peeling-solution/", ev: "A", evNote: "AHA/BHA RCT-belegt. Nicht gleichzeitig mit Retinol.", highlight: true, freq: "2-3x pro Woche" },
        { step: "Serum", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Niacinamid beruhigt nach Exfoliation." },
        { step: "Retinol", name: "The Ordinary Retinol 0.5%", brand: "The Ordinary", price: "6,50 €", link: "https://www.notino.de/the-ordinary/retinol-0-5-in-squalan/", ev: "A", evNote: "FDA-anerkannt. Abwechselnd mit BHA anwenden.", highlight: true, freq: "3x pro Woche - abwechselnd mit BHA" },
        { step: "Creme", name: "Neutrogena Hydro Boost Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "HA-Gel als Abschluss nach Retinol." },
      ]
    },
    midrange: {
      morning: [
        { step: "Reinigung", name: "CeraVe Foaming Cleanser", brand: "CeraVe", price: "12,99 €", link: "https://www.lookfantastic.de/cerave-foaming-cleanser/11288806.html", ev: "B", evNote: "Ceramid-Reiniger." },
        { step: "Vitamin C Serum", name: "Garnier Vitamin C Serum", brand: "Garnier", price: "12,99 €", link: "https://www.dm.de/garnier-skin-active-vitamin-c-serum/", ev: "A", evNote: "Vitamin C morgens: Strahlkraft, Talgkontrolle, Schutz." },
        { step: "BHA Toner", name: "Paulas Choice 2% BHA", brand: "Paulas Choice", price: "18,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peeling/", ev: "A", evNote: "20 RCTs, AAD-empfohlen.", freq: "Taeglich morgens" },
        { step: "Feuchtigkeitspflege", name: "Neutrogena Hydro Boost Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "HA-Gel oelfrei." },
        { step: "Sonnenschutz", name: "La Roche-Posay Anthelios SPF50", brand: "La Roche-Posay", price: "19,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-anthelios-spf50/", ev: "A", evNote: "AAD-Goldstandard.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "CeraVe Foaming Cleanser", brand: "CeraVe", price: "12,99 €", link: "https://www.lookfantastic.de/cerave-foaming-cleanser/11288806.html", ev: "B", evNote: "Ceramid-Reiniger." },
        { step: "Serum", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Niacinamid vor Retinol." },
        { step: "Retinol", name: "La Roche-Posay Redermic Retinol", brand: "La Roche-Posay", price: "25,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-redermic-retinol/", ev: "A", evNote: "Sanfter als The Ordinary, ideal fuer Einsteiger.", highlight: true, freq: "3x pro Woche" },
        { step: "Creme", name: "Neutrogena Hydro Boost Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "HA-Gel nach Retinol." },
      ]
    },
    premium: {
      morning: [
        { step: "Reinigung", name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/", ev: "C", evNote: "Luxurioese Reinigung." },
        { step: "Vitamin C Serum", name: "Paulas Choice C15 Super Booster", brand: "Paulas Choice", price: "48,00 €", link: "https://www.paulaschoice.de/c15-super-booster/", ev: "A", evNote: "15% Vitamin C: staerkste klinische Evidenz." },
        { step: "BHA Toner", name: "Paulas Choice 2% BHA", brand: "Paulas Choice", price: "32,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peeling/", ev: "A", evNote: "Goldstandard fuer Poren.", freq: "Taeglich morgens" },
        { step: "Feuchtigkeitspflege", name: "Neutrogena Hydro Boost Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "HA-Gel." },
        { step: "Sonnenschutz", name: "Isdin Eryfotona Actinica SPF100", brand: "Isdin", price: "38,00 €", link: "https://www.lookfantastic.de/isdin-eryfotona-actinica-spf100/", ev: "A", evNote: "SPF100 und Photolyase.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/", ev: "C", evNote: "Naehrend." },
        { step: "Serum", name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Niacinamid vor Retinol." },
        { step: "Retinol", name: "Paulas Choice 1% Retinol", brand: "Paulas Choice", price: "62,00 €", link: "https://www.paulaschoice.de/clinical-1pct-retinol-treatment/", ev: "A", evNote: "1% Retinol: staerkste klinische Dosis.", highlight: true, freq: "3x pro Woche" },
        { step: "Nachtcreme", name: "Laneige Water Sleeping Mask", brand: "Laneige", price: "29,00 €", link: "https://www.yesstyle.com/en/laneige-water-sleeping-mask/", ev: "B", evNote: "Overnight-Hydration nach Retinol." },
      ]
    }
  },
  dry: {
    drogerie: {
      morning: [
        { step: "Reinigung", name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-hydrating-facial-cleanser/11288802.html", ev: "B", evNote: "Ceramide und HA klinisch belegt." },
        { step: "Vitamin C Serum", name: "LOreal Revitalift 12% Vitamin C", brand: "LOreal", price: "14,99 €", link: "https://www.dm.de/l-oreal-paris-revitalift-clinical-vitamin-c-serum/", ev: "A", evNote: "Vitamin C morgens: Kollagenproduktion, Schutz, Strahlkraft." },
        { step: "HA Serum", name: "The Inkey List Hyaluronic Acid", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list-hyaluronic-acid-serum/", ev: "B", evNote: "HA klinisch belegt." },
        { step: "Creme", name: "First Aid Beauty Ultra Repair Cream", brand: "First Aid Beauty", price: "18,00 €", link: "https://www.lookfantastic.de/first-aid-beauty-ultra-repair-cream/", ev: "B", evNote: "Reichhaltige Creme fuer trockene Haut." },
        { step: "Sonnenschutz", name: "Altruist Fluid SPF50", brand: "Altruist", price: "3,99 €", link: "https://www.amazon.de/s?k=altruist+spf+50", ev: "A", evNote: "SPF taeglich unverzichtbar.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-hydrating-facial-cleanser/11288802.html", ev: "B", evNote: "Sanfte Reinigung ohne Austrocknen." },
        { step: "HA Serum", name: "The Inkey List Hyaluronic Acid", brand: "The Inkey List", price: "9,99 €", link: "https://www.lookfantastic.de/the-inkey-list-hyaluronic-acid-serum/", ev: "B", evNote: "HA vor Retinol aufpolstern." },
        { step: "Retinol", name: "The Ordinary Retinol 0.5%", brand: "The Ordinary", price: "6,50 €", link: "https://www.notino.de/the-ordinary/retinol-0-5-in-squalan/", ev: "A", evNote: "Auch trockene Haut braucht Retinol - mit reichhaltiger Creme kombinieren.", highlight: true, freq: "1-2x pro Woche" },
        { step: "Oel", name: "The Ordinary Rosehip Seed Oil", brand: "The Ordinary", price: "10,90 €", link: "https://www.notino.de/the-ordinary/100-organisches-kaltgepresstes-hagebuttenoel/", ev: "B", evNote: "Rosehip Oil nach Retinol: beruhigt und naehrt.", freq: "3-4x pro Woche" },
        { step: "Nachtcreme", name: "First Aid Beauty Ultra Repair Cream", brand: "First Aid Beauty", price: "18,00 €", link: "https://www.lookfantastic.de/first-aid-beauty-ultra-repair-cream/", ev: "B", evNote: "Reichhaltige Creme versiegelt Feuchtigkeit nach Retinol." },
      ]
    },
    midrange: {
      morning: [
        { step: "Reinigung", name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-hydrating-facial-cleanser/11288802.html", ev: "B", evNote: "Ceramide und HA klinisch belegt." },
        { step: "Vitamin C Serum", name: "Garnier Vitamin C Serum", brand: "Garnier", price: "12,99 €", link: "https://www.dm.de/garnier-skin-active-vitamin-c-serum/", ev: "A", evNote: "Vitamin C morgens: Kollagen, Strahlkraft, Schutz." },
        { step: "Essence", name: "Hada Labo Gokujyun Lotion", brand: "Hada Labo", price: "16,50 €", link: "https://www.yesstyle.com/en/hada-labo-gokujyun-premium-lotion/", ev: "B", evNote: "Multi-HA verschiedene Penetrationstiefen." },
        { step: "Creme", name: "First Aid Beauty Ultra Repair Cream", brand: "First Aid Beauty", price: "18,00 €", link: "https://www.lookfantastic.de/first-aid-beauty-ultra-repair-cream/", ev: "B", evNote: "Reichhaltig, klinisch getestet." },
        { step: "Sonnenschutz", name: "La Roche-Posay Anthelios SPF50", brand: "La Roche-Posay", price: "19,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-anthelios-spf50/", ev: "A", evNote: "AAD-Goldstandard.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "CeraVe Hydrating Cleanser", brand: "CeraVe", price: "13,99 €", link: "https://www.lookfantastic.de/cerave-hydrating-facial-cleanser/11288802.html", ev: "B", evNote: "Sanfte Reinigung." },
        { step: "Essence", name: "Hada Labo Gokujyun Lotion", brand: "Hada Labo", price: "16,50 €", link: "https://www.yesstyle.com/en/hada-labo-gokujyun-premium-lotion/", ev: "B", evNote: "Intensive Hydration vor Retinol." },
        { step: "Retinol", name: "La Roche-Posay Redermic Retinol", brand: "La Roche-Posay", price: "25,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-redermic-retinol/", ev: "A", evNote: "Sanfte Formel fuer empfindliche trockene Haut.", highlight: true, freq: "2x pro Woche" },
        { step: "Oel", name: "The Ordinary Rosehip Seed Oil", brand: "The Ordinary", price: "10,90 €", link: "https://www.notino.de/the-ordinary/100-organisches-kaltgepresstes-hagebuttenoel/", ev: "B", evNote: "Beruhigt nach Retinol.", freq: "3-4x pro Woche" },
        { step: "Nachtcreme", name: "Laneige Water Sleeping Mask", brand: "Laneige", price: "29,00 €", link: "https://www.yesstyle.com/en/laneige-water-sleeping-mask/", ev: "B", evNote: "Overnight-Hydration." },
      ]
    },
    premium: {
      morning: [
        { step: "Reinigung", name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/", ev: "C", evNote: "Naehrende Reinigung." },
        { step: "Vitamin C Serum", name: "Paulas Choice C15 Super Booster", brand: "Paulas Choice", price: "48,00 €", link: "https://www.paulaschoice.de/c15-super-booster/", ev: "A", evNote: "15% Vitamin C: staerkste Evidenz." },
        { step: "Essence", name: "Hada Labo Gokujyun Lotion", brand: "Hada Labo", price: "16,50 €", link: "https://www.yesstyle.com/en/hada-labo-gokujyun-premium-lotion/", ev: "B", evNote: "Multi-HA Basis." },
        { step: "Creme", name: "First Aid Beauty Ultra Repair Cream", brand: "First Aid Beauty", price: "18,00 €", link: "https://www.lookfantastic.de/first-aid-beauty-ultra-repair-cream/", ev: "B", evNote: "Reichhaltige Barrier-Creme." },
        { step: "Sonnenschutz", name: "Isdin Eryfotona Actinica SPF100", brand: "Isdin", price: "38,00 €", link: "https://www.lookfantastic.de/isdin-eryfotona-actinica-spf100/", ev: "A", evNote: "SPF100 und Photolyase.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Elemis Pro-Collagen Cleansing Balm", brand: "Elemis", price: "28,00 €", link: "https://www.lookfantastic.de/elemis-pro-collagen-cleansing-balm/", ev: "C", evNote: "Naehrend." },
        { step: "Essence", name: "Hada Labo Gokujyun Lotion", brand: "Hada Labo", price: "16,50 €", link: "https://www.yesstyle.com/en/hada-labo-gokujyun-premium-lotion/", ev: "B", evNote: "Intensive Hydration vor Retinol." },
        { step: "Retinol", name: "Paulas Choice 1% Retinol", brand: "Paulas Choice", price: "62,00 €", link: "https://www.paulaschoice.de/clinical-1pct-retinol-treatment/", ev: "A", evNote: "1% Retinol: staerkste klinische Dosis.", highlight: true, freq: "2x pro Woche" },
        { step: "Oel", name: "The Ordinary Rosehip Seed Oil", brand: "The Ordinary", price: "10,90 €", link: "https://www.notino.de/the-ordinary/100-organisches-kaltgepresstes-hagebuttenoel/", ev: "B", evNote: "Beruhigt und naehrt nach Retinol.", freq: "3-4x pro Woche" },
        { step: "Nachtcreme", name: "Laneige Water Sleeping Mask", brand: "Laneige", price: "29,00 €", link: "https://www.yesstyle.com/en/laneige-water-sleeping-mask/", ev: "B", evNote: "Overnight-Hydration." },
      ]
    }
  },
  oily: {
    drogerie: {
      morning: [
        { step: "Reinigung", name: "Cetaphil Gentle Skin Cleanser", brand: "Cetaphil", price: "10,99 €", link: "https://www.shop-apotheke.com/beauty/cetaphil-gentle-skin-cleanser/", ev: "B", evNote: "AAD-empfohlen." },
        { step: "Vitamin C Serum", name: "LOreal Revitalift 12% Vitamin C", brand: "LOreal", price: "14,99 €", link: "https://www.dm.de/l-oreal-paris-revitalift-clinical-vitamin-c-serum/", ev: "A", evNote: "Vitamin C hemmt Talgproduktion und schuetzt vor freien Radikalen." },
        { step: "Serum", name: "The Ordinary Niacinamide 10% Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "52% Mitesser-Reduktion im RCT." },
        { step: "Gel", name: "Neutrogena Hydro Boost Water Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "Oelfrei, klinisch getestet." },
        { step: "Sonnenschutz", name: "Altruist Fluid SPF50", brand: "Altruist", price: "3,99 €", link: "https://www.amazon.de/s?k=altruist+spf+50", ev: "A", evNote: "SPF taeglich = 24% weniger Hautalterung.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "Cetaphil Gentle Skin Cleanser", brand: "Cetaphil", price: "10,99 €", link: "https://www.shop-apotheke.com/beauty/cetaphil-gentle-skin-cleanser/", ev: "B", evNote: "AAD-empfohlen." },
        { step: "BHA Exfoliant", name: "COSRX AHA BHA Toner", brand: "COSRX", price: "18,00 €", link: "https://www.yesstyle.com/en/cosrx-aha-bha-clarifying-treatment-toner/", ev: "B", evNote: "Milde AHA/BHA. Abwechselnd mit Retinol.", freq: "Abwechselnd mit Retinol" },
        { step: "Serum", name: "The Ordinary Niacinamide 10% Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Niacinamid vor Retinol." },
        { step: "Retinol", name: "The Ordinary Retinol 0.5%", brand: "The Ordinary", price: "6,50 €", link: "https://www.notino.de/the-ordinary/retinol-0-5-in-squalan/", ev: "A", evNote: "Retinol bei fettiger Haut besonders effektiv.", highlight: true, freq: "3x pro Woche - abwechselnd mit BHA" },
        { step: "Gel", name: "Neutrogena Hydro Boost Water Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "Leichter Abschluss nach Retinol." },
      ]
    },
    midrange: {
      morning: [
        { step: "Reinigung", name: "La Roche-Posay Effaclar Gel", brand: "La Roche-Posay", price: "14,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-effaclar-gel/", ev: "B", evNote: "Klinisch bei fettiger Haut getestet." },
        { step: "Vitamin C Serum", name: "Garnier Vitamin C Serum", brand: "Garnier", price: "12,99 €", link: "https://www.dm.de/garnier-skin-active-vitamin-c-serum/", ev: "A", evNote: "Vitamin C morgens: hemmt Talg, hellt auf." },
        { step: "Serum", name: "The Ordinary Niacinamide 10% Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "52% Mitesser-Reduktion im RCT." },
        { step: "Gel", name: "Neutrogena Hydro Boost Water Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "Oelfrei." },
        { step: "Sonnenschutz", name: "La Roche-Posay Anthelios SPF50", brand: "La Roche-Posay", price: "19,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-anthelios-spf50/", ev: "A", evNote: "AAD-Goldstandard.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "La Roche-Posay Effaclar Gel", brand: "La Roche-Posay", price: "14,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-effaclar-gel/", ev: "B", evNote: "Klinisch getestet." },
        { step: "BHA Toner", name: "Paulas Choice 2% BHA", brand: "Paulas Choice", price: "32,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peeling/", ev: "A", evNote: "Goldstandard fuer Poren. Abwechselnd mit Retinol.", highlight: true, freq: "3x pro Woche - abwechselnd mit Retinol" },
        { step: "Serum", name: "The Ordinary Niacinamide 10% Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Niacinamid vor Retinol." },
        { step: "Retinol", name: "La Roche-Posay Redermic Retinol", brand: "La Roche-Posay", price: "25,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-redermic-retinol/", ev: "A", evNote: "Retinol klinisch belegt.", highlight: true, freq: "3x pro Woche - abwechselnd mit BHA" },
        { step: "Gel", name: "Neutrogena Hydro Boost Water Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "Leichter Abschluss." },
      ]
    },
    premium: {
      morning: [
        { step: "Reinigung", name: "La Roche-Posay Effaclar Gel", brand: "La Roche-Posay", price: "14,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-effaclar-gel/", ev: "B", evNote: "Klinisch getestet." },
        { step: "Vitamin C Serum", name: "Paulas Choice C15 Super Booster", brand: "Paulas Choice", price: "48,00 €", link: "https://www.paulaschoice.de/c15-super-booster/", ev: "A", evNote: "15% Vitamin C: staerkste Evidenz." },
        { step: "Serum", name: "The Ordinary Niacinamide 10% Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Unschlagbar." },
        { step: "Gel", name: "Neutrogena Hydro Boost Water Gel", brand: "Neutrogena", price: "14,99 €", link: "https://www.dm.de/neutrogena-hydro-boost-water-gel/", ev: "B", evNote: "Oelfrei." },
        { step: "Sonnenschutz", name: "Isdin Eryfotona Actinica SPF100", brand: "Isdin", price: "38,00 €", link: "https://www.lookfantastic.de/isdin-eryfotona-actinica-spf100/", ev: "A", evNote: "SPF100 und Photolyase.", spf: true },
      ],
      evening: [
        { step: "Reinigung", name: "La Roche-Posay Effaclar Gel", brand: "La Roche-Posay", price: "14,90 €", link: "https://www.shop-apotheke.com/beauty/la-roche-posay-effaclar-gel/", ev: "B", evNote: "Klinisch getestet." },
        { step: "BHA Toner", name: "Paulas Choice 2% BHA", brand: "Paulas Choice", price: "32,00 €", link: "https://www.paulaschoice.de/skin-perfecting-2-bha-fluessig-peiling/", ev: "A", evNote: "Bestes BHA. Abwechselnd mit Retinol.", highlight: true, freq: "3x pro Woche - abwechselnd mit Retinol" },
        { step: "Serum", name: "The Ordinary Niacinamide 10% Zinc", brand: "The Ordinary", price: "6,80 €", link: "https://www.notino.de/the-ordinary/niacinamide-10-zinc-1-serum/", ev: "A", evNote: "Niacinamid vor Retinol." },
        { step: "Retinol", name: "Paulas Choice 1% Retinol", brand: "Paulas Choice", price: "62,00 €", link: "https://www.paulaschoice.de/clinical-1pct-retinol-treatment/", ev: "A", evNote: "1% Retinol: maximale Wirkung.", highlight: true, freq: "3x pro Woche - abwechselnd mit BHA" },
        { step: "Nachtcreme", name: "Laneige Water Sleeping Mask", brand: "Laneige", price: "29,00 €", link: "https://www.yesstyle.com/en/laneige-water-sleeping-mask/", ev: "B", evNote: "Overnight-Hydration nach Retinol." },
      ]
    }
  }
};
function downloadRoutine(skinData, skinType, budget) {
  const typeLabel = skinType === "combination" ? "Mischhaut" : skinType === "dry" ? "Trockene Haut" : "Fettige Haut";
  const budgetLabel = budget === "drogerie" ? "Drogerie" : budget === "midrange" ? "Mid-Range" : "Premium";
  const morning = PRODUKTE[skinType][budget].morning;
  const evening = PRODUKTE[skinType][budget].evening;

  const rows = items => items.map((p, i) => `
    <tr>
      <td style="padding:10px;color:#9ca3af;font-size:12px">${i+1}</td>
      <td style="padding:10px">
        <div style="font-size:10px;color:#9ca3af;text-transform:uppercase">${p.step}</div>
        <div style="font-weight:700;font-size:14px">${p.name}</div>
        <div style="font-size:12px;color:#6b7280">${p.brand}</div>
        ${p.freq ? `<div style="font-size:11px;color:#c2410c;margin-top:3px">${p.freq}</div>` : ""}
      </td>
      <td style="padding:10px;font-weight:700;font-size:14px;white-space:nowrap">${p.price}</td>
      <td style="padding:10px"><a href="${p.link}" style="background:#111827;color:white;padding:4px 10px;border-radius:99px;text-decoration:none;font-size:11px;font-weight:600">Kaufen</a></td>
    </tr>
  `).join("");

  const concerns = (skinData?.concerns || []).join(", ");
  const summary = skinData?.summary || "";
  const score = skinData?.score || 70;

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>skyn. Routine - ${typeLabel}</title>
<style>
  body{font-family:-apple-system,sans-serif;max-width:600px;margin:40px auto;padding:20px;color:#111827}
  h1{font-size:28px;font-weight:800;letter-spacing:-0.03em;margin:0}
  .card{background:linear-gradient(135deg,#1d4ed8,#3b82f6);border-radius:16px;padding:20px;color:white;margin:20px 0;display:flex;justify-content:space-between;align-items:center}
  .score{width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800}
  h2{font-size:15px;color:#374151;margin:24px 0 8px;border-top:2px solid #f0f0f0;padding-top:16px}
  table{width:100%;border-collapse:collapse}
  tr{border-bottom:1px solid #f5f5f5}
  .disc{margin-top:30px;padding:12px;background:#f9fafb;border-radius:10px;font-size:11px;color:#9ca3af;line-height:1.7}
</style>
</head>
<body>
  <h1>skyn<span style="color:#3b82f6">.</span></h1>
  <p style="color:#6b7280;font-size:13px">Erstellt am ${new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</p>
  <div class="card">
    <div>
      <div style="font-size:11px;opacity:0.75;margin-bottom:4px">DEIN HAUTTYP</div>
      <div style="font-size:22px;font-weight:800">${typeLabel}</div>
      <div style="font-size:12px;opacity:0.8;margin-top:4px">${concerns}</div>
    </div>
    <div style="text-align:center">
      <div class="score">${score}</div>
      <div style="font-size:10px;opacity:0.7;margin-top:4px">Score</div>
    </div>
  </div>
  <p style="font-size:13px;color:#374151;line-height:1.7;background:white;padding:12px;border-radius:10px;border:1px solid #f0f0f0">${summary}</p>
  <h2>Morgens - ${budgetLabel}</h2>
  <table>${rows(morning)}</table>
  <h2>Abends - ${budgetLabel}</h2>
  <table>${rows(evening)}</table>
  <div class="disc">
    <strong style="color:#6b7280">Disclaimer:</strong> Keine medizinische Beratung. Bei Hautproblemen Dermatologen aufsuchen.<br>
    <strong style="color:#6b7280">Hinweis:</strong> BHA und Retinol nicht gleichzeitig - abwechseln.<br>
    <strong style="color:#6b7280">Datenschutz:</strong> Fotos nicht gespeichert. Links koennen Affiliate-Links sein.
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "skyn-routine.html";
  a.click();
  URL.revokeObjectURL(url);
}

async function analyseHaut(base64) {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
        { type: "text", text: "Analysiere dieses Gesichtsfoto. Antworte NUR mit JSON ohne Text davor oder danach.\n\nWenn KEIN Gesicht sichtbar: {\"ok\":false,\"issue\":\"Kein Gesicht erkannt - bitte Selfie aufnehmen\"}\nWenn von unten/oben/dunkel/unscharf: {\"ok\":false,\"issue\":\"Hinweis auf Deutsch\"}\n\nWenn normales Selfie: {\"ok\":true,\"skinType\":\"combination\",\"score\":69,\"scores\":{\"Feuchtigkeit\":42,\"Talgproduktion\":68,\"Empfindlichkeit\":35,\"Elastizitaet\":71},\"concerns\":[\"T-Zone Glanz\",\"Vergroesserte Poren\"],\"summary\":\"Kurze individuelle Beschreibung auf Deutsch.\"}\n\nskinType: combination, dry oder oily. Alle Scores 0-100 realistisch. Nur JSON." }
      ]
    }]
  };
  const res = await fetch(BACKEND + "/api/analyse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.type === "error") throw new Error(data.error?.type);
  const text = data.content?.[0]?.text || "";
  const match = text.match(/\{[\s\S]*\}/);
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
  const c = { Feuchtigkeit: "#3b82f6", Talgproduktion: "#f59e0b", Empfindlichkeit: "#ef4444", Elastizitaet: "#10b981" };
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
  const evMap = { A: ["#dcfce7", "#15803d", "AAA"], B: ["#dbeafe", "#1d4ed8", "BBB"], C: ["#fef9c3", "#92400e", "CCC"] };
  const ev = evMap[item.ev] || ["#f0f0f0", "#6b7280", "---"];
  return (
    <div style={{ background: "white", borderRadius: 12, padding: 12, marginBottom: 8, border: item.spf ? "1.5px solid #fde68a" : item.highlight ? "1.5px solid #bfdbfe" : "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: item.spf ? "#fef9c3" : "#f0f7ff", color: item.spf ? "#92400e" : "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
          {item.spf ? "S" : idx + 1}
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
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, background: "#111827", color: "white", padding: "3px 9px", borderRadius: 99, textDecoration: "none", fontWeight: 600, display: "inline-block", marginTop: 3 }}>Kaufen</a>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
            {item.freq && <span style={{ fontSize: 9, background: "#fff7ed", color: "#c2410c", padding: "2px 6px", borderRadius: 99, fontWeight: 600 }}>{item.freq}</span>}
            <button onClick={() => setEvOpen(v => !v)} style={{ fontSize: 9, background: ev[0], color: ev[1], padding: "2px 6px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 600 }}>
              {ev[2]} Evidenz {item.ev} {evOpen ? "v" : ">"}
            </button>
          </div>
          {evOpen && (
            <div style={{ marginTop: 5, fontSize: 10, color: ev[1], background: ev[0], borderRadius: 6, padding: "4px 8px", lineHeight: 1.6 }}>
              {item.evNote}
            </div>
          )}
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
  const [skinData, setSkinData] = useState(null);
  const [issue, setIssue] = useState(null);
  const [budget, setBudget] = useState("drogerie");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [history, setHistory] = useState([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileRef = useRef();
  const STEPS = ["Foto wird geprueft...", "Hauttyp wird bestimmt...", "Routine wird erstellt..."];

  const reset = () => { setPhase("upload"); setPhotoUrl(null); setSkinType(null); setSkinData(null); setIssue(null); setLoadingStep(0); };

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
      if (!result.ok) {
        setIssue(result.issue || "Foto nicht geeignet");
        setPhase("rejected");
        return;
      }
      const st = ["combination","dry","oily"].includes(result.skinType) ? result.skinType : "combination";
      setSkinType(st);
      setSkinData(result);
      setTimeout(() => {
        setPhase("result");
        const label = st === "combination" ? "Mischhaut" : st === "dry" ? "Trockene Haut" : "Fettige Haut";
        setHistory(prev => [{ url, type: label, score: result.score || 70, date: new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) }, ...prev]);
      }, 400);
    } catch (err) {
      clearInterval(timer);
      setIssue("Analyse fehlgeschlagen - bitte erneut versuchen");
      setPhase("rejected");
    }
  }, []);

  const produkte = skinType ? PRODUKTE[skinType][budget] : null;
  const typeLabel = skinType === "combination" ? "Mischhaut" : skinType === "dry" ? "Trockene Haut" : skinType === "oily" ? "Fettige Haut" : "";

  return (
    <div style={{ fontFamily: "-apple-system, sans-serif", maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 20px 12px", background: "white", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>skyn<span style={{ color: "#3b82f6" }}>.</span></div>
        {skinType && <div style={{ background: "#eff6ff", borderRadius: 99, padding: "4px 10px" }}><span style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6" }}>{typeLabel}</span></div>}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        {tab === "analyse" && (
          <div style={{ padding: 20 }}>
            {phase === "upload" && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>Foto rein.<br /><span style={{ color: "#3b82f6" }}>Routine raus.</span></div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6, lineHeight: 1.6 }}>Ein Selfie - KI analysiert Hauttyp und erstellt deine Routine.</div>
                </div>
                <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #dbeafe", borderRadius: 20, padding: "48px 20px", textAlign: "center", cursor: "pointer", background: "#f0f7ff", marginBottom: 12 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1d4ed8" }}>Selfie aufnehmen</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Frontal - Augenhoehe - Tageslicht - kein Make-up</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ""; }} />
                <div style={{ background: "#f9fafb", borderRadius: 10, padding: "8px 12px", fontSize: 10, color: "#9ca3af" }}>Keine medizinische Beratung - Fotos nicht gespeichert - Affiliate-Links</div>
              </>
            )}

            {phase === "loading" && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                {photoUrl && <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}><img src={photoUrl} alt="" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid #dbeafe" }} /><div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#3b82f6", animation: "spin 1s linear infinite" }} /></div>}
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Analyse laeuft</div>
                {STEPS.map((s, i) => <div key={i} style={{ fontSize: 12, marginBottom: 8, color: i < loadingStep ? "#16a34a" : i === loadingStep ? "#3b82f6" : "#d1d5db", fontWeight: i === loadingStep ? 600 : 400 }}>{i < loadingStep ? "ok" : i === loadingStep ? ">" : "-"} {s}</div>)}
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
                  <span style={{ fontSize: 13, color: "#374151" }}>{issue}</span>
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#111827", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>Neues Foto aufnehmen</button>
                <button onClick={reset} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "none", color: "#6b7280", fontSize: 12, cursor: "pointer" }}>Zurueck</button>
                <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ""; }} />
              </>
            )}

            {phase === "result" && skinData && (
              <>
                <div style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", borderRadius: 16, padding: 16, marginBottom: 12, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 2 }}>DEIN HAUTTYP</div>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{typeLabel}</div>
                    <div style={{ fontSize: 11, opacity: 0.8, marginTop: 3 }}>{(skinData.concerns || []).join(" - ")}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>{skinData.score || 70}</div>
                    <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>Score</div>
                  </div>
                </div>
                <div style={{ background: "white", borderRadius: 12, padding: 12, marginBottom: 10, border: "1px solid #f0f0f0", fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{skinData.summary}</div>
                {skinData.scores && (
                  <div style={{ background: "white", borderRadius: 12, padding: 12, marginBottom: 10, border: "1px solid #f0f0f0" }}>
                    {Object.entries(skinData.scores).map(([k, v]) => <TraitBar key={k} label={k} value={v} />)}
                  </div>
                )}
                <button onClick={() => setTab("routine")} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#111827", color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>Meine Routine ansehen</button>
                <button onClick={reset} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "none", color: "#6b7280", fontSize: 12, cursor: "pointer" }}>Neues Foto</button>
              </>
            )}
          </div>
        )}

        {tab === "routine" && (
          <div style={{ padding: 20 }}>
            {!skinType ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Noch keine Analyse</div>
                <button onClick={() => setTab("analyse")} style={{ padding: "10px 22px", borderRadius: 99, background: "#3b82f6", color: "white", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Zur Analyse</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {[["drogerie","Drogerie","#16a34a","#f0fdf4"],["midrange","Mid-Range","#1d4ed8","#eff6ff"],["premium","Premium","#7c3aed","#f5f3ff"]].map(([id, label, col, bg]) => (
                    <button key={id} onClick={() => setBudget(id)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "1.5px solid " + (budget === id ? col : "#e5e7eb"), background: budget === id ? bg : "white", cursor: "pointer", textAlign: "center" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: budget === id ? col : "#6b7280" }}>{label}</div>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", background: "#f0f0f0", borderRadius: 10, padding: 3, marginBottom: 14 }}>
                  {[["morning","Morgens"],["evening","Abends"]].map(([id, label]) => (
                    <button key={id} onClick={() => setTimeOfDay(id)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: timeOfDay === id ? "white" : "none", color: timeOfDay === id ? "#111827" : "#6b7280", fontWeight: timeOfDay === id ? 700 : 400, fontSize: 12, cursor: "pointer" }}>{label}</button>
                  ))}
                </div>
                {produkte && produkte[timeOfDay].map((item, i) => <ProductCard key={i} item={item} idx={i} />)}
                <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", marginTop: 10 }}>Markenunabhaengig - Evidenzbasiert - Affiliate-Links, kein Aufpreis</div>
              </>
            )}
          </div>
        )}

        {tab === "history" && (
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Routine speichern</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>Lade deine persoenliche Routine als Dokument herunter.</div>
            {!skinType ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                <div style={{ fontSize: 13, marginBottom: 12 }}>Erst Analyse durchfuehren</div>
                <button onClick={() => setTab("analyse")} style={{ padding: "10px 22px", borderRadius: 99, background: "#3b82f6", color: "white", border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Zur Analyse</button>
              </div>
            ) : (
              <>
                <div style={{ background: "white", borderRadius: 12, padding: 14, marginBottom: 12, border: "1px solid #f0f0f0" }}>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>Deine Routine enthaelt:</div>
                  {["drogerie","midrange","premium"].map(b => (
                    <div key={b} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f9f9f9" }}>
                      <span style={{ fontSize: 12, color: "#374151" }}>{b === "drogerie" ? "Drogerie" : b === "midrange" ? "Mid-Range" : "Premium"}</span>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>{(PRODUKTE[skinType][b].morning.length + PRODUKTE[skinType][b].evening.length)} Produkte</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => downloadRoutine(skinData, skinType, budget)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#111827", color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>
                  Routine herunterladen
                </button>
                <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "center" }}>Als HTML-Datei - kann gespeichert und geteilt werden</div>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "white", borderTop: "1px solid #f0f0f0", display: "flex" }}>
        {[["analyse","ANALYSE"],["routine","ROUTINE"],["history","SPEICHERN"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer", color: tab === id ? "#3b82f6" : "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
