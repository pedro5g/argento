import type {
  CategoryTotal,
  DailySummary,
  GlobalSummary,
  MonthlySummary,
} from "@/api/api-types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(amount);

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
    borderBottom: "2 solid #e5e7eb",
    paddingBottom: 20,
  },
  title: {
    fontFamily: "Helvetica",
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 1.2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 10,
    color: "#9ca3af",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "#374151",
    fontWeight: "bold",
    borderBottom: "1 solid #d1d5db",
    paddingBottom: 5,
  },
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  kpiCard: {
    border: "1 solid #e5e7eb",
    borderRadius: 8,
    padding: 15,
    width: "30%",
    backgroundColor: "#f9fafb",
  },
  kpiLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  kpiValuePositive: {
    color: "#10b981",
  },
  kpiValueNegative: {
    color: "#ef4444",
  },
  kpiChange: {
    fontSize: 8,
    color: "#6b7280",
  },
  tableContainer: {
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderBottom: "1 solid #d1d5db",
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "0.5 solid #e5e7eb",
  },
  tableRowAlternate: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 10,
    color: "#4b5563",
    flex: 1,
  },
  tableCellValue: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  summaryBox: {
    backgroundColor: "#f0f9ff",
    border: "1 solid #0ea5e9",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0c4a6e",
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTop: "0.5 solid #e5e7eb",
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 30,
    fontSize: 8,
    color: "#9ca3af",
  },
});

export interface GraphData {
  dailySummary: DailySummary[];
  monthlySummary: MonthlySummary[];
  categoryDistribution: {
    income: CategoryTotal[];
    expense: CategoryTotal[];
  };
  globalSummary: GlobalSummary;
}

interface AnalyticsDocumentProps {
  data: GraphData;
}

