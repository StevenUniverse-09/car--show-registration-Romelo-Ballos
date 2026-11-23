import { useState } from "react";
import "./index.css";

export default function RegistrationPage() {
  // Standby state (ready to populate when connected to API / database)
  const [summary, setSummary] = useState({
    totalRegistrations: 0,
    totalPayments: 0,
    uncollectedPayments: 0,
    confirmed: 0,
    checkedIn: 0,
  });

  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatPeso = (amount) =>
    `₱${Number(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const kpiItems = [
    { label: "Total Registrations", value: summary.totalRegistrations },
    { label: "Total Payments", value: formatPeso(summary.totalPayments) },
    { label: "Uncollected Payments", value: formatPeso(summary.uncollectedPayments) },
    { label: "Confirmed", value: summary.confirmed },
    { label: "Checked In", value: summary.checkedIn },
  ];

  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);
  const pageNumbers = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);



 return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded border font-bold">
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

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {kpiItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col justify-between rounded border border-gray-300 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center border border-gray-400 text-xs text-gray-500"
                />
              </div>

              <div className="my-3 text-2xl font-bold tracking-tight text-gray-900">
                {item.value}
              </div>

              <div className="h-1.5 w-24 rounded bg-gray-200" />
            </div>
          ))}
        </section>

        <section className="rounded border border-gray-300 bg-white">
          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Registrations</h2>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search participant name..."
                className="w-64 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 placeholder:text-gray-400"
              />

              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700"
              >
                <option value="">All Types</option>
                <option value="Exhibitor">Exhibitor</option>
                <option value="Competitor">Competitor</option>
                <option value="VIP">VIP</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="CheckedIn">CheckedIn</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("");
                  setStatusFilter("");
                  setPage(1);
                }}
                className="rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3">Registration No.</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Car</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Fee / Paid</th>
                  <th className="px-4 py-3">Payment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white text-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      Loading registrations...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      No registrations to display yet.
                    </td>
                  </tr>
                ) : (
                  registrations.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                        {row.registrationNumber}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {row.registrationDate}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{row.participantName}</div>
                        <div className="text-xs text-gray-500">
                          {row.contactNumber || row.email || row.contactInfo}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{row.carMakeModel}</div>
                        <div className="text-xs text-gray-500">{row.plateNumber}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                        {row.registrationType}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900">
                        {`${formatPeso(row.registrationFee)} / ${formatPeso(row.amountPaid)}`}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            row.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-800"
                              : row.paymentStatus === "Partial"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {row.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          

{/*Paging container*/}
{/* Paging container */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
            <div>
              Showing <span className="font-semibold text-gray-900">{startItem}</span>–
              <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalCount}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                disabled={isLoading || page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-gray-300 bg-white px-2.5 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                &lt;
              </button>

              {pageNumbers.map((pageNum) => {
                const isCurrent = pageNum === page;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setPage(pageNum)}
                    className={`rounded border px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
                      isCurrent
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={isLoading || page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-gray-300 bg-white px-2.5 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                &gt;
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="pageSizeSelect" className="text-xs text-gray-500">
                Per page
              </label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                disabled={isLoading}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded border border-gray-300 bg-white px-2.5 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </section>
      </main>

      {/* this is the end of the page, add a footer if needed */}
    </div>
  );
}


