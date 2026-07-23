export default function Home() {
  const products = [
    {
      name: "لعبة سيارات",
      price: "50 ريال",
      image: "🚗",
    },
    {
      name: "دمية أطفال",
      price: "70 ريال",
      image: "🧸",
    },
    {
      name: "مكعبات بناء",
      price: "40 ريال",
      image: "🧱",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        متجر عمران للألعاب
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-5 text-center"
          >

            <div className="text-7xl mb-5">
              {product.image}
            </div>

            <h2 className="text-xl font-bold">
              {product.name}
            </h2>

            <p className="text-gray-600 mt-2">
              {product.price}
            </p>

            <button
              className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              اطلب الآن
            </button>

          </div>
        ))}

      </div>

    </main>
  );
}
