import Image from "next/image";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { CandyHeart, PhotoLocket } from "@/components/love/hearts";
import { ReceiptCarousel } from "@/components/love/receipt-carousel";
import { StarField } from "@/components/love/star-field";
import { config, razones } from "@/data/config";

export default function Home() {
  return (
    <main className="love-bg grain relative isolate flex-1 overflow-hidden text-white">
      {/* Foto de fondo desvanecida */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[720px]">
        <Image
          src={config.fotos.fondo}
          alt=""
          fill
          priority
          className="object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--love-red)]/40 via-[var(--love-red)]/70 to-[var(--love-red)]" />
      </div>

      {/* Cielo de estrellas animado */}
      <StarField className="-z-10" />

      <header className="relative mx-auto mt-2 flex max-w-[560px] flex-col items-center px-4">
        <div className="relative w-full">
          <span className="font-playfair absolute top-2 left-0 z-10 -rotate-6 love-badge px-3 py-0.5 text-sm sm:top-10 sm:left-6 sm:px-4 sm:text-lg">
            {config.fecha}
          </span>
          <PhotoLocket
            left={config.fotos.relicarioIzquierda}
            right={config.fotos.relicarioDerecha}
            className="mx-auto w-[210px] sm:w-[270px]"
          />
          <span className="font-playfair absolute right-0 bottom-0 z-10 rotate-6 love-badge px-3 py-0.5 text-sm sm:right-8 sm:bottom-2 sm:px-3.5 sm:text-lg">
            {config.inicialPara} ♥ {config.inicialDe}
          </span>
        </div>

        <h1 className="relative -mt-2 flex flex-col items-center leading-none">
          <span className="flex items-end gap-2">
            <span className="font-playfair text-[84px] font-semibold italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] sm:text-[120px]">
              10
            </span>
            <span className="mb-4 flex flex-col">
              <span className="font-playfair text-[42px] text-[var(--love-gold)] italic sm:text-6xl">
                Razones
              </span>
              <span className="font-playfair self-end text-lg text-[var(--love-gold)] italic sm:text-2xl">
                por las que
              </span>
            </span>
          </span>
          <span className="sr-only">Te Amo</span>
          <span aria-hidden className="-mt-10 -mb-8">
            <ShimmerText
              text="Te Amo"
              className="font-script bg-gradient-to-r from-[#f2b53a] via-[#fff1c4] to-[#f2b53a] py-4 pr-4 pl-2 text-[80px] leading-none font-normal whitespace-nowrap dark:from-[#f2b53a] dark:via-[#fff1c4] dark:to-[#f2b53a] sm:text-[120px]"
            />
          </span>
          <span className="absolute top-24 left-0 text-2xl sm:-left-6 text-[var(--love-gold)]">✦</span>
          <span className="absolute right-0 bottom-10 text-3xl text-[var(--love-gold)]">✺</span>
        </h1>
      </header>

      {/* Recibos */}
      <div className="relative mt-4">
        <CandyHeart
          letter={config.inicialDe}
          rotate={14}
          className="absolute top-40 right-[max(0rem,calc(50%-290px))] z-30 w-12 sm:w-24"
        />
        <CandyHeart
          letter={config.inicialPara}
          rotate={-12}
          delay={1.2}
          className="absolute top-[430px] left-[max(0rem,calc(50%-300px))] z-30 w-12 sm:w-24"
        />
        <ReceiptCarousel reasons={razones} />
      </div>

      <footer className="mx-auto mt-10 max-w-md px-6 pb-14 text-center">
        <p className="font-playfair text-lg italic text-white/90">
          …y un millón de razones más que no caben en ningún recibo.
        </p>
        <p className="font-script mt-2 text-4xl text-[var(--love-gold)]">
          Feliz mesiversario, my Grumpy Baby
        </p>
        <p className="font-receipt mt-3 text-[11px] tracking-[0.25em] uppercase text-white/60">
          Con todo mi amor - Fabian JAJAJA
        </p>
      </footer>
    </main>
  );
}
