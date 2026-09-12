export default function HeroBackground({ image = HERO_BG_IMAGE }) {
  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center blur-sm "
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAF7] via-[#F8FAF7]/20 to-[#F8FAF7]" />
    </div>
  );
}