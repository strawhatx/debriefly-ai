import { Link } from "react-router-dom"
import { Card } from "../ui/card"
import { ArrowRight } from "lucide-react"

export const CtaSection = () => {
  return (
    <section className="py-[10rem]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl font-bold mb-4">Ready to Trade with Confidence?</h2>
      <p className="text-gray-400 max-w-2xl mx-auto mb-8">
        Join thousands of traders who've elevated their performance with AI-powered insights.
      </p>
      <Link
        to="/signup"
        className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-emerald-300 rounded-lg font-medium group"
      >
        Start Your Free Trial
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </section>
  )
}

