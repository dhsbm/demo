import React from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getInvoice, deleteInvoice } from '../data'

export default function Invoice() {
  let params = useParams()
  // @ts-ignore
  let invoice = getInvoice(parseInt(params.invoiceId, 10))
  let location = useLocation()
  let navigate = useNavigate()

  return (
    <main style={{ padding: '1rem' }}>
      <h2>Total Due: {invoice?.amount}</h2>
      <p>
        {invoice?.name}: {invoice?.number}
      </p>
      <p>Due Data: {invoice?.due}</p>
      <p>
        <button
          onClick={() => {
            deleteInvoice(invoice?.number)
            navigate('/invoices' + location.search)
          }}
        >
          Delete
        </button>
      </p>
    </main>
  )
}
