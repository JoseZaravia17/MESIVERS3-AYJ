import { config } from "@/data/config";
import { GoldLocket } from "./hearts";

const pad = (n: number) => String(n).padStart(2, "0");

/** Anchos de barra deterministas a partir del número de razón. */
function barWidths(seed: number) {
  let s = seed * 9301 + 49297;
  return Array.from({ length: 46 }, () => {
    s = (s * 9301 + 49297) % 233280;
    return 1 + Math.floor((s / 233280) * 3);
  });
}

function Barcode({ seed }: { seed: number }) {
  const bars = barWidths(seed);
  return (
    <div className="flex h-10 items-stretch justify-center gap-[2px]">
      {bars.map((w, i) => (
        <span
          key={i}
          className="bg-[var(--love-ink)]"
          style={{ width: w, opacity: i % 7 === 3 ? 0 : 1 }}
        />
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

export function Receipt({
  index,
  total,
  text,
}: {
  index: number;
  total: number;
  text: string;
}) {
  const n = index + 1;
  return (
    <article className="relative w-[300px] select-none sm:w-[340px]">
      <div className="receipt-paper relative px-5 pt-3 pb-4 text-[var(--love-ink)] shadow-[0_18px_40px_-12px_rgba(60,0,10,0.55)]">
        <p className="font-receipt text-center text-[9px] tracking-[0.25em] opacity-80">
          RECIBOS DEL CORAZÓN · {config.de.toUpperCase()} &amp;{" "}
          {config.para.toUpperCase()}
        </p>
        <div className="receipt-dots -mx-5 mt-2" />

        <header className="mt-4 text-center">
          <h3 className="font-rubik text-[22px] font-extrabold tracking-tight">
            RECIBO DE AMOR
          </h3>
          <p className="font-receipt text-sm tracking-widest">
            N.º {pad(n)} de {pad(total)}
          </p>
        </header>

        <div className="font-receipt mt-4 space-y-0.5 text-[10.5px] uppercase">
          <p>Fecha de emisión: {config.fechaLarga}</p>
          <p>Recolectado para: {config.para}</p>
        </div>
        <div className="my-3 border-t-2 border-dotted border-[var(--love-ink)]/70" />

        <div className="relative flex items-center justify-center">
          <GoldLocket
            left={config.inicialPara}
            right={config.inicialDe}
            className="w-[210px] -translate-x-5"
          />
          {/* Etiqueta RAZÓN #n */}
          <div className="absolute right-0 bottom-3 flex items-center">
            <span className="font-rubik -rotate-6 rounded-sm bg-[#ffd36b] px-2 py-0.5 text-sm font-extrabold italic shadow-sm">
              RAZÓN
            </span>
            <span className="relative -ml-1 -mt-8 grid size-12 place-items-center">
              <svg viewBox="0 0 100 90" className="absolute inset-0 size-full rotate-12 fill-[var(--love-ink)]">
                <path d="M50 24 C50 10 38 0 25 0 C10 0 0 12 0 27 C0 52 30 70 50 88 C70 70 100 52 100 27 C100 12 90 0 75 0 C62 0 50 10 50 24 Z" />
              </svg>
              <span className="font-playfair relative -mt-1 rotate-12 text-base font-bold italic text-[#ffd36b]">
                #{n}
              </span>
            </span>
          </div>
        </div>

        <p className="font-receipt mt-3 min-h-[96px] px-1 text-center text-[14.5px] font-bold italic leading-snug text-balance">
          {text}
        </p>

        <p className="font-receipt mt-3 text-center text-[9.5px] italic opacity-90">
          *Gracias por tu compra: recibiste una dosis de amor*
        </p>
        <div className="my-2 border-t-2 border-dotted border-[var(--love-ink)]/70" />
        <div className="font-receipt space-y-0.5 text-[10.5px] uppercase">
          <Row label="Item count:" value={`Razón #${n}`} />
          <Row label="Total:" value="Amor infinito" />
        </div>
        <div className="my-2 border-t-2 border-dotted border-[var(--love-ink)]/70" />
        <p className="font-receipt text-center text-[8.5px] uppercase">
          Este recibo no tiene vencimiento. Válido para siempre.
        </p>
        <p className="font-receipt mt-1 text-[10.5px] uppercase">
          Atentamente: tu persona favorita ♥
        </p>

        <div className="mt-4">
          <Barcode seed={n} />
          <p className="font-receipt mt-1 text-center text-[9px] tracking-[0.3em]">
            {config.inicialPara}♥{config.inicialDe} · {pad(n)}
            {config.fecha.replace(/\./g, "")}
          </p>
        </div>
        <div className="receipt-dots -mx-5 mt-3" />
      </div>
      <div className="receipt-tear" />
    </article>
  );
}
