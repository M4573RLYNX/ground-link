/** Business contact details used across the public site */
export const SITE_CONTACT = {
  whatsapp: '6777809508', // international format, no "+"
  phoneDisplay: '+677 780 9508',
  email: 'hello@groundlink.com.sb',
  office: 'Hibiscus Avenue, Central Honiara',
  hours: 'Mon to Fri, 8am to 5pm · Sat by appointment',
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${SITE_CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

/** Contact form topics; ?topic=<key> links preselect one */
export const TOPICS = {
  rent: { label: 'I’m looking to rent', hint: 'Area, number of bedrooms, monthly budget and move-in date…' },
  buy: { label: 'I’m looking to buy', hint: 'Home or land, preferred area and budget…' },
  sell: { label: 'I want to sell', hint: 'What you’re selling, where it is, and whether it has a registered title…' },
  'rent-out': { label: 'I want to rent out my property', hint: 'Property type, location, bedrooms and when it’s available…' },
  survey: { label: 'Land survey', hint: 'Where the land is, rough size, the type of survey, and any title or plan reference…' },
  valuation: { label: 'Valuation', hint: 'The property, its location, and what the valuation is for…' },
  other: { label: 'Something else', hint: 'How can we help?' },
} as const;

export type Topic = keyof typeof TOPICS;
