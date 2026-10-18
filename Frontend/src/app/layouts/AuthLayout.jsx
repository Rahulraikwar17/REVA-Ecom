import { Outlet, useLocation } from "react-router";
import { Layers, Lock, ShieldCheck, Zap } from "lucide-react";

const content = {
  login: {
    title: "Good to see you again.",
    subtitle:
      "Pick up right where you left off. Your cart, your orders and your store are waiting.",
  },
  register: {
    title: "Create your account in seconds.",
    subtitle:
      "Shop what you love or sell your own products, all from one simple place.",
  },
};

const features = [
  { icon: ShieldCheck, text: "Secure sign in that keeps your data safe" },
  { icon: Zap, text: "Fast, simple and distraction free" },
  { icon: Layers, text: "Shopping and selling together in one place" },
];

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap");

@keyframes auth-rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes auth-float {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(30px, -36px, 0) scale(1.08); }
}
@keyframes auth-grid {
  from { background-position: 0 0; }
  to { background-position: 48px 48px; }
}
@keyframes auth-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.auth-rise {
  opacity: 0;
  animation: auth-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.auth-float { animation: auth-float 14s ease-in-out infinite; }
.auth-grid { animation: auth-grid 8s linear infinite; }
.auth-shake { animation: auth-shake 0.4s ease; }

@media (prefers-reduced-motion: reduce) {
  .auth-rise { animation: none; opacity: 1; }
  .auth-float, .auth-grid, .auth-shake { animation: none; }
}
`;

const AuthLayout = () => {
  const { pathname } = useLocation();
  const copy = pathname.includes("register") ? content.register : content.login;

  return (
    <div
      className="flex min-h-screen bg-white"
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      <style>{styles}</style>

      <aside className="relative hidden w-1/2 overflow-hidden bg-black lg:flex xl:w-[55%]">
        <div
          className="auth-grid absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="auth-float absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-[#0047AB]/45 blur-3xl" />
        <div
          className="auth-float absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-[#0047AB]/35 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
          <div
            className="auth-rise inline-flex w-fit items-center rounded-xl bg-white px-3.5 py-2.5 shadow-xl shadow-black/40"
            style={{ animationDelay: "0ms" }}
          >
            <img src="/logo.png" alt="REVA" className="h-8 w-auto" />
          </div>

          <div className="max-w-lg">
            <div key={pathname}>
              <h2
                className="auth-rise text-4xl font-extrabold leading-[1.1] tracking-tight text-white xl:text-5xl"
                style={{ animationDelay: "100ms" }}
              >
                {copy.title}
              </h2>

              <p
                className="auth-rise mt-5 text-base leading-relaxed text-neutral-400"
                style={{ animationDelay: "220ms" }}
              >
                {copy.subtitle}
              </p>
            </div>

            <ul className="mt-10 space-y-4">
              {features.map(({ icon: Icon, text }, i) => (
                <li
                  key={text}
                  className="auth-rise flex items-center gap-3"
                  style={{ animationDelay: `${380 + i * 120}ms` }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-[#5B93FF]">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm text-neutral-300">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="auth-rise flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
            style={{ animationDelay: "800ms" }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0047AB] text-white">
              <Lock size={18} />
            </span>
            <p className="text-sm leading-relaxed text-neutral-300">
              Your account is protected. We never share your personal
              information.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex w-full flex-1 flex-col items-center justify-center bg-white px-5 py-10 sm:px-8 lg:w-1/2 xl:w-[45%]">
        <div className="auth-rise mb-10 lg:hidden">
          <img src="/logo.png" alt="REVA" className="h-10 w-auto" />
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;