import { ChartBarIncreasing, Eye, PieChart, Settings, User2 } from "lucide-react"
import { Card } from "../../../components/ui/card"

const features = [
  {
    name: 'Trade Reviews.',
    description:
      'Import your trades and get accurate, AI-assisted analysis. Review R:R, strategy effectiveness, and emotional tags to improve every trading session.',
    icon: Eye,
  },
  {
    name: 'Session Performance.',
    description:
      'Understand What’s Working – After every trading session, you receive a performance breakdown with clear takeaways: What went well, what held you back, and your key metrics.',
    icon: ChartBarIncreasing,
  },
  {
    name: 'Behavior Analysis.',
    description: 'See Your Hidden Patterns – Our AI detects behavioral traps like revenge trading, hesitation, and FOMO. You’ll get clear feedback on how emotions influence your decisions.',
    icon: User2,
  },
  {
    name: 'Strategy Refinemets.',
    description: 'Fine-Tune Your Edge With AI Feedback – Our system analyzes your trades over time and suggests data-backed adjustments to optimize your setups and risk management.',
    icon: Settings,
  },
]

export const Solutions = () => {
  return (
    <section className="bg-gray-800 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Card className="bg-background p-12 rounded-lg">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <p className="mt-2 text-lg/8 font-semibold tracking-tight text-pretty text-gray-300 sm:text-3xl lg:text-balance">
              This Is Perfect for Traders Who Want to Get Better – Not Just Log More
            </p>
            <p className="mt-3 text-md text-gray-500">
              Journals track your trades. We track you—your behavior, mindset, and edge.
              With AI-powered performance reviews, emotional insights, and strategy feedback, you’ll know exactly what’s working—and what’s holding you back.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-2xl sm:mt-20 lg:mt-10 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base/7 font-semibold text-gray-300">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                      <feature.icon aria-hidden="true" className="size-6 text-white" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base/7 text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>
      </div>
    </section>
  )
}
