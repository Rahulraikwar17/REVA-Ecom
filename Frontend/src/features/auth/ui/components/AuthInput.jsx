import { forwardRef, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const AuthInput = forwardRef(
  ({ label, icon: Icon, type = "text", error, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && visible ? "text" : type;

    return (
      <div>
        <label className="mb-2 block text-sm font-semibold text-neutral-900">
          {label}
        </label>

        <div className="group relative">
          <Icon
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-200 group-focus-within:text-[#0047AB]"
          />

          <input
            ref={ref}
            type={inputType}
            {...props}
            className={`w-full rounded-xl border bg-white py-3.5 pl-11 text-sm text-neutral-900 outline-none transition duration-200 placeholder:text-neutral-400 hover:border-neutral-400 focus:border-[#0047AB] focus:ring-4 focus:ring-[#0047AB]/15 ${
              isPassword ? "pr-12" : "pr-4"
            } ${error ? "border-red-400" : "border-neutral-300"}`}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              aria-label={visible ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-neutral-400 transition hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <p className="auth-shake mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle size={13} />
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";

export default AuthInput;