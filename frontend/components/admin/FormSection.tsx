import { cn } from '@/lib/utils';

/** Settings-style form block: label + hint on the left, fields on the right. */
export default function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="grid gap-6 border-b py-8 first:pt-0 last:border-0 lg:grid-cols-3 lg:gap-10">
      <div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={cn('rounded-2xl border bg-card p-5 md:p-6 lg:col-span-2', className)}>{children}</div>
    </section>
  );
}
