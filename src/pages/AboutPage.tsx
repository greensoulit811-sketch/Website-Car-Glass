import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePageContent } from '@/hooks/usePageContents';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const { data: page, isLoading } = usePageContent('about');

  return (
    <div className="min-h-screen bg-background pt-32 lg:pt-36">
      <Navbar />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="heading-display text-4xl md:text-6xl font-bold mb-8 text-foreground">
              {isLoading ? 'Loading...' : page?.page_title || 'About Us'}
            </h1>
            {page?.content && (
              <div className="prose prose-lg max-w-none">
                {page.content.split('\n').map((paragraph, i) => (
                  paragraph.trim() ? (
                    <p key={i} className="font-body text-muted-foreground leading-relaxed mb-6 text-base md:text-lg">
                      {paragraph}
                    </p>
                  ) : null
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
