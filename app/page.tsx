import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
import Image from "next/image";

import { title, subtitle } from "@/components/primitives";
import { Button } from "@heroui/button";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center py-8 md:py-10">
       <h1 className={title({size: 'sm'}) }>Track books you’ve readed.</h1>
      <div className="flex gap-8 object-cover object-center mt-10 mb-12">
        <Image src="/images/farenheitCover.jpg"
               alt="Farenheit 451 book cover"
               height={150}
               width={200}
               className="hidden md:block" />
        <Image src="/images/MayaCover.jpg"
          alt="Maya Angelou book cover"
          height={200}
          width={200}
          className="hidden md:block" />
        <Image src="/images/PsychoCover.jpg"
          alt="Psycho book cover"
          height={200}
          width={200}
          />
        <Image src="/images/kubrikCover.jpg"
          alt=" A Clockwork Orange book cover"
          height={200}
          width={200} />
      </div>
      <div className="inline-block max-w-lg text-center justify-center">
        <div className="flex flex-col gap-3 mb-10">
         
          <h1 className={title({size: 'sm'}) }>Save those you want to read.</h1>
          <h1 className={title({size: 'sm'}) }>Tell your friends what’s good.</h1>
        </div>
        
        <Button className="text-white font-bold text-base" color="success">Get started - it's free!</Button>
      </div>
    </section>
  );
}
