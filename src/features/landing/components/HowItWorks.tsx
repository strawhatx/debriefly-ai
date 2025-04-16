import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Brain, FileUp, Eye } from 'lucide-react';

const steps = [
  {
    id: 1,
    number: '01',
    name: 'Import',
    description: 'Upload your trades in seconds.',
    icon: FileUp,
    source: 'https://www.tradervue.com/',
  },
  {
    id: 2,
    number: '02',
    name: 'Review',
    description: 'Review imported trades add strategy; R:R emotional tags ect...',
    icon: Eye,
    source: 'https://www.tradervue.com/',
  },
  {
    id: 3,
    number: '03',
    name: 'View Results',
    description: 'Get AI-assisted analysis of your trades.',
    icon: Brain,
    source: 'https://www.tradervue.com/',
  },
]

export const HowItWorks = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-primary">How It Works</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-balance">
            From Trading to Mastery – In 3 Simple Steps
          </p>
          <p className="mt-6 text-lg/8 text-gray-400">
            Forget endless journaling. In just a few minutes, our AI turns your trades into clear, actionable insights.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex h-screen w-full justify-center pt-24 px-4">
          <div className="w-full max-w-md">
            <TabGroup>
              <TabList className="flex gap-4">
                {steps.map((step) => (
                  <Tab
                    key={step.name}
                    className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    <div className="text-base/7 font-semibold text-gray-900">
                      <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-destructive">
                        <step.icon aria-hidden="true" className="size-6 text-white" />
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-md font-semibold">{step.number}</span>
                        <span className="text-xs text-gray-400">{step.name}</span>
                        <span className="text-xs text-gray-400">{step.description}</span>
                      </div>
                    </div>
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="mt-3">
                {steps.map(({ name, source }) => (
                  <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center justify-center">
                      <img
                        src={source}
                        alt={name}
                        className="h-48 w-48 rounded-lg object-cover"
                      />
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </section>
  )
}

