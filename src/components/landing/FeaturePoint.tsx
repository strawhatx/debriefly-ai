
import { CheckCircle2 } from "lucide-react";

interface FeaturePointProps {
  title: string;
  description: string;
}

const FeaturePoint = ({ title, description }: FeaturePointProps) => (
  <div className="flex gap-3">
    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default FeaturePoint;
