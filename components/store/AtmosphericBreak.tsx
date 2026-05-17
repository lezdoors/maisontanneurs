import Image from "next/image";

interface AtmosphericBreakProps {
  image: string;
  alt: string;
  text?: string;
  height?: string;
  objectPosition?: string;
  dark?: boolean;
  scale?: boolean;
}

export default function AtmosphericBreak({
  image,
  alt,
  text,
  height = "70vh",
  objectPosition = "center",
  dark = true,
  scale = false,
}: AtmosphericBreakProps) {
  return (
    <section
      className={`relative overflow-hidden ${dark ? "bg-ink" : "bg-paper"}`}
      style={{ height }}
    >
      <Image
        src={image}
        alt={alt}
        fill
        className={`object-cover ${scale ? "scale-110" : ""}`}
        style={{ objectPosition }}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      {text && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="font-serif text-[clamp(14px,1.2vw,18px)] italic text-white/60 tracking-[0.15em] text-center max-w-[40ch]">
            {text}
          </p>
        </div>
      )}
    </section>
  );
}
