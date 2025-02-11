
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-border/50">
    <div className="space-y-4">
      <div className="p-2 w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </Card>
);

export default FeatureCard;
