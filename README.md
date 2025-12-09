# 📦 Inventory Manager

A modern, minimalist, and efficient inventory management system built with **React** and **Tailwind CSS**. Designed for e-commerce sellers to track stock, revenue, and sales across multiple platforms (Amazon, Flipkart, Meesho) in one central dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg)

## ✨ Features

* **📊 Real-Time Dashboard:** View Total Revenue, Total Stock count, Low Stock alerts, and Out of Stock warnings at a glance.
* **🛒 Multi-Platform Tracking:** Track sales performance separately for **Amazon**, **Flipkart**, **Meesho**, and **Offline** sales.
* **🌓 Dark/Light Mode:** Fully responsive theme toggle for comfortable viewing in any lighting condition.
* **💾 Auto-Save & Auto-Load:** Data is automatically saved to your browser's Local Storage. No database setup required.
* **📂 Backup & Restore:** Easily **Export** your data to a JSON file and **Import** it on any other device.
* **⚡ Product Management:**
  * Add, Edit, and Delete products.
  * Set custom **Low Stock Thresholds**.
  * Visual indicators for critical stock levels.
  * Quick "Restock" actions.
* **📱 Responsive Design:** Modern grid layout that adapts to different screen sizes.

## 🛠️ Tech Stack

* **Frontend Library:** [React.js](https://reactjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** React Hooks (`useState`, `useEffect`) & Local Storage

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone [https://github.com/yourusername/inventory-manager.git](https://github.com/yourusername/inventory-manager.git)
   cd inventory-manager

2. **Install dependencies:**
    ```bash
    npm install

3. **Start the development server:**
    ```bash
    npm start

4. Open http://localhost:3000 to view it in your browser.

***Project Structure***
src/
├── components/
│   ├── Header.js          # Navigation, Theme Toggle, Import/Export
│   ├── StatsDashboard.js  # Revenue & Stock Statistics Cards
│   ├── ProductCard.js     # Individual Product Display & Edit Logic
│   ├── AddProductForm.js  # Modal for creating new items
│   └── RecordSaleForm.js  # Form to log sales & update stock
├── hooks/
│   └── useInventory.js    # Custom hook handling Logic, CRUD & Storage
├── App.js                 # Main Application Layout & Routing
└── index.js               # Entry point

### 📖 How to Use
**Adding Products:** Click the "New Product" button (or the floating + button on scroll). Enter details like Name, SKU, Category, Price, and Stock.

**Recording Sales:** Use the "Record Sale" panel at the top. Select a product, choose the platform (e.g., Amazon), enter quantity, and click Confirm.

### Managing Stock:

**Low Stock:** Products running low will show a yellow warning badge.

**Out of Stock:** Products with 0 stock will show a red alert.

**Restock:** Click the "Restock" button on any card to quickly add inventory.

**Backup Data:** Click the "Backup" button in the header to download your inventory as a .json file.

**Restore Data:** Click "Restore" and select your backup file to load your data on a new browser or computer.

### 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

### 📄 License
This project is open source and available under the MIT License.