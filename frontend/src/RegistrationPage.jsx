export default function RegistrationPage() {

    //Array of KPI items to display in the cards
    //Array Constants//
            const kpiItems = [
  { label: "Total Registrations", value: "25", subtext: "All registered cars" },
  { label: "Total Payments", value: "₱42,000.00", subtext: "Collected so far" },
  { label: "Uncollected Payments", value: "₱19,500.00", subtext: "Remaining balance" },
  { label: "Confirmed", value: "10", subtext: "Approved entries" },
  { label: "Checked In", value: "6", subtext: "At Sorsogon Coliseum" },
];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded border flex items-center justify-center font-bold">
            {/* AV placeholder */}
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Car Show 2027</h1>
            <p className="text-xs text-gray-500">AutoVista Events • Registration Desk Sorsogon</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Event Staff</span>
          <div className="h-8 w-8 rounded-full border bg-gray-100" />
        </div>
      </header>

//---------Cards---------//
            
      <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {kpiItems.map((item) => (
            <div key={item.label} className="rounded-lg border bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">{item.label}</span>
                <div className="h-6 w-6 rounded border bg-gray-50" />
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{item.value}</div>
              <div className="mt-2 border-t pt-2 text-xs text-gray-400">{item.subtext}</div>
            </div>
          ))}
        </section>
      </main>


    </div>
  );
}