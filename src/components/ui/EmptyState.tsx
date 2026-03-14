import { cn } from "@/lib/utils";
import { LucideIcon, PackageOpen } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action &&
        (action.href ? (
          <a href={action.href}>
            <Button variant="primary" size="md">
              {action.label}
            </Button>
          </a>
        ) : (
          <Button variant="primary" size="md" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
    </div>
  );
}
