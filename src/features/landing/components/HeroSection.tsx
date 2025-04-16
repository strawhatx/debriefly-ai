import { Link } from "react-router-dom";
import { HeroDialog } from "./HeroDialog";

export const HeroSection = () => {
  return (
    <section className="relative isolate lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="mx-auto max-w-2xl pt-32 pb-10 md:pt-28 lg:pt-30">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 ring-1 ring-ring hover:ring-emerald-200">
            Announcing our next round of funding.{' '}
            <a href="#" className="font-semibold text-primary">
              <span aria-hidden="true" className="absolute inset-0" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            Go Beyond Trade Journaling
          </h1>
          <p className="mt-8 text-lg text-pretty text-gray-400 sm:text-xl/8">
            Unlock AI-Powered Insights into Your Trading Psychology & Performance.
            Master Your Behavior. Sharpen Your Strategy. Trade with Confidence.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/login"
              className="rounded-md bg-primary border-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              🚀 Start Free Trial
            </Link>
            <HeroDialog />
          </div>
        </div>
      </div>
      <div className="@container relative h-[20rem] md:h-[35rem] w-full">
        <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[3cqw] border-x-[1cqw] border-t-[1cqw] border-gray-700 bg-gray-900 shadow-2xl">
          <img
            className="size-full object-cover object-left-top"
            src="/landing/dashboard.png"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};
