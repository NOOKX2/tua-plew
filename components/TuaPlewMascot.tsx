import Image from "next/image";
import {
  MASCOT_ALT,
  MASCOT_IMAGES,
  type MascotPose,
} from "@/lib/mascot";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

export type MascotVariant = "default" | "on-dark" | "on-brand" | "subtle";

const sizeClasses: Record<Size, string> = {
  xs: "h-9 w-9",
  sm: "h-14 w-14",
  md: "h-[5.5rem] w-[5.5rem]",
  lg: "h-28 w-28 sm:h-32 sm:w-32",
  xl: "h-36 w-36 sm:h-44 sm:w-44",
  hero: "h-48 w-48 sm:h-60 sm:w-60 lg:h-72 lg:w-72",
};

const imagePadding: Record<Size, string> = {
  xs: "p-0.5",
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
  xl: "p-2.5",
  hero: "p-3",
};

const shadowByVariant: Record<MascotVariant, string> = {
  default:
    "drop-shadow-[0_10px_28px_rgba(24,24,27,0.16)]",
  "on-dark":
    "drop-shadow-[0_16px_40px_rgba(0,0,0,0.55)]",
  "on-brand":
    "drop-shadow-[0_14px_36px_rgba(15,23,42,0.35)]",
  subtle: "drop-shadow-[0_4px_12px_rgba(24,24,27,0.12)]",
};

const groundByVariant: Record<MascotVariant, string> = {
  default: "bg-zinc-900/15",
  "on-dark": "bg-black/35",
  "on-brand": "bg-blue-950/25",
  subtle: "bg-zinc-900/10",
};

type Props = {
  pose: MascotPose;
  size?: Size;
  variant?: MascotVariant;
  className?: string;
  priority?: boolean;
  floating?: boolean;
  showGround?: boolean;
};

export default function TuaPlewMascot({
  pose,
  size = "md",
  variant = "default",
  className = "",
  priority = false,
  floating = false,
  showGround = true,
}: Props) {
  const showGroundShadow =
    showGround && size !== "xs" && size !== "sm";

  return (
    <div
      className={`relative shrink-0 ${sizeClasses[size]} ${
        floating ? "animate-[mascot-float_4s_ease-in-out_infinite]" : ""
      } ${className}`}
      aria-hidden={className.includes("sr-only") ? undefined : true}
    >
      {variant === "on-brand" && (
        <div
          className="absolute inset-[8%] rounded-full bg-white/20 blur-2xl"
          aria-hidden
        />
      )}

      {showGroundShadow && (
        <div
          className={`absolute bottom-[4%] left-1/2 h-[9%] w-[52%] -translate-x-1/2 rounded-[100%] blur-md ${groundByVariant[variant]}`}
          aria-hidden
        />
      )}

      <div className={`relative h-full w-full ${imagePadding[size]}`}>
        <Image
          src={MASCOT_IMAGES[pose]}
          alt={MASCOT_ALT}
          fill
          priority={priority}
          sizes="(max-width: 640px) 40vw, 280px"
          className={`object-contain object-bottom ${shadowByVariant[variant]}`}
        />
      </div>
    </div>
  );
}
