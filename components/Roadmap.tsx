export default function Roadmap() {
  const roadmap = [
    {
      phase: "Q1 2026",
      title: "Project Launch",
      desc: "Website, Whitepaper & Community Launch",
      color: "from-cyan-500 to-blue-500",
    },
    {
      phase: "Q2 2026",
      title: "STRIVERSE Presale",
      desc: "Public Token Sale Begins",
      color: "from-purple-500 to-pink-500",
    },
    {
      phase: "Q3 2026",
      title: "Exchange Listing",
      desc: "DEX & CEX Listings",
      color: "from-green-500 to-emerald-500",
    },
    {
      phase: "Q4 2026",
      title: "Staking Platform",
      desc: "Launch Rewards & Passive Income",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section className="py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-center text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Roadmap
          </span>
        </h2>

        <p className="text-center text-gray-400 mb-16">
          STRIVERSE Development Journey
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {roadmap.map((item) => (

            <div
              key={item.phase}
              className="glass rounded-3xl p-8 hover:-translate-y-2 transition duration-300"
            >

              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center font-bold text-xl`}
              >
                ✓
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {item.phase}
              </h3>

              <h4 className="mt-2 text-cyan-400 font-semibold">
                {item.title}
              </h4>

              <p className="mt-3 text-gray-400 text-sm">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}