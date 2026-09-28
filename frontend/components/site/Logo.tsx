import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Wordmark: teal square mark + display-type name. `inverted` for dark backgrounds. */
export default function Logo({
  inverted = false,
  href = '/',
  className,
}: {
  inverted?: boolean;
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn('group flex items-center gap-2.5 rounded-lg', className)}>
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 20h18" />
          <path d="M5 20V10l7-5 7 5v10" />
          <path d="M10 20v-5h4v5" />
        </svg>
      </span>
      <span
        className={cn(
          'font-display text-xl font-extrabold tracking-tight',
          inverted ? 'text-white' : 'text-foreground'
        )}
      >
        Ground Link
      </span>
    </Link>
  );
}
