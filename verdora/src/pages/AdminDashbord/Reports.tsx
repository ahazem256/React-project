import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, TrendingUp, Tag, CalendarDays, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Reports.css";
import "../../styles/global.css"

interface OrderItem {
  name: string;
  category: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  orderDate: string;
}

interface ProductSummary {
  name: string;
  category: string;
  quantitySold: number;
  totalRevenue: number;
  percentage: string;
}

interface CategorySummary {
  category: string;
  totalRevenue: number;
  quantitySold: number;
}

interface MonthlyRevenue {
  month: string;
  total: number;
}

const Reports: React.FC = () => {
  const [summary, setSummary] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRes = await axios.get("http://localhost:5005/orders");
        const ordersData: Order[] = ordersRes.data;

        const productMap: Record<string, ProductSummary> = {};
        const categoryMap: Record<string, CategorySummary> = {};
        const monthMap: Record<string, number> = {};

        ordersData.forEach((order) => {
          order.items.forEach((item) => {
            const priceNum = parseFloat(item.price.replace(" EGP", "")) || 0;
            const revenue = priceNum * item.quantity;

            // Product summary
            if (!productMap[item.name]) {
              productMap[item.name] = {
                name: item.name,
                category: item.category,
                quantitySold: item.quantity,
                totalRevenue: revenue,
                percentage: "0",
              };
            } else {
              productMap[item.name].quantitySold += item.quantity;
              productMap[item.name].totalRevenue += revenue;
            }

            // Category summary
            if (!categoryMap[item.category]) {
              categoryMap[item.category] = {
                category: item.category,
                totalRevenue: revenue,
                quantitySold: item.quantity,
              };
            } else {
              categoryMap[item.category].totalRevenue += revenue;
              categoryMap[item.category].quantitySold += item.quantity;
            }
          });

          // Monthly revenue
          if (order.orderDate) {
            const monthName = new Date(order.orderDate).toLocaleString("en-US", {
              month: "short",
              year: "numeric",
            });
            monthMap[monthName] =
              (monthMap[monthName] || 0) +
              order.items.reduce(
                (sum, i) =>
                  sum + parseFloat(i.price.replace(" EGP", "")) * i.quantity,
                0
              );
          }
        });

        // Final summaries
        const productArray = Object.values(productMap);
        const totalRevenue = productArray.reduce(
          (s, p) => s + p.totalRevenue,
          0
        );

        const finalProducts = productArray.map((p) => ({
          ...p,
          percentage: ((p.totalRevenue / totalRevenue) * 100).toFixed(1),
        }));

        setSummary(finalProducts);
        setCategories(Object.values(categoryMap));
        setMonthlyRevenue(
          Object.entries(monthMap).map(([month, total]) => ({
            month,
            total,
          }))
        );
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchOrders();
  }, []);

  // Export Functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reports Overview", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["Product", "Category", "Qty", "Revenue", "% of Total"]],
      body: summary.map((p) => [
        p.name,
        p.category,
        p.quantitySold,
        p.totalRevenue.toFixed(2),
        p.percentage + "%",
      ]),
    });
    doc.save("Reports.pdf");
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const productSheet = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(workbook, productSheet, "Products Summary");
    const categorySheet = XLSX.utils.json_to_sheet(categories);
    XLSX.utils.book_append_sheet(workbook, categorySheet, "Categories Summary");
    const monthlySheet = XLSX.utils.json_to_sheet(monthlyRevenue);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, "Monthly Revenue");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(new Blob([excelBuffer]), "Reports.xlsx");
  };

  return (
    <div className="checkout-page">
      <div className="reports-header">
        <h1 className="reports-title">
          <FileText size={26} /> Reports Overview
        </h1>
        <div className="export-buttons">
          <button className="export-btn pdf" onClick={exportToPDF}>
            <Download size={16} /> Export to PDF
          </button>
          <button className="export-btn excel" onClick={exportToExcel}>
            <Download size={16} /> Export to Excel
          </button>
        </div>
      </div>

      {/* Product Summary Table */}
      <div className="reports-table-container">
        <h2 className="section-title">
          <TrendingUp size={18} /> Product Sales Summary
        </h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Category</th>
              <th>Qty Sold</th>
              <th>Revenue (EGP)</th>
              <th>% of Total</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantitySold}</td>
                <td>{item.totalRevenue.toFixed(2)}</td>
                <td>{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Categories */}
      <div className="reports-table-container">
        <h2 className="section-title">
          <Tag size={18} /> Top Selling Categories
        </h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Qty Sold</th>
              <th>Revenue (EGP)</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{cat.category}</td>
                <td>{cat.quantitySold}</td>
                <td>{cat.totalRevenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Revenue */}
      <div className="reports-table-container">
        <h2 className="section-title">
          <CalendarDays size={18} /> Monthly Revenue Summary
        </h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Month</th>
              <th>Total Revenue (EGP)</th>
            </tr>
          </thead>
          <tbody>
            {monthlyRevenue.map((m, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{m.month}</td>
                <td>{m.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
