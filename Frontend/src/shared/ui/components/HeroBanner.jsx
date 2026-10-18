import React from "react";
import { Link } from "react-router";

const MARQUEE_ITEMS = [
  "New season",
  "Free delivery above ₹999",
  "Cash on delivery",
  "7-day easy returns",
  "100% cotton",
];

const STATS = [
  { value: "₹999+", label: "Free delivery" },
  { value: "7 days", label: "Easy returns" },
  { value: "COD", label: "Pay on arrival" },
];

// Every text, link and the image can be overridden through props
const HeroBanner = ({
  badge = "New season",
  title = "Style that fits your everyday.",
  subtitle = "Fresh t-shirts, shirts and denim at prices that make sense. Free delivery on orders above ₹999.",
  primaryText = "Shop now",
  primaryTo = "/products",
  secondaryText = "New arrivals",
  secondaryTo = "/products?sort=new",
  image = "https://images.pexels.com/photos/16059703/pexels-photo-16059703.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1500",
}) => {
  const words = title.split(" ");

  return (
    <section className="bg-white">
      <style>{`
        @keyframes hero-word { from { transform: translateY(110%); } to { transform: translateY(0); } }
        @keyframes hero-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hero-reveal { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes hero-zoom { from { transform: scale(1.18); } to { transform: scale(1); } }
        @keyframes hero-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes hero-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .hero-word { display: inline-block; animation: hero-word 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .hero-rise { animation: hero-rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .hero-reveal { animation: hero-reveal 1.2s cubic-bezier(0.7, 0, 0.2, 1) 0.2s both; }
        .hero-zoom { animation: hero-zoom 2.4s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .hero-float { animation: hero-float 5s ease-in-out infinite; }
        .hero-marquee { animation: hero-marquee 35s linear infinite; will-change: transform; }

        @media (prefers-reduced-motion: reduce) {
          .hero-word, .hero-rise, .hero-reveal, .hero-zoom, .hero-float {
            animation: none !important;
          }
          .hero-marquee { animation-duration: 60s; }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20 lg:px-8">
        {/* Text */}
        <div>
          <span
            className="hero-rise inline-flex items-center gap-2 rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black"
            style={{ animationDelay: "0ms" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0047AB] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0047AB]" />
            </span>
            {badge}
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-black sm:text-6xl lg:text-7xl">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="mr-[0.25em] inline-block overflow-hidden align-bottom"
              >
                <span
                  className="hero-word"
                  style={{ animationDelay: `${150 + i * 90}ms` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-rise mt-6 max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg"
            style={{ animationDelay: "700ms" }}
          >
            {subtitle}
          </p>

          <div
            className="hero-rise mt-9 flex flex-wrap gap-3"
            style={{ animationDelay: "850ms" }}
          >
            <Link
              to={primaryTo}
              className="rounded-md bg-black px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
            >
              {primaryText}
            </Link>
            <Link
              to={secondaryTo}
              className="rounded-md border border-black px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              {secondaryText}
            </Link>
          </div>

          <dl
            className="hero-rise mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-black/10 pt-6"
            style={{ animationDelay: "1000ms" }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <dt className="text-xl font-bold text-black sm:text-2xl">
                  {value}
                </dt>
                <dd className="mt-1 text-xs text-neutral-600 sm:text-sm">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Image */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className="absolute -bottom-4 -right-4 h-full w-full rounded-lg border-2 border-[#0047AB]"
            aria-hidden="true"
          />

          <div className="hero-reveal relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-200">
            <img
              src={image}
              alt="Latest collection"
              referrerPolicy="no-referrer"
              className="hero-zoom h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div
            className="hero-rise absolute -left-3 bottom-8 sm:-left-8"
            style={{ animationDelay: "1300ms" }}
          >
            <Link
              to={secondaryTo}
              className="hero-float block rounded-lg bg-white px-5 py-4 shadow-xl ring-1 ring-black/10 transition hover:ring-[#0047AB]"
            >
              <p className="text-xs text-neutral-600">Just landed</p>
              <p className="mt-0.5 text-sm font-semibold text-black">
                Shop the latest drop
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden bg-black py-4" aria-hidden="true">
        <div className="hero-marquee flex w-max">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center">
              {[0, 1, 2, 3].map((repeat) =>
                MARQUEE_ITEMS.map((item) => (
                  <span
                    key={`${group}-${repeat}-${item}`}
                    className="flex shrink-0 items-center whitespace-nowrap text-sm font-medium text-white"
                  >
                    <span className="px-8">{item}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0047AB]" />
                  </span>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;