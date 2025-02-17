import { XMarkIcon } from '@heroicons/react/20/solid'



const features = [
  {
    name: 'Manual Logs Waste Time.',
    description:
      'Data entry alone doesn’t improve your results.',
    icon: XMarkIcon,
  },
  {
    name: 'Blind to Behavior Patterns',
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
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-emerald-600">Challenge the Status Quo</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
              Journaling Alone Won’t Make You a Better Trader
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
              You don’t need more logs. You need real insights.
              We combine AI analysis + trading psychology to show you what really drives your wins & losses.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-iemerald-600" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Product screenshot"
            src="https://tailwindui.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  )
}

