export default function HeroBackground({ image = '' }) {
  return (
    <div className="absolute inset-0 -z-10">
      {image && (
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url('${image}')` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7FAF8] via-[#F7FAF8]/20 to-[#F7FAF8]" />
    </div>
  );
}
