
import { Brain, BarChart2, FileUp} from 'lucide-react';

const features = [
  {
    name: 'Log Your Trades',
    description:
      'No complex spreadsheets. Just enter your trade details or import them in bulk. Add quick emotion tags (like "FOMO" or "Hesitated") for richer insights',
    icon: FileUp,
  },
  {
    name: 'AI Analyzes Your Session',
    description:
      'Our AI scans your trades and behavior patterns. It looks beyond P/L to detect emotional triggers, decision-making flaws, and opportunities to optimize your edge.',
    icon: Brain,
  },
  {
    name: 'Get Your Debrief Report',
    description:
      'Receive a personalized report showing what went well, what held you back, and AI-powered adjustments for your next trading day.',
    icon: BarChart2,
  },
]

export const HowItWorks = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-emerald-600">How It Works</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
          From Trading to Mastery – In 3 Simple Steps
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
          Forget endless journaling. In just a few minutes, our AI turns your trades into clear, actionable insights.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-emerald-600">
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

