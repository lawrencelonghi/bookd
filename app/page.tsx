import Image from "next/image";
import { Button } from "@heroui/button";

import { title } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center py-8 md:py-10">
      <h1 className={title({ size: "sm" })}>Track books you&apos;ve readed.</h1>
      <div className="flex gap-8 object-cover object-center mt-10 mb-9">
        <Image
          alt="Farenheit 451 book cover"
          className="hidden md:block"
          height={150}
          src="/images/farenheitCover.jpg"
          width={200}
        />
        <Image
          alt="Maya Angelou book cover"
          className="hidden md:block"
          height={200}
          src="/images/MayaCover.jpg"
          width={200}
        />
        <Image
          alt="Psycho book cover"
          height={200}
          src="/images/PsychoCover.jpg"
          width={200}
        />
        <Image
          alt=" A Clockwork Orange book cover"
          height={200}
          src="/images/kubrikCover.jpg"
          width={200}
        />
      </div>
      <div className="inline-block max-w-lg text-center justify-center">
        <div className="flex flex-col gap-3 mb-10">
          <h1 className={title({ size: "sm" })}>
            Save those you want to read.
          </h1>
          <h1 className={title({ size: "sm" })}>
            Tell your friends what&apos;s good.
          </h1>
        </div>

        <Button className="text-white font-bold text-base" color="success">
          Get started - it&apos;s free!
        </Button>
      </div>
    </section>
  );
}
