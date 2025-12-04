type UniversalHeroProps = {
  title: string;
  gradientText: string;
  afterText?: string;
  description: string;
  badgeText: string;
};
export default function UniversalHero({
  title,
  gradientText,
  afterText,
  description,
  badgeText,
}: UniversalHeroProps) {
  return (
    <section className="md:py-28 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {title}
            <span className="gradient-text"> {gradientText}</span> {afterText}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">{description}</p>
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-[#006d5b]/10 text-[#43d49d] text-sm font-medium mb-6 border border-[#006d5b]/20">
            <span className="w-3 h-3 bg-[#43d49d] rounded-full mr-3 animate-pulse"></span>
            {badgeText}
          </div>
        </div>
      </div>
    </section>
  );
}
