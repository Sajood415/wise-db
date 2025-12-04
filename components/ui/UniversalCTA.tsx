import Link from "next/link";

type UniversalCTAProps = {
  title: string;
  description: string;
  cta1: string;
  cta2: string;
  cta1Href: string;
  cta2Href: string;
};

export default function UniversalCTA({
  title,
  description,
  cta1,
  cta2,
  cta1Href,
  cta2Href,
}: UniversalCTAProps) {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-medium text-primary mb-4">
          {title}
        </h2>
        <p className="text-xl text-primary/80 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={cta1Href}
            className="bg-[#FFC21A] text-primary hover:bg-primary hover:text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-sm"
          >
            {cta1}
          </Link>
          <Link
            href={cta2Href}
            className="text-white hover:text-white bg-primary hover:bg-primary/20 hover:text-[#006d5b] font-semibold py-3 px-8 rounded-full transition-colors duration-200"
          >
            {cta2}
          </Link>
        </div>
      </div>
    </section>
  );
}
