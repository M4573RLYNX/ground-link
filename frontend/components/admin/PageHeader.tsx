import { cn } from '@/lib/utils';

/** Title row shared by every admin page. */
export default function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end', className)}>
      <div className="min-w-0">
        <h1 className="truncate text-3xl font-extrabold md:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
