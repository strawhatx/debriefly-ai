import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const HeroSection = () => {
  return (
    <div className="relative isolate lg:px-8">
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
      <div className="mx-auto max-w-2xl pt-32 pb-10 sm:pt-48 lg:pt-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Announcing our next round of funding.{' '}
            <a href="#" className="font-semibold text-emerald-600">
              <span aria-hidden="true" className="absolute inset-0" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Go Beyond Trade Journaling
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Unlock AI-Powered Insights into Your Trading Psychology & Performance.
            Master Your Behavior. Sharpen Your Strategy. Trade with Confidence.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/login"
              className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              🚀 Start Free Trial
            </Link>
            <Button variant="outline" className="text-sm/6 font-semibold text-gray-900">
              🔍 See How It Works
            </Button>
          </div>
        </div>
      </div>
      <div className="@container relative h-[20rem] md:h-[35rem] w-full">
        <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[5cqw] border-x-[1cqw] border-t-[1cqw] border-gray-700 bg-gray-900 shadow-2xl">
          <img
            className="size-full object-cover object-top"
            src="https://tailwindui.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
