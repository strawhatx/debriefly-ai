import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Brain, FileUp, Eye } from 'lucide-react';

const steps = [
  {
    id: 1,
    number: '01',
    name: 'Import',
    description: 'Upload your trades.',
    icon: FileUp,
    source: 'https://www.loom.com/embed/4b9ca8affc4b42f0940044253534f780?sid=b53fd4e3-9172-48f2-ac5d-2493ae807927',
  },
  {
    id: 2,
    number: '02',
    name: 'Review',
    description: 'Review imported trades.',
    icon: Eye,
    source: 'https://www.loom.com/embed/d1fd1a89329e4be2981f997bd112d40b?sid=0677ca18-6272-4f23-b674-c18d321432f4',
  
  },
  {
    id: 3,
    number: '03',
    name: 'Analyze',
    description: 'Run the analysis.',
    icon: Brain,
    source: 'https://www.loom.com/embed/caa315693236439a9623bf493222ba4b?sid=c0b4853e-3586-4e23-926b-f88c561e39d0',
  },
]

export const HowItWorks = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-primary">How It Works</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-balance">
            From Trading to Mastery – In 3 Simple Steps
          </p>
          <p className="mt-6 text-lg/8 text-gray-400">
            Forget endless journaling. In just a few steps, our AI turns your trades into clear, actionable insights.
          </p>
        </div>

        <div className="mx-auto max-w-2xl lg:max-w-4xl mt-12">
          <div className="w-full">
            <TabGroup>
              <TabList className="flex flex-col gap-6 sm:flex-row sm:justify-between">
                {steps.map((step) => (
                  <Tab
                    key={step.name}
                    className="w-full sm:w-auto"
                  >
                    <div className="flex gap-4 items-start p-4 rounded-lg ">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary hover:bg-white/20 data-[selected]:bg-white/10">
                        <step.icon aria-hidden="true" className="size-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">{step.number} – {step.name}</div>
                        <div className="text-xs text-gray-400">{step.description}</div>
                      </div>
                    </div>
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="mt-6">
                {steps.map(({ name, source }) => (
                  <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                    <div style={{ position: 'relative', paddingBottom: '45.3125%', height: 0 }}>
                        <iframe
                          src={source}
                          frameBorder="0"
                          allowFullScreen
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
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
