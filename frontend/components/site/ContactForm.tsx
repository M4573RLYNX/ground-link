'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SITE_CONTACT, TOPICS, Topic, whatsappLink } from '@/lib/site';


const selectClass =
  'flex h-11 w-full rounded-xl border border-input bg-card px-3.5 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm';

/**
 * No backend inbox yet, so the form writes the message for WhatsApp (or email) and hands it off.
 * The prefilled topic comes from ?topic= links on Services and listing pages.
 */
export default function ContactForm({ initialTopic = 'buy' }: { initialTopic?: Topic }) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const compose = () =>
    [`Hi Ground Link. Enquiry: ${TOPICS[topic].label}`, '', message.trim(), '', `— ${name.trim()}${phone ? `, ${phone}` : ''}`].join('\n');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappLink(compose()), '_blank', 'noopener');
  };

  const mailto = `mailto:${SITE_CONTACT.email}?subject=${encodeURIComponent(TOPICS[topic].label)}&body=${encodeURIComponent(compose())}`;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Send us a message</h2>
        <p className="mt-1 text-muted-foreground">It opens in WhatsApp, ready to send. We usually reply within 2 hours.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">What can we help with?</Label>
        <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value as Topic)} className={selectClass}>
          {(Object.keys(TOPICS) as Topic[]).map((t) => (
            <option key={t} value={t}>
              {TOPICS[t].label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Your name *</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+677 7xx xxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Details *</Label>
        <Textarea
          id="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={TOPICS[topic].hint}
          className="min-h-36"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="xl" className="bg-[#25D366] text-white hover:bg-[#20ba5a]">
          <Send /> Send on WhatsApp
        </Button>
        <a href={mailto} className="text-center text-sm font-semibold text-muted-foreground hover:text-foreground sm:ml-2">
          or send by email
        </a>
      </div>
    </form>
  );
}
