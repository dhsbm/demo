import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Expenses from './routes/expenses'
import Invoices from './routes/invoices'
import Invoice from './routes/invoice'

const root = ReactDOM.createRoot(
  // @ts-ignore
  document.getElementById('root')
)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="expenses" element={<Expenses />}></Route>
        <Route path="invoices" element={<Invoices />}>
          <Route path=":invoiceId" element={<Invoice />}></Route>
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There is nothing here!</p>
            </main>
          }
        ></Route>
      </Route>
    </Routes>
  </BrowserRouter>
)
