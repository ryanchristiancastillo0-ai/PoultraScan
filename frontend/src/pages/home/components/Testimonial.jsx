import { useState, useEffect, useRef } from 'react';
import {Reveal} from './index'
export default function Testimonial() {
  const testimonials = [
    {
      quote: "We used to lose two days to a coccidiosis outbreak before anyone noticed. Now the flagged list is waiting for me before I've finished my coffee.",
      name: "Reyna Villanueva",
      role: "Farm Manager, broiler operation · 40,000 birds",
    },
    {
      quote: "Mortality spikes used to hide in the weekly report. Now I get a ping the same afternoon it starts, not five days later.",
      name: "Danilo Cruz",
      role: "Farm Supervisor, layer operation · 25,000 birds",
    },
    {
      quote: "Our vet used to visit once a week. Now he only comes when the system actually flags something, which cut his trips in half.",
      name: "Marites Bautista",
      role: "Operations Head, integrator farm · 100,000 birds",
    },
    {
      quote: "I run three houses alone. Before, I'd miss the early signs in at least one of them every week. Not anymore.",
      name: "Ernesto Palad",
      role: "Poultry Grower, contract farm · 15,000 birds",
    },
    {
      quote: "The first outbreak it caught paid for the whole system twice over. Everything after that has just been savings.",
      name: "Corazon Dizon",
      role: "Farm Owner, broiler operation · 60,000 birds",
    },
    {
      quote: "New hires used to take months to spot early sickness. Now the system spots it for them on day one.",
      name: "Ramil Santos",
      role: "Production Manager, integrator farm · 80,000 birds",
    },
    {
      quote: "We stopped guessing which house to check first. The dashboard already tells us where the problem is.",
      name: "Luzviminda Reyes",
      role: "Farm Manager, layer operation · 30,000 birds",
    },
    {
      quote: "Feed conversion improved the quarter after we started catching sick birds earlier. That alone justified it.",
      name: "Andres Fabella",
      role: "Farm Consultant, multi-farm operation",
    },
    {
      quote: "I used to walk every house twice a day just to be sure. Now I walk it once and trust the alerts in between.",
      name: "Bienvenido Torres",
      role: "Poultry Grower, contract farm · 20,000 birds",
    },
    {
      quote: "Our insurance provider actually asked how we cut losses so fast. This was the answer.",
      name: "Josefina Manalo",
      role: "Farm Owner, broiler operation · 50,000 birds",
    },
    {
      quote: "It's the difference between finding out a batch is sick and finding out a batch died.",
      name: "Teodoro Aquino",
      role: "Farm Manager, broiler operation · 35,000 birds",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const current = testimonials[index];

  return (
    <section id="results" className="scroll-mt-20 max-w-[1200px] mx-auto px-4 md:px-8 py-20 md:py-28">
      <Reveal className="bg-[#2C3E50] rounded-2xl px-6 py-14 md:px-16 md:py-16 text-center">
        <p className="text-xl md:text-2xl font-medium text-white leading-relaxed max-w-2xl mx-auto text-balance">
          "{current.quote}"
        </p>
        <div className="mt-6">
          <p className="text-sm font-semibold text-white">{current.name}</p>
          <p className="text-xs text-white/50 mt-0.5">{current.role}</p>
        </div>
      </Reveal>
    </section>
  );
}