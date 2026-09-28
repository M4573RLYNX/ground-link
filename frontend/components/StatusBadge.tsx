import { Badge } from '@/components/ui/badge';
import { Property } from '@/lib/api';
import { formatStatus, statusTone } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function StatusBadge({
  status,
  className,
}: {
  status: Property['status'];
  className?: string;
}) {
  return (
    <Badge variant={statusTone(status)} className={cn('capitalize', className)}>
      {formatStatus(status)}
    </Badge>
  );
}