export const AnalyticsDocument = ({ data }: AnalyticsDocumentProps) => {
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const balance = parseFloat(data.globalSummary.balance);
  const isPositive = balance >= 0;
  const totalIncome = parseFloat(data.globalSummary.total_income);
  const totalExpense = parseFloat(data.globalSummary.total_expense);

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>Financial Report - Analytics</Text>
          <Text style={pdfStyles.subtitle}>
            Detailed Analysis of Income and Expenses
          </Text>
          <Text style={pdfStyles.dateText}>Generated on {currentDate}</Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}> Executive Summary</Text>

          <View style={pdfStyles.kpiContainer}>
            <View style={pdfStyles.kpiCard}>
              <Text style={pdfStyles.kpiLabel}>Total Income</Text>
              <Text style={[pdfStyles.kpiValue, pdfStyles.kpiValuePositive]}>
                {formatCurrency(totalIncome)}
              </Text>
              <Text style={pdfStyles.kpiChange}>+12.5% vs previous period</Text>
            </View>

            <View style={pdfStyles.kpiCard}>
              <Text style={pdfStyles.kpiLabel}>Total Expense</Text>
              <Text style={[pdfStyles.kpiValue, pdfStyles.kpiValueNegative]}>
                {formatCurrency(totalExpense)}
              </Text>
              <Text style={pdfStyles.kpiChange}>-8.2% vs previous period</Text>
            </View>

            <View style={pdfStyles.kpiCard}>
              <Text style={pdfStyles.kpiLabel}>Balance</Text>
              <Text
                style={[
                  pdfStyles.kpiValue,
                  isPositive
                    ? pdfStyles.kpiValuePositive
                    : pdfStyles.kpiValueNegative,
                ]}>
                {isPositive ? "+" : "-"}
                {formatCurrency(Math.abs(balance))}
              </Text>
              <Text style={pdfStyles.kpiChange}>
                {isPositive ? "Positive situation" : "Attention required"}
              </Text>
            </View>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Daily Summary</Text>

          <View style={pdfStyles.tableContainer}>
            <View style={pdfStyles.tableHeader}>
              <Text style={pdfStyles.tableHeaderText}>Date</Text>
              <Text style={pdfStyles.tableHeaderText}>Income</Text>
              <Text style={pdfStyles.tableHeaderText}>Expense</Text>
              <Text style={pdfStyles.tableHeaderText}>Balance</Text>
            </View>

            {data.dailySummary.map((item, index) => {
              const income = parseFloat(item.total_income);
              const expense = parseFloat(item.total_expense);
              const balance = income - expense;
              const formattedDate = new Date(item.date).toLocaleDateString(
                "pt-BR"
              );

              return (
                <View
                  key={item.date}
                  style={[
                    pdfStyles.tableRow,
                    //@ts-ignore
                    index % 2 === 1 && pdfStyles.tableRowAlternate,
                  ]}>
                  <Text style={pdfStyles.tableCell}>{formattedDate}</Text>
                  <Text
                    style={[pdfStyles.tableCellValue, { color: "#10b981" }]}>
                    {formatCurrency(income)}
                  </Text>
                  <Text
                    style={[pdfStyles.tableCellValue, { color: "#ef4444" }]}>
                    {formatCurrency(expense)}
                  </Text>
                  <Text
                    style={[
                      pdfStyles.tableCellValue,
                      { color: balance >= 0 ? "#10b981" : "#ef4444" },
                    ]}>
                    {balance >= 0 ? "+" : "-"}
                    {formatCurrency(balance)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}> Monthly Summary</Text>

          <View style={pdfStyles.tableContainer}>
            <View style={pdfStyles.tableHeader}>
              <Text style={pdfStyles.tableHeaderText}>Period</Text>
              <Text style={pdfStyles.tableHeaderText}>Income</Text>
              <Text style={pdfStyles.tableHeaderText}>Expenses</Text>
              <Text style={pdfStyles.tableHeaderText}>Balance</Text>
            </View>

            {data.monthlySummary.map((item, index) => {
              const monthBalance =
                parseFloat(item.total_income) - parseFloat(item.total_expense);
              const monthName = new Date(
                item.year,
                item.month - 1
              ).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              });

              return (
                <View
                  key={`${item.year}-${item.month}`}
                  style={[
                    pdfStyles.tableRow,
                    //@ts-ignore
                    index % 2 === 1 && pdfStyles.tableRowAlternate,
                  ]}>
                  <Text style={pdfStyles.tableCell}>{monthName}</Text>
                  <Text
                    style={[pdfStyles.tableCellValue, { color: "#10b981" }]}>
                    {formatCurrency(parseFloat(item.total_income))}
                  </Text>
                  <Text
                    style={[pdfStyles.tableCellValue, { color: "#ef4444" }]}>
                    {formatCurrency(parseFloat(item.total_expense))}
                  </Text>
                  <Text
                    style={[
                      pdfStyles.tableCellValue,
                      {
                        color: monthBalance >= 0 ? "#10b981" : "#ef4444",
                      },
                    ]}>
                    {monthBalance >= 0 ? "+" : ""}
                    {formatCurrency(Math.abs(monthBalance))}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}> Income Distribution</Text>

          <View style={pdfStyles.tableContainer}>
            <View style={pdfStyles.tableHeader}>
              <Text style={pdfStyles.tableHeaderText}>Category</Text>
              <Text style={pdfStyles.tableHeaderText}>Amount</Text>
              <Text style={pdfStyles.tableHeaderText}>Share</Text>
            </View>

            {data.categoryDistribution.income.map((item, index) => {
              const percentage = (parseFloat(item.total) / totalIncome) * 100;

              return (
                <View
                  key={item.category}
                  style={[
                    pdfStyles.tableRow,
                    //@ts-ignore
                    index % 2 === 1 && pdfStyles.tableRowAlternate,
                  ]}>
                  <Text style={pdfStyles.tableCell}>{item.category}</Text>
                  <Text
                    style={[pdfStyles.tableCellValue, { color: "#10b981" }]}>
                    {formatCurrency(parseFloat(item.total))}
                  </Text>
                  <Text style={pdfStyles.tableCellValue}>
                    {percentage.toFixed(1)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={pdfStyles.footer}>
          Report automatically generated by Analytics Dashboard system
        </Text>

        <Text
          style={pdfStyles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>

      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>Expense Analysis</Text>
          <Text style={pdfStyles.subtitle}>Breakdown by Category</Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}> Expense Distribution</Text>

          <View style={pdfStyles.tableContainer}>
            <View style={pdfStyles.tableHeader}>
              <Text style={pdfStyles.tableHeaderText}>Category</Text>
              <Text style={pdfStyles.tableHeaderText}>Amount</Text>
              <Text style={pdfStyles.tableHeaderText}>Share</Text>
            </View>

            {data.categoryDistribution.expense.map((item, index) => {
              const percentage = (parseFloat(item.total) / totalExpense) * 100;

              return (
                <View
                  key={item.category}
                  style={[
                    pdfStyles.tableRow,
                    //@ts-ignore
                    index % 2 === 1 && pdfStyles.tableRowAlternate,
                  ]}>
                  <Text style={pdfStyles.tableCell}>{item.category}</Text>
                  <Text
                    style={[pdfStyles.tableCellValue, { color: "#ef4444" }]}>
                    {formatCurrency(parseFloat(item.total))}
                  </Text>
                  <Text style={pdfStyles.tableCellValue}>
                    {percentage.toFixed(1)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={pdfStyles.summaryBox}>
          <Text style={pdfStyles.summaryTitle}>
            Insights and Recommendations
          </Text>
          <Text style={pdfStyles.summaryText}>
            • Current balance: {isPositive ? "POSITIVE" : "NEGATIVE"} -{" "}
            {formatCurrency(Math.abs(balance))}
          </Text>
          <Text style={pdfStyles.summaryText}>
            • Savings rate:{" "}
            {(((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)}%
            of total income
          </Text>
          <Text style={pdfStyles.summaryText}>
            • Top income category:{" "}
            {data.categoryDistribution.income[0]?.category || "N/A"}
          </Text>
          <Text style={pdfStyles.summaryText}>
            • Top expense category:{" "}
            {data.categoryDistribution.expense[0]?.category || "N/A"}
          </Text>
          <Text style={pdfStyles.summaryText}>
            • Recommendation:{" "}
            {isPositive
              ? "Continue maintaining current financial control."
              : "Review your expenses and seek optimizations."}
          </Text>
        </View>

        <Text style={pdfStyles.footer}>
          Report automatically generated by Analytics Dashboard system
        </Text>

        <Text
          style={pdfStyles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export const generatePDF = async (data: GraphData): Promise<void> => {
  try {
    const blob = await pdf(<AnalyticsDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
