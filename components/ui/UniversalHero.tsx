type UniversalHeroProps = {
  title: string;
  description: string;
};
export default function UniversalHero({
  title,
  description,
}: UniversalHeroProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
