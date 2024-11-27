const express = require('express');
const cors = require('cors');

const app = express();

// CORS middleware (ön uç ile backend arasında iletişimi sağlar)
app.use(cors({ origin: 'http://localhost:5173' }));

// JSON formatında veri işlemek için middleware
app.use(express.json());

// Örnek bir API endpoint
app.get('/api/cart/view', (req, res) => {
  res.json({ items: [{ id: 1, name: 'Product 1', quantity: 2 }] });
});

// Sunucuyu başlat
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
