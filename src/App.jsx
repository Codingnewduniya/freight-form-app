import { useState } from "react";
import jsPDF from "jspdf";

export default function FreightForm() {
  const [form, setForm] = useState({
    receiverName: "",
    receiverAddress: "",
    contact: "",
    billNo: "",
    date: "",
    lorryNo: "",
    deliveryAt: "",
    items: [{ description: "", weight: "", rate: "", amount: "" }],
    totalAmount: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;

    const weight = parseFloat(updatedItems[index].weight) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;
    updatedItems[index].amount = (weight * rate).toFixed(2);

    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", weight: "", rate: "", amount: "" }],
    });
  };

  const handleSubmit = () => {
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `freight_bill_${form.billNo || "draft"}.json`;
    link.click();
    alert("Form auto-saved successfully!");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("PM TRANS LOGISTICS - Freight Bill", 20, 20);
    doc.setFontSize(10);
    doc.text("Office No. 40, 1st Floor, PAREKH MARKET, Plot No. 75/78", 20, 28);
    doc.text("Mobile: 9825325765 / 9377431881", 20, 34);
    doc.text("GSTIN: 24ADNPT2137M1Z4", 20, 40);

    let y = 50;
    doc.setFontSize(12);
    doc.text(`To: ${form.receiverName}`, 20, y);
    doc.text(`Contact: ${form.contact}`, 120, y); y += 6;
    doc.text(`Address: ${form.receiverAddress}`, 20, y); y += 6;
    doc.text(`Bill No: ${form.billNo}`, 20, y);
    doc.text(`Date: ${form.date}`, 120, y); y += 6;
    doc.text(`Lorry No: ${form.lorryNo}`, 20, y);
    doc.text(`Delivery At: ${form.deliveryAt}`, 120, y); y += 10;

    doc.text("Items", 20, y); y += 6;
    doc.text("Description", 20, y);
    doc.text("Weight", 80, y);
    doc.text("Rate", 110, y);
    doc.text("Amount", 140, y); y += 6;

    form.items.forEach((item) => {
      doc.text(item.description || "-", 20, y);
      doc.text(item.weight || "-", 80, y);
      doc.text(item.rate || "-", 110, y);
      doc.text(item.amount || "-", 140, y);
      y += 6;
    });

    doc.text(`Total Amount: ₹${form.totalAmount}`, 20, y); y += 6;
    doc.text(`Bank Name: ${form.bankName}`, 20, y);
    doc.text(`Account Number: ${form.accountNumber}`, 20, y + 6);
    doc.text(`IFSC Code: ${form.ifscCode}`, 20, y + 12);

    doc.save(`freight_bill_${form.billNo || "draft"}.pdf`);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1><b>PM TRANS LOGISTICS</b></h1>
      <p><b>Office:</b> No. 40, 1st Floor, PAREKH MARKET, Plot No. 75/78</p>
      <p><b>Mobile:</b> 9825325765 / 9375312765</p>
      <p><b>GSTIN:</b> 24ADNPT2137M1Z4</p>

      <textarea name="receiverAddress" placeholder="Receiver Address" value={form.receiverAddress} onChange={handleChange} style={{ width: "100%", height: "60px" }} /><br />

      <input name="receiverName" placeholder="Receiver Name" value={form.receiverName} onChange={handleChange} style={{ width: "45%", marginRight: "10px" }} />
      <input name="receivergstno" placeholder="Receiver GSTNo." value={form.eceivergstno} onChange={handleChange} style={{ width: "45%", marginRight: "10px" }} />
      <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} style={{ width: "45%" }} /><br />

      <input name="billNo" placeholder="Bill No" value={form.billNo} onChange={handleChange} style={{ width: "30%", marginRight: "10px" }} />
      <input name="date" placeholder="Date" type="date" value={form.date} onChange={handleChange} style={{ width: "30%", marginRight: "10px" }} />
      <input name="lorryNo" placeholder="Lorry No" value={form.lorryNo} onChange={handleChange} style={{ width: "30%" }} /><br />
      <input name="Startinglocation" placeholder="FROM " value={form.Startinglocation} onChange={handleChange} style={{ width: "100%" }} /><br />

      <input name="deliveryAt" placeholder="Delivery At" value={form.deliveryAt} onChange={handleChange} style={{ width: "100%" }} /><br /><br />

      <h3>Items</h3>
      {form.items.map((item, index) => (
        <div key={index}>
          <input placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
          <input placeholder="Weight" value={item.weight} onChange={(e) => handleItemChange(index, "weight", e.target.value)} />
          <input placeholder="Rate" value={item.rate} onChange={(e) => handleItemChange(index, "rate", e.target.value)} />
          <input placeholder="Amount" value={item.amount} readOnly />
        </div>
      ))}
      <button onClick={addItem}>+ Add Item</button>
      <input placeholder="Total Amount" value={form.totalAmount} readOnly style={{ marginLeft: "10px" }} /><br /><br />

      <h3>Bank Info</h3>
      <input name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} />
      <input name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} />
      <input name="ifscCode" placeholder="IFSC Code" value={form.ifscCode} onChange={handleChange} /><br /><br />

      <button onClick={handleSubmit}>Submit</button>
      <button onClick={generatePDF} style={{ marginLeft: "10px" }}>Download PDF</button>
    </div>
  );
}
