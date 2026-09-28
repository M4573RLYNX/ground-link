"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUDGETS, DEAL_TYPES, Deal } from "@/lib/format";
import { cn } from "@/lib/utils";

type Mode = Deal | "sell";

interface SearchProps {
  initialValues?: {
    type?: string;
    location?: string;
    price?: string;
    beds?: string;
  };
  /** Starting mode. Rent and buy change budgets, types and where results land. */
  deal?: Deal;
  /** Show the Rent / Buy (and Sell, for the hero) switcher */
  tabs?: boolean;
  className?: string;
  /** "hero" is the oversized spotlight version used on the landing page */
  variant?: "default" | "hero";
}

const fieldLabel = "block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";
const fieldControl = "w-full appearance-none bg-transparent pr-6 text-base font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground/70 focus:outline-none";

const modeLabels: Record<Mode, string> = { rent: "Rent", buy: "Buy", sell: "Sell" };

export default function HeroSearch({ initialValues, deal = "buy", tabs = false, className, variant = "default" }: SearchProps) {
  const router = useRouter();
  const hero = variant === "hero";

  const [mode, setMode] = useState<Mode>(deal);
  const [type, setType] = useState(initialValues?.type || "");
  const [location, setLocation] = useState(initialValues?.location || "");
  const [price, setPrice] = useState(initialValues?.price || "");
  const [beds, setBeds] = useState(initialValues?.beds || "");

  const activeDeal: Deal = mode === "rent" ? "rent" : "buy";
  const modes: Mode[] = hero ? ["rent", "buy", "sell"] : ["rent", "buy"];

  const switchMode = (next: Mode) => {
    setMode(next);
    // Budgets differ between rent and buy, so a stale one would silently filter everything out
    setPrice("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    if (price) params.set("price", price);
    if (activeDeal === "rent" && beds) params.set("beds", beds);
    const qs = params.toString();
    router.push(`/${activeDeal}${qs ? `?${qs}` : ""}`);
  };

  const field = cn(
    "flex-1 rounded-2xl transition-colors hover:bg-muted md:rounded-full",
    hero ? "px-6 py-4 md:px-8 md:py-5" : "px-5 py-3"
  );
  const label = cn(fieldLabel, hero && "text-xs");
  const control = cn(fieldControl, hero && "mt-0.5 text-lg md:text-xl");
  const chevron = cn(
    "pointer-events-none absolute size-4 text-muted-foreground",
    hero ? "right-6 bottom-5 md:right-8 md:bottom-6 md:size-5" : "right-5 bottom-4"
  );
  const divider = cn("h-px bg-border md:mx-0 md:w-px", hero ? "mx-6 md:h-12" : "mx-5 md:h-8");
  const shell = cn(
    "flex w-full flex-col gap-1 rounded-3xl border bg-card p-2 text-left shadow-2xl shadow-black/10 md:flex-row md:items-center md:rounded-full",
    hero && "p-2.5 shadow-black/40 ring-8 ring-white/15 md:p-3"
  );

  return (
    <div className={cn("w-full", className)}>
      {tabs && (
        <div
          role="tablist"
          aria-label="What are you looking to do?"
          className={cn(
            "mb-3 inline-flex gap-1 rounded-full p-1",
            hero ? "bg-black/35 backdrop-blur-md" : "bg-muted"
          )}
        >
          {modes.map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={cn(
                "rounded-full font-semibold transition-colors",
                hero ? "px-6 py-2 text-base" : "px-5 py-1.5 text-sm",
                mode === m
                  ? "bg-card text-foreground shadow-sm"
                  : hero
                    ? "text-white/85 hover:text-white"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      )}

      {mode === "sell" ? (
        <div className={cn(shell, "items-stretch md:items-center")}>
          <div className={cn("flex-1", hero ? "px-6 py-4 md:px-8 md:py-5" : "px-5 py-3")}>
            <p className={label}>Selling or subdividing?</p>
            <p className={cn("font-semibold text-foreground", hero ? "mt-0.5 text-lg md:text-xl" : "text-base")}>
              Get a free price estimate, a land survey, and buyers across the islands.
            </p>
          </div>
          <Button asChild size="xl" className="mt-1 h-16 rounded-2xl px-10 text-lg md:mt-0 md:h-18 md:rounded-full">
            <Link href="/services">
              See how we help <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSearch} className={shell}>
          <label className={cn(field, "cursor-text")}>
            <span className={label}>Where</span>
            <input
              type="text"
              placeholder="Honiara, Gizo…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={control}
            />
          </label>

          <div className={divider} />

          <label className={cn(field, "relative cursor-pointer")}>
            <span className={label}>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className={cn(control, "cursor-pointer")}>
              <option value="">All types</option>
              {DEAL_TYPES[activeDeal].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className={chevron} />
          </label>

          {activeDeal === "rent" && (
            <>
              <div className={divider} />
              <label className={cn(field, "relative cursor-pointer")}>
                <span className={label}>Bedrooms</span>
                <select value={beds} onChange={(e) => setBeds(e.target.value)} className={cn(control, "cursor-pointer")}>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
                <ChevronDown className={chevron} />
              </label>
            </>
          )}

          <div className={divider} />

          <label className={cn(field, "relative cursor-pointer")}>
            <span className={label}>{activeDeal === "rent" ? "Monthly budget" : "Budget"}</span>
            <select value={price} onChange={(e) => setPrice(e.target.value)} className={cn(control, "cursor-pointer")}>
              <option value="">Any price</option>
              {BUDGETS[activeDeal].map((b) => (
                <option key={b.label}>{b.label}</option>
              ))}
            </select>
            <ChevronDown className={chevron} />
          </label>

          {hero ? (
            <Button type="submit" size="xl" className="mt-1 h-16 rounded-2xl px-10 text-lg md:mt-0 md:h-18 md:rounded-full">
              <Search className="size-5 stroke-[2.5]" />
              {activeDeal === "rent" ? "Find rentals" : "Search"}
            </Button>
          ) : (
            <Button type="submit" size="xl" className="mt-1 md:mt-0 md:size-14 md:p-0" aria-label="Search properties">
              <Search className="stroke-[2.5]" />
              <span className="md:hidden">Search</span>
            </Button>
          )}
        </form>
      )}
    </div>
  );
}
