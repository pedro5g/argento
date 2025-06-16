import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import type { FinancialSummaryResponseType } from "@/api/api-types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "#f0f0f0",
    padding: 4,
    fontWeight: "bold",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 4,
  },
});

export const FinancialReportPDF = ({
  data,
}: {
  data: FinancialSummaryResponseType["data"];
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Financial History Report</Text>

      <View style={styles.section}>
        <Text>User: {data.user_info?.name || "Unknown"}</Text>
        <Text>Email: {data.user_info?.email}</Text>
        <Text>
          Period: {formatDate(data.period?.start)} -{" "}
          {formatDate(data.period?.end)}
        </Text>
        <Text>Generated: {new Date(data.generated_at).toLocaleString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Totals</Text>
        <View style={styles.row}>
          <Text>Total Income: {formatCurrency(data.totals.total_income)}</Text>
          <Text>
            Total Expenses: {formatCurrency(data.totals.total_expense)}
          </Text>
          <Text>Net Balance: {formatCurrency(data.totals.net_balance)}</Text>
        </View>
      </View>

      {data.data.map((yearData) => (
        <View key={yearData.year} style={styles.section}>
          <Text style={styles.subHeader}>Year: {yearData.year}</Text>
          <View style={styles.row}>
            <Text>Income: {formatCurrency(yearData.year_totals.income)}</Text>
            <Text>Expense: {formatCurrency(yearData.year_totals.expense)}</Text>
            <Text>Balance: {formatCurrency(yearData.year_totals.balance)}</Text>
          </View>

          {Object.values(yearData.months).map((month) => (
            <View key={month.month} style={styles.section}>
              <Text>Month: {month.month_name}</Text>
              <Text>
                Income: {formatCurrency(month.month_totals.income)} | Expense:{" "}
                {formatCurrency(month.month_totals.expense)} | Balance:{" "}
                {formatCurrency(month.month_totals.balance)}
              </Text>

              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableColHeader}>Date</Text>
                  <Text style={styles.tableColHeader}>Income</Text>
                  <Text style={styles.tableColHeader}>Expenses</Text>
                  <Text style={styles.tableColHeader}>Balance</Text>
                  <Text style={styles.tableColHeader}>Account</Text>
                </View>

                {month.days.map((day) => (
                  <View key={day.id} style={styles.tableRow}>
                    <Text style={styles.tableCol}>{formatDate(day.day)}</Text>
                    <Text style={styles.tableCol}>
                      {day.total_income > 0
                        ? formatCurrency(day.total_income)
                        : "-"}
                    </Text>
                    <Text style={styles.tableCol}>
                      {day.total_expense > 0
                        ? formatCurrency(day.total_expense)
                        : "-"}
                    </Text>
                    <Text
                      style={{
                        ...styles.tableCol,
                        color: day.net_balance >= 0 ? "green" : "red",
                      }}>
                      {formatCurrency(day.net_balance)}
                    </Text>
                    <Text style={styles.tableCol}>{day.account_name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}

      <Text
        style={{
          marginTop: 20,
          fontSize: 9,
          textAlign: "center",
          color: "#666",
        }}>
        This report was generated on{" "}
        {new Date(data.generated_at).toLocaleString()} - {data.user_info?.email}
      </Text>
    </Page>
  </Document>
);
