import { Card } from "../../../components/ui/card"

export const SolutionBentoGrid = () => {
  return (
    <section className="bg-gray-800 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-3 lg:max-w-7xl lg:px-8">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-3xl">
          <h2 className="mx-auto text-center text-base/7 font-semibold text-emerald-600">What We Do Instead</h2>
          <p className="mx-auto text-center mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
            Beyond Journals – Your Personal Trading Coach Powered by AI
          </p>
          <p className="mt-6 text-center text-lg/8 text-gray-400">
            Trade journals only track your past. We unlock what’s behind your results—your mindset, habits, and strategy performance—so you can actually improve.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-2 lg:grid-rows-2">
          <Card className="relative lg:row-span-2 pb-0 bg-background">
            <div className="relative flex flex-col overflow-hidden ">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight max-lg:text-center">
                  Behavior Analysis
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                  <b>See Your Hidden Patterns</b> – Our AI detects behavioral traps like revenge trading, hesitation, and FOMO. You’ll get clear feedback on how emotions influence your decisions.
                </p>
              </div>
              <div className="@container relative min-h-[34rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[5cqw] border-x-[1cqw] border-t-[1cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <img
                    className="size-full object-cover object-top bg-primary"
                    src="https://tailwindui.com/plus-assets/img/component-images/bento-03-mobile-friendly.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </Card>
          <Card className="relative max-lg:row-start-1 bg-background">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight max-lg:text-center">AI Performance Reports</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                  <b>Understand What’s Working</b> – After every trading session, you receive a performance breakdown with clear takeaways: What went well, what held you back, and your key metrics.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <img
                  className="w-full max-lg:max-w-xs"
                  src="https://tailwindui.com/plus-assets/img/component-images/bento-03-performance.png"
                  alt=""
                />
              </div>
            </div>

          </Card>
          <Card className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2 bg-background">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight max-lg:text-center">Strategy Refinement</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                  <b>Fine-Tune Your Edge With AI Feedback</b> – Our system analyzes your trades over time and suggests data-backed adjustments to optimize your setups and risk management.
                </p>
              </div>
              <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                <img
                  className="h-[min(152px,40cqw)] object-cover"
                  src="https://tailwindui.com/plus-assets/img/component-images/bento-03-security.png"
                  alt=""
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

