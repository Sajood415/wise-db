type UniversalHeroProps = {
  title: string;
  description: string;
};
export default function UniversalHero({
  title,
  description,
}: UniversalHeroProps) {
  return (
    <section className="md:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">{description}</p>
        </div>
      </div>
    </section>
  );
}
