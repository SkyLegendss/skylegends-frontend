export type Training = {
  id: string;
  title: string;
  shortDescription: string;
  targetGroup: string;
  level: string;
  duration: string;
  format: string;
  location: string;
  price: string;
  content: string[];
  active: boolean;
  ctaLabel: string;
};

// Editable without touching page markup — add/remove/reorder courses or
// change any field here and the /skoleni page picks it up automatically.
export const trainings: Training[] = [
  {
    id: 'zaklady-pilotovani',
    title: 'Základy pilotování dronu',
    shortDescription: 'Úplné základy ovládání, bezpečnosti a praktického létání pro každého, kdo s dronem začíná.',
    targetGroup: 'Začátečníky',
    level: 'Začátečník',
    duration: 'Na dotaz',
    format: 'Teorie + praxe',
    location: 'Na dotaz',
    price: 'Na dotaz',
    content: [
      'úplné základy',
      'bezpečnost',
      'ovládání',
      'praktický let',
      'základní pravidla provozu',
    ],
    active: true,
    ctaLabel: 'MÁM ZÁJEM',
  },
  {
    id: 'priprava-a1-a3-a2',
    title: 'Příprava pilota A1/A3 / A2',
    shortDescription: 'Příprava na zkoušku pro ty, kdo se chtějí zorientovat v požadavcích platné legislativy.',
    targetGroup: 'Zájemce o oficiální kategorie OPEN',
    level: 'Začátečník / Pokročilý',
    duration: 'Na dotaz',
    format: 'Teorie / individuálně',
    location: 'Na dotaz',
    price: 'Na dotaz',
    content: [
      'legislativa',
      'pravidla OPEN',
      'příprava na A1/A3',
      'příprava na A2',
      'modelové otázky',
      'praktické vysvětlení pravidel',
    ],
    active: true,
    ctaLabel: 'MÁM ZÁJEM',
  },
  {
    id: 'firemni-skoleni-na-miru',
    title: 'Firemní školení na míru',
    shortDescription: 'Praktické školení zaměstnanců a firemních týmů zavádějících drony do provozu.',
    targetGroup: 'Zaměstnance, technické pracovníky, facility a inspekční týmy',
    level: 'Podle zkušeností týmu',
    duration: 'Podle rozsahu',
    format: 'Teorie + praxe',
    location: 'U zákazníka / dle dohody',
    price: 'Individuální nabídka',
    content: [
      'bezpečný provoz dronů ve firmě',
      'odpovědnost provozovatele a pilota',
      'příprava a plánování letu',
      'kontrola prostoru před letem',
      'práce s geografickými zónami',
      'interní provozní postupy',
      'bezpečnost zaměstnanců a okolí',
      'postup při nestandardních a nouzových situacích',
      'praktický výcvik zaměstnanců',
      'konzultace konkrétního využití dronu ve firmě',
    ],
    active: true,
    ctaLabel: 'POPTAT ŠKOLENÍ',
  },
];
