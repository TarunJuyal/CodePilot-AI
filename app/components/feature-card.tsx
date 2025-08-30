"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  link: string;
  isVisible: boolean;
}

export function FeatureCard({
  icon,
  title,
  description,
  features,
  link,
  isVisible,
}: FeatureCardProps) {
  const router = useRouter();
  if (!isVisible) return null;
  return (
    <Card
      className="w-full hover:shadow-lg transition-shadow duration-200 transform hover:scale-105"
      onClick={() => router.push(link)}
    >
      <CardHeader className="flex flex-col items-start space-y-2">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
        <CardContent>
          <ul className="space-y-1 list-disc">
            {features.map((feature, idx) => (
              <li key={idx} className="text-muted-foreground text-sm">
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
