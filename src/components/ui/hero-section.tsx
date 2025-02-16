
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { cn } from "@/lib/utils";

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "glow";
  onClick?: () => void;
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  title: string;
  description: string;
  actions: HeroAction[];
  image: {
    light: string;
    dark: string;
    alt: string;
  };
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background/50 to-background py-12 sm:py-24 md:py-32">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:16px_16px] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          {/* Badge */}
          {badge && (
            <Badge variant="outline" className="animate-appear gap-2">
              <span className="text-muted-foreground">{badge.text}</span>
              <a href={badge.action.href} className="flex items-center gap-1">
                {badge.action.text}
                <ArrowRight className="h-3 w-3" />
              </a>
            </Badge>
          )}

          {/* Title */}
          <h1 className="animate-appear bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl sm:leading-tight md:text-7xl">
            {title}
          </h1>

          {/* Description */}
          <p className="animate-appear text-lg text-muted-foreground opacity-0 delay-100 sm:text-xl">
            {description}
          </p>

          {/* Actions */}
          <div className="flex animate-appear justify-center gap-4 opacity-0 delay-200">
            {actions.map((action, index) => (
              <Button key={index} variant={action.variant} size="lg" asChild onClick={action.onClick}>
                <a href={action.href} className="flex items-center gap-2">
                  {action.icon}
                  {action.text}
                </a>
              </Button>
            ))}
          </div>

          {/* Image with Glow */}
          <div className="relative mt-12 w-full max-w-5xl">
            <MockupFrame
              className="animate-appear opacity-0 delay-300"
              size="small"
            >
              <Mockup type="responsive">
                <img
                  src={image.light}
                  alt={image.alt}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </Mockup>
            </MockupFrame>
            <Glow
              variant="top"
              className="animate-appear-zoom opacity-0 delay-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
