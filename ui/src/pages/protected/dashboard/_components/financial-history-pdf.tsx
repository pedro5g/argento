import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Download,
  FileText,
  Calendar,
  User,
  Building,
  Clock,
  FileJson,
} from "lucide-react";
import { FinancialReportPDF } from "./financial-report-pdf";
import { useHistoryForPDF } from "@/api/hooks/use-history-for-pdf";
import { Button } from "@/components/ui/button";
import { useExportPDF } from "@/api/hooks/use-export-pdf";

interface FinancialHistoryPDFProps {
  children: React.ReactNode;
}

export const FinancialHistoryPDF = ({ children }: FinancialHistoryPDFProps) => {
  const { data, isPending } = useHistoryForPDF();
  const { mutate: exportAsJSON, isPending: isExporting } = useExportPDF();

  if (!data || !data.data || isPending) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Data Available
              </h3>
              <p className="text-gray-500">
                No financial history data found for the selected period.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const {
    user_info,
    period,
    totals,
    data: historyData,
    generated_at,
  } = data.data;

  return (
    <Dialog modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-full my-5 overflow-hidden overflow-y-scroll">
        <div className="max-w-4xl mx-auto bg-white">
          <div className="no-print mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Financial History Report
            </h2>
            <div className="inline-flex items-center gap-4">
              <PDFDownloadLink
                document={<FinancialReportPDF data={data.data} />}
                fileName="financial-history.pdf"
                className="justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 has-[>svg]:px-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </PDFDownloadLink>
              <div>
                <Button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={() => {
                    exportAsJSON();
                  }}>
                  <FileJson className="size-4" />
                  {isExporting ? "Exporting" : "Export as JSON"}
                </Button>
              </div>
            </div>
          </div>

          <div className="print:p-0 p-8 print:shadow-none shadow-lg rounded-lg">
            <div className="border-b-2 border-gray-200 pb-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Financial History Report
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {user_info?.name || "Unknown User"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {period?.start && period?.end
                        ? `${formatDate(period.start)} - ${formatDate(
                            period.end
                          )}`
                        : "All Time"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Generated: {new Date(generated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    Total Net Balance
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      totals.net_balance >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                    {formatCurrency(totals.net_balance)}
                  </div>
                </div>
              </div>
            </div>

            {historyData.map((yearData) => (
              <div key={yearData.year} className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {yearData.year}
                  </h2>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Year Total</div>
                    <div
                      className={`text-lg font-bold ${
                        yearData.year_totals.balance >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                      {formatCurrency(yearData.year_totals.balance)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Income</div>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(yearData.year_totals.income)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Expenses</div>
                    <div className="font-semibold text-red-600">
                      {formatCurrency(yearData.year_totals.expense)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Balance</div>
                    <div
                      className={`font-semibold ${
                        yearData.year_totals.balance >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                      {formatCurrency(yearData.year_totals.balance)}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.values(yearData.months).map((monthData) => (
                    <div
                      key={`${yearData.year}-${monthData.month}`}
                      className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {monthData.month_name}
                          </h3>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              Month Total
                            </div>
                            <div
                              className={`font-semibold ${
                                monthData.month_totals.balance >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}>
                              {formatCurrency(monthData.month_totals.balance)}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-gray-600">Income: </span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(monthData.month_totals.income)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Expenses: </span>
                            <span className="font-medium text-red-600">
                              {formatCurrency(monthData.month_totals.expense)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Days: </span>
                            <span className="font-medium">
                              {monthData.days.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 text-gray-600 font-medium">
                                  Date
                                </th>
                                <th className="text-right py-2 text-gray-600 font-medium">
                                  Income
                                </th>
                                <th className="text-right py-2 text-gray-600 font-medium">
                                  Expenses
                                </th>
                                <th className="text-right py-2 text-gray-600 font-medium">
                                  Balance
                                </th>
                                <th className="text-left py-2 text-gray-600 font-medium">
                                  Account
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthData.days.map((dayData) => (
                                <tr
                                  key={dayData.id}
                                  className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3">
                                    {formatDate(dayData.day)}
                                  </td>
                                  <td className="py-3 text-right text-green-600 font-medium">
                                    {dayData.total_income > 0
                                      ? formatCurrency(dayData.total_income)
                                      : "-"}
                                  </td>
                                  <td className="py-3 text-right text-red-600 font-medium">
                                    {dayData.total_expense > 0
                                      ? formatCurrency(dayData.total_expense)
                                      : "-"}
                                  </td>
                                  <td
                                    className={`py-3 text-right font-medium ${
                                      dayData.net_balance >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}>
                                    {formatCurrency(dayData.net_balance)}
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-2">
                                      <Building className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-700">
                                        {dayData.account_name}
                                      </span>
                                      <span className="text-xs text-gray-400 capitalize">
                                        ({dayData.account_type})
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t-2 border-gray-200 pt-6 mt-12">
              <div className="text-center text-sm text-gray-500">
                <p>
                  This report was automatically generated on{" "}
                  {new Date(generated_at).toLocaleString()}
                </p>
                <p className="mt-1">
                  Financial History Report • {user_info?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
