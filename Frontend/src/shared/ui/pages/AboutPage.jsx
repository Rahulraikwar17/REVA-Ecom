import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Heart,
  ImageOff,
  Leaf,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

const IMG = (id, w, h) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const HEADLINE = [
  ["Clothing", "made", "simple,"],
  ["made", "for", "everyday."],
];

const MARQUEE = [
  "Made for everyday",
  "Honest prices",
  "Easy 7 day returns",
  "Cash on delivery",
  "Fast delivery across India",
];

const STATS = [
  { end: 10, suffix: "K+", decimals: 0, label: "Happy customers" },
  { end: 500, suffix: "+", decimals: 0, label: "Styles launched" },
  { end: 50, suffix: "+", decimals: 0, label: "Cities delivered" },
  { end: 4.8, suffix: "★", decimals: 1, label: "Average rating" },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Quality first",
    text: "Soft, breathable fabrics that feel good on day one and still look good after many washes.",
  },
  {
    icon: Heart,
    title: "Honest pricing",
    text: "No fake discounts or inflated tags. You pay a fair price for what you actually get.",
  },
  {
    icon: ShieldCheck,
    title: "Easy returns",
    text: "Does not fit? Return or exchange within 7 days without any awkward questions.",
  },
  {
    icon: Truck,
    title: "Fast delivery",
    text: "Quick dispatch across India, with Cash on Delivery available on every order.",
  },
];

const STEPS = [
  {
    title: "Pick your style",
    text: "Browse the collection and choose your size with the help of our size guide.",
  },
  {
    title: "Order in minutes",
    text: "Pay with UPI, card or net banking, or choose Cash on Delivery.",
  },
  {
    title: "Get it delivered",
    text: "We pack and dispatch your order quickly and deliver across India.",
  },
  {
    title: "Return if needed",
    text: "Does not fit? Return or exchange it within 7 days.",
  },
];

