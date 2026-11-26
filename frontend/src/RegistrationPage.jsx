import { useEffect, useState } from "react";useState
import { getRegistrations, getSummary } from "./Api/registration";
import "./index.css";

export default function RegistrationPage() {
  // Standby state (ready to populate when connected to API / database)
const [summary, setSummary] = useState({
  totalRegistrations: 0,
  confirmed: 0,
  checkedIn: 0,
  pending: 0,
  cancelled: 0,
  totalFees: 0,
  totalPayments: 0,
  uncollectedPayments: 0,
});

  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

   {/*Load Summary Data*/}
  useEffect(() => {
  let active = true;

  getSummary()
    .then((data) => {
      if (active) setSummary(data);
    })
    .catch((requestError) => {
      if (active) setError(requestError.message);
    });

  return () => {
    active = false;
  };
}, []);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  {/*Add api Error Key*/}
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    setDebouncedSearch(search);
  }, 400);

  return () => window.clearTimeout(timeoutId);
}, [search]);

useEffect(() => {
  let active = true;

  setIsLoading(true);
  setError(null);

  {/*Load Registrations*/}
  getRegistrations({
    participantName: debouncedSearch,
    type: typeFilter,
    status: statusFilter,
    page,
    pageSize,
  })
    .then((data) => {
      if (!active) return;

      setRegistrations(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);

      if (data.page !== page) setPage(data.page);
    })
    .catch((requestError) => {
      if (active) {
        setRegistrations([]);
        setError(requestError.message);
      }
    })
    .finally(() => {
      if (active) setIsLoading(false);
    });

  return () => {
    active = false;
  };
}, [debouncedSearch, typeFilter, statusFilter, page, pageSize]);

  const formatPeso = (amount) =>
    `₱${Number(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const kpiItems = [
    { label: "Total Registrations", value: summary.totalRegistrations, dotClass: "bg-orange-500"},
    { label: "Total Payments", value: formatPeso(summary.totalPayments), dotClass: "bg-emerald-500" },
    { label: "Uncollected Payments", value: formatPeso(summary.uncollectedPayments), dotClass: "bg-amber-400" },
    { label: "Confirmed", value: summary.confirmed, dotClass: "bg-blue-500" },
    { label: "Checked In", value: summary.checkedIn, dotClass: "bg-violet-500" },
  ];

  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);
  const pageNumbers = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-l from-[#FBE0C6] via-yellow-400/10 to-[#EBCFBC] text-slate-900">
      <header className="flex items-center justify-between bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 px-6 py-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 bg-white/15 font-bold">
            {/* AV placeholder */}
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-white">Car Show 2027</h1>
            <p className="text-xs text-amber-100">AutoVista Events • Registration Desk Sorsogon</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">Event Staff</span>
          <div className="h-8 w-8 rounded-full border border-white/40 bg-white/20" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {kpiItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 p-[1px] shadow-[0_6px_14px_-4px_rgba(249,115,22,0.22)]"
            >
              <div className="flex h-full flex-col justify-between rounded-[11px] bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.dotClass}`}
                  />
                </div>

                <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-orange-500 to-[#FAA666] shadow-sm">
          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
            <h2 className="text-lg font-bold text-slate-900">Registrations</h2>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search participant name..."
                className="w-64 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />

              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
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
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
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
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-700"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm ">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 ">
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

              <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                      Loading registrations...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-red-600">
                      <div>{error}</div>
                        <button
                        type="button"
                        onClick={() => setReloadKey((current) => current + 1)}
                        className="mt-2 rounded-lg border border-red-300 bg-white px-3 py-1.5"
                        >
                        Try again
                      </button>
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                      No registrations match your filters. :3
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setTypeFilter("");
                          setStatusFilter("");
                          setPage(1);
                        }}
                        className="ml-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  registrations.map((row) => (
                    <tr key={row.id} className="hover:bg-amber-50/40">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        {row.registrationNumber}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {new Intl.DateTimeFormat("en-PH", {
                         dateStyle: "medium",
                           timeStyle: "short",
                            }).format(new Date(row.registrationDate))}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{row.participantName}</div>
                        <div className="text-xs text-slate-500">
                          {row.contactNumber || row.email || row.contactInfo}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{row.carMakeModel}</div>
                        <div className="text-xs text-slate-500">{row.plateNumber}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {row.registrationType}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-900">
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

          {/* Paging container */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
            <div>
              Showing <span className="font-semibold text-slate-900">{startItem}</span>–
              <span className="font-semibold text-slate-900">{endItem}</span> of{" "}
              <span className="font-semibold text-slate-900">{totalCount}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                disabled={isLoading || page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className={`rounded-lg border px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
                      isCurrent
                        ? "border-orange-600 bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-sm"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                &gt;
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="pageSizeSelect" className="text-xs text-slate-500">
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
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
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