import { motion } from 'framer-motion';

interface SkillBadgeProps {
  skill: string;
  index: number;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function SkillBadge({ skill, index, variant = 'secondary' }: SkillBadgeProps) {
  const variants = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border text-foreground hover:bg-muted',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${variants[variant]} transition-colors`}
    >
      {skill}
    </motion.span>
  );
}