const FAQS = [
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes. Cash on Delivery is available on every order. You can also pay with UPI, cards or net banking.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes. You can return or exchange any item within 7 days of delivery if it does not fit or you simply changed your mind.",
  },
  {
    q: "How do I choose the right size?",
    a: "Check the size guide on any product page. If you are between two sizes and like a relaxed fit, go one size up.",
  },
  {
    q: "Where do you deliver?",
    a: "We deliver across India. Free delivery applies on orders above ₹999.",
  },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(prefersReducedMotion);

  useEffect(() => {
    if (inView || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return [ref, inView];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const PhotoReveal = ({
  src,
  alt,
  delay = 0,
  aspect = "aspect-[3/4]",
  eager = false,
  className = "",
}) => {
  const [ref, inView] = useInView();
  const [failed, setFailed] = useState(false);

  return (
    <div
      ref={ref}
      className={`${aspect} overflow-hidden rounded-lg bg-neutral-200 ${className}`}
    >
      <div
        style={{
          transitionDelay: `${delay}ms`,
          clipPath: inView ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
        }}
        className="h-full w-full transition-[clip-path] duration-1000 ease-out"
      >
        {failed ? (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <ImageOff size={32} />
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0"
          />
        )}
      </div>
    </div>
  );
};

const CountUp = ({ end, suffix = "", decimals = 0 }) => {
  const [ref, inView] = useInView();
  const [value, setValue] = useState(prefersReducedMotion() ? end : 0);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) {
      if (inView) setValue(end);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, end]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const Steps = () => {
  const [ref, inView] = useInView(0.3);

  return (
    <div ref={ref} className="mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
      {STEPS.map(({ title, text }, i) => (
        <div key={title} className="relative">
          <span
            style={{ transitionDelay: `${i * 300}ms` }}
            className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border text-sm font-bold transition duration-500 ${
              inView
                ? "border-[#0047AB] bg-[#0047AB] text-white"
                : "border-black/20 bg-white text-black"
            }`}
          >
            {i + 1}
          </span>

          {i < STEPS.length - 1 && (
            <>
              <span className="absolute left-12 top-6 hidden h-px w-[calc(100%-1.5rem)] bg-black/10 md:block" />
              <span
                style={{ transitionDelay: `${i * 300 + 250}ms` }}
                className={`absolute left-12 top-6 hidden h-px w-[calc(100%-1.5rem)] origin-left bg-[#0047AB] transition-transform duration-700 ease-out md:block ${
                  inView ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </>
          )}

          <h3 className="mt-5 text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {text}
          </p>
        </div>
      ))}
    </div>
  );
};

const Faq = () => {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-black/10 border-y border-black/10">
      {FAQS.map(({ q, a }, i) => {
        const isOpen = open === i;

        return (
          <div key={q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-semibold transition hover:text-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] sm:text-lg"
            >
              {q}
              <Plus
                size={20}
                className={`shrink-0 transition duration-300 ${
                  isOpen ? "rotate-45 text-[#0047AB]" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-10 leading-relaxed text-neutral-600">
                  {a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = `
@keyframes about-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.about-marquee { animation: about-marquee 32s linear infinite; }
.about-marquee:hover { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .about-marquee { animation: none; }
}
`;

const AboutPage = () => {
  const [ready, setReady] = useState(prefersReducedMotion);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  let wordIndex = 0;

  return (
    <div className="bg-white text-black">
      <style>{styles}</style>

      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8">
          <div>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {HEADLINE.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {line.map((word) => {
                    const delay = 100 + wordIndex++ * 80;

                    return (
                      <span
                        key={`${lineIndex}-${word}`}
                        className="mr-[0.25em] inline-block overflow-hidden align-bottom"
                      >
                        <span
                          style={{ transitionDelay: `${delay}ms` }}
                          className={`inline-block transition duration-700 ease-out ${
                            ready ? "translate-y-0" : "translate-y-[110%]"
                          }`}
                        >
                          {word}
                        </span>
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>

            <div
              style={{ transitionDelay: "700ms" }}
              className={`transition duration-700 ease-out ${
                ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <div className="mt-8 h-1 w-14 rounded-full bg-[#0047AB]" />
              <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                We started REVA with one idea: good basics should not be
                complicated or expensive. T-shirts, shirts and denim you can
                wear on repeat, and feel great in every time.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center rounded-md bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0047AB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
                >
                  Shop the collection
                </Link>
                <a
                  href="#how-it-works"
                  className="text-sm font-semibold text-black underline decoration-[#0047AB] decoration-2 underline-offset-8 transition hover:text-[#0047AB]"
                >
                  See how ordering works
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <PhotoReveal
                src={IMG(36942018, 600, 800)}
                alt="REVA t-shirt"
                delay={300}
                eager
              />
              <div
                style={{ transitionDelay: "1100ms" }}
                className={`absolute -bottom-5 -right-4 flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-xl shadow-black/15 ring-1 ring-black/5 transition duration-700 ease-out sm:-right-8 ${
                  ready ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Star size={22} className="fill-[#0047AB] text-[#0047AB]" />
                <div>
                  <p className="text-lg font-bold leading-none">4.8</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Average rating
                  </p>
                </div>
              </div>
            </div>

            <PhotoReveal
              src={IMG(8162656, 600, 800)}
              alt="REVA shirt"
              delay={500}
              eager
              className="mt-12"
            />
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-black py-4 text-white">
        <div className="about-marquee flex w-max">
          {[...MARQUEE, ...MARQUEE].map((text, i) => (
            <span
              key={i}
              className="flex items-center gap-10 whitespace-nowrap pr-10 text-sm font-medium sm:text-base"
            >
              {text}
              <span className="h-1.5 w-1.5 rounded-full bg-[#0047AB]" />
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="grid grid-cols-2 gap-4">
          <PhotoReveal src={IMG(36942017, 600, 800)} alt="REVA t-shirts" />
          <PhotoReveal
            src={IMG(16701709, 600, 800)}
            alt="REVA style"
            delay={200}
            className="mt-10"
          />
        </div>

        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our story
          </h2>
          <p className="mt-5 leading-relaxed text-neutral-600">
            REVA began as a small idea in Bhopal. We were tired of choosing
            between cheap clothes that fall apart and expensive ones with a big
            brand tax. So we set out to build something in the middle.
          </p>
          <p className="mt-4 leading-relaxed text-neutral-600">
            Every piece we sell is picked for fit, fabric and how well it works
            with the rest of your wardrobe. We keep our range focused, so you
            spend less time scrolling and more time wearing.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center rounded-md border border-black px-6 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2"
          >
            Explore the collection
          </Link>
        </Reveal>
      </section>

      <section className="border-t-4 border-[#0047AB] bg-black text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-14 text-center sm:px-6 md:grid-cols-4 md:divide-x md:divide-white/15 lg:px-8">
          {STATS.map(({ label, ...stat }) => (
            <div key={label}>
              <p className="text-4xl font-bold tabular-nums sm:text-5xl">
                <CountUp {...stat} />
              </p>
              <p className="mt-2 text-sm text-white/70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why people choose REVA
          </h2>
          <p className="mt-3 text-neutral-600">
            A few simple promises we try to keep with every order.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="group h-full rounded-lg border border-black/10 p-6 transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-black transition duration-300 group-hover:bg-[#0047AB] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-black/10 bg-neutral-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How ordering works
            </h2>
            <p className="mt-3 text-neutral-600">
              From your first click to your doorstep in four simple steps.
            </p>
          </Reveal>

          <Steps />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Common questions
          </h2>
          <p className="mt-3 max-w-sm text-neutral-600">
            Quick answers about delivery, returns and sizing. Need more help?
            Write to support@reva.com.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <Faq />
        </Reveal>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-black px-6 py-16 text-center text-white sm:px-12">
            <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-[#0047AB]" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to find your next favourite?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/75">
              Browse the latest styles and get free delivery on orders above
              ₹999.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center rounded-md bg-white px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-[#0047AB] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Shop now
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default AboutPage;