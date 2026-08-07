// Mock company names for the marquee
const companies = [
  "أرامكو", "سابك", "STC", "نيوم", "مايكروسوفت",
  "جوجل", "أمازون", "الراجحي", "روشن", "علم"
]

export function TrustedBySection() {
  return (
    <section className="py-12 border-y border-white/5 bg-card">
      <div className="container mx-auto px-4 text-center mb-8">
        <p className="text-sm font-medium tracking-widest text-muted-foreground">
          موثوقون لدى نخبة من الشركات العالمية والمحلية
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        {/* Left Fade Gradient */}
        <div className="absolute start-0 top-0 z-10 h-full w-24 sm:w-48 bg-gradient-to-l from-card to-transparent pointer-events-none" />

        {/* Scrolling Content */}
        <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap">
          {[...companies, ...companies, ...companies].map((company, index) => (
            <div
              key={`${company}-${index}`}
              className="mx-8 sm:mx-16 flex items-center justify-center opacity-40 transition-all duration-300 hover:opacity-100 hover:text-primary"
            >
              <span className="text-2xl sm:text-3xl font-heading font-bold text-white">
                {company}
              </span>
            </div>
          ))}
        </div>

        {/* Right Fade Gradient */}
        <div className="absolute end-0 top-0 z-10 h-full w-24 sm:w-48 bg-gradient-to-r from-card to-transparent pointer-events-none" />
      </div>

      <style>{`
        /* Reversing marquee for RTL so it still flows naturally */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(33.33%); }
        }
      `}</style>
    </section>
  )
}
