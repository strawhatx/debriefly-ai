
import { Card } from "@/components/ui/card";

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Latest Updates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="h-48 bg-primary/5 rounded-lg"></div>
              <h2 className="text-2xl font-semibold">Coming Soon</h2>
              <p className="text-muted-foreground">
                Our blog content is currently being prepared. Stay tuned for trading insights,
                analysis, and tips.
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog;
