import { XMarkIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Manual Logs Waste Time.',
    description:
      'Data entry alone doesn’t improve your results.',
    icon: XMarkIcon,
  },
  {
    name: 'Blind to Behavior Patterns.',
    description: 'FOMO, Revenge Trades—hard to see them yourself.',
    icon: XMarkIcon,
  },
  {
    name: 'No Strategy Feedback.',
    description: 'Your edge can weaken without data-driven tweaks.',
    icon: XMarkIcon,
  },
]


export const JournalingFeature = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-base/7 font-semibold text-primary">Challenge the Status Quo</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
          Journaling Alone Won’t Make You a Better Trader
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
          You don’t need more logs. You need real insights.
          We combine AI analysis + trading psychology to show you what really drives your wins & losses.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-destructive">
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
