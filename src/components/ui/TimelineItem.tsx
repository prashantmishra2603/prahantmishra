import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  description?: string;
  date: string;
  index: number;
  icon?: ReactNode;
}

export function TimelineItem({
  title,
  subtitle,
  description,
  date,
  index,
  icon,
}: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-1/2 rounded-full bg-primary ring-4 ring-background" />

      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {icon}
        </div>
        <p className="text-primary text-sm font-medium">{subtitle}</p>
        <p className="text-muted-foreground text-sm">{date}</p>
        {description && (
          <p className="text-muted-foreground text-sm pt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
