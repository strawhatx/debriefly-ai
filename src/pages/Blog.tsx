import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Blog = () => {
  const featuredPost = {
    title: "How AI is Revolutionizing Trading Psychology",
    excerpt: "Discover how artificial intelligence is helping traders overcome emotional biases and improve their decision-making process.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    date: "March 15, 2024",
    author: "Sarah Chen",
    category: "Trading Psychology"
  };

  const posts = [
    {
      title: "5 Common Trading Behaviors That Hurt Your Performance",
      excerpt: "Learn about the psychological patterns that might be affecting your trading results and how to address them.",
      date: "March 12, 2024",
      author: "Michael Roberts",
      category: "Behavior Analysis"
    },
    {
      title: "Using Data to Optimize Your Trading Strategy",
      excerpt: "A deep dive into how data analysis can help you refine your trading approach and improve your win rate.",
      date: "March 10, 2024",
      author: "David Kumar",
      category: "Strategy"
    },
    {
      title: "The Power of Post-Trade Analysis",
      excerpt: "Why reviewing your trades is crucial for long-term success and how to do it effectively.",
      date: "March 8, 2024",
      author: "Lisa Thompson",
      category: "Trade Review"
    }
  ];

  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Trading Insights</h1>
          <p className="text-gray-400">
            Expert analysis, trading psychology, and strategy optimization tips to help you trade better.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Link to="/blog/ai-trading-psychology" className="block group">
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                  <span className="px-3 py-1 bg-emerald-600 rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-300 max-w-3xl">
                  {featuredPost.excerpt}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Posts */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link
              key={index}
              to={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="group"
            >
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-emerald-500/50 transition-colors">
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="px-3 py-1 bg-gray-700 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-6">
              Get the latest trading insights and strategy tips delivered to your inbox.
            </p>
            <form className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium flex items-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}