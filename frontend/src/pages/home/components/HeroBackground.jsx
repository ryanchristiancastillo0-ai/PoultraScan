export default function HeroBackground({ image = HERO_BG_IMAGE }) {
  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center blur-sm "
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#e4e3df] via-[#e4e3df]/20 to-[#e4e3df]" />
    </div>
  );
}