export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-nortune text-4xl mb-8">Custom Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-footer p-6 rounded-lg">
            <h2 className="font-avgardn text-2xl mb-4">Avgardn Font</h2>
            <p className="font-sans">This card uses the Avgardn custom font for the heading.</p>
          </div>

          <div className="bg-footer p-6 rounded-lg">
            <h2 className="font-avgardd text-2xl mb-4">Avgardd Font</h2>
            <p className="font-sans">This card uses the Avgardd custom font for the heading.</p>
          </div>

          <div className="bg-footer p-6 rounded-lg">
            <h2 className="font-avgarddo text-2xl mb-4">Avgarddo Font</h2>
            <p className="font-sans">This card uses the Avgarddo custom font for the heading.</p>
          </div>

          <div className="bg-footer p-6 rounded-lg">
            <h2 className="font-kinetikaLight text-2xl mb-4">Kinetika Light</h2>
            <p className="font-sans">This card uses the KinetikaLight custom font for the heading.</p>
          </div>

          <div className="bg-footer p-6 rounded-lg">
            <h2 className="font-kinetikaUltra text-2xl mb-4">Kinetika Ultra</h2>
            <p className="font-sans">This card uses the KinetikaUltra custom font for the heading.</p>
          </div>

          <div className="bg-footer p-6 rounded-lg">
            <h2 className="font-nortune text-2xl mb-4">Nortune Black</h2>
            <p className="font-sans">This card uses the NortuneBlack custom font for the heading.</p>
          </div>
        </div>

        <div className="mt-12 bg-offwhite text-black p-8 rounded-lg">
          <h3 className="font-kinetikaUltra text-3xl mb-4">Scrolling Animation Demo</h3>
          <div className="overflow-hidden">
            <div className="animate-scroll whitespace-nowrap">
              <span className="font-avgardn text-xl mr-8">Custom Dashboard</span>
              <span className="font-avgardd text-xl mr-8">With Custom Fonts</span>
              <span className="font-avgarddo text-xl mr-8">And Animations</span>
              <span className="font-kinetikaLight text-xl mr-8">Scrolling Text</span>
              <span className="font-kinetikaUltra text-xl mr-8">Demo Content</span>
              <span className="font-nortune text-xl mr-8">Custom Dashboard</span>
              <span className="font-avgardn text-xl mr-8">With Custom Fonts</span>
              <span className="font-avgardd text-xl mr-8">And Animations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
