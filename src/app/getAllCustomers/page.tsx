"use client"

import { useState, useEffect } from "react"

type Customer = {
  _id: string
  name: string
  email: string
  phone: string
  status: string
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers/all")

        // Check if response is OK
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        // Check content type to ensure it's JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON. Check your API endpoint.")
        }

        const data = await response.json()
        setCustomers(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching customers:", err)
          setError(err.message)
        } else {
          console.error("Unknown error fetching customers:", err)
          setError("An unknown error occurred while fetching customers")
        }
      } 
      
      finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const customerList = document.querySelector("[data-customer-list]")
      if (customerList && window.innerWidth <= 640) {
        ;(customerList as HTMLElement).style.gridTemplateColumns = "1fr"
      } else if (customerList) {
        ;(customerList as HTMLElement).style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))"
      }
    }

    // Initial call
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Customer List</h1>

      {loading && <p style={styles.loading}>Loading customers...</p>}

      {error && (
        <div style={styles.error}>
          <p>Error: {error}</p>
          <p style={styles.errorHelp}>Make sure your API endpoint is returning valid JSON data.</p>
        </div>
      )}

      {!loading && !error && customers.length === 0 && <p style={styles.noCustomers}>No customers found.</p>}

      <div style={styles.customerList} data-customer-list>
        {!loading &&
          !error &&
          customers.map((customer) => (
            <div key={customer._id} style={styles.card}>
              <div>
                <h2 style={styles.name}>{customer.name}</h2>
                <p style={styles.email}>{customer.email}</p>
                <p style={styles.phone}>{customer.phone}</p>
                <p style={styles.statusLabel}>
                  Status:
                  <span
                    style={{
                      ...styles.status,
                      color:
                        customer.status.toLowerCase() === "active"
                          ? "#2e7d32"
                          : customer.status.toLowerCase() === "inactive"
                            ? "#c62828"
                            : "#f57c00",
                    }}
                  >
                    {customer.status}
                  </span>
                </p>
              </div>
              <div style={styles.actions}>
                <button style={styles.actionButton}>Actions</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    marginBottom: "2rem",
    fontSize: "2rem",
    color: "#333",
  },
  loading: {
    textAlign: "center" as const,
    fontSize: "1.2rem",
    color: "#666",
  },
  error: {
    padding: "1rem",
    backgroundColor: "#ffebee",
    border: "1px solid #ffcdd2",
    borderRadius: "4px",
    color: "#c62828",
    marginBottom: "1rem",
  },
  errorHelp: {
    fontSize: "0.9rem",
    marginTop: "0.5rem",
  },
  noCustomers: {
    textAlign: "center" as const,
    fontSize: "1.2rem",
    color: "#666",
    padding: "2rem",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  },
  customerList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    padding: "1.5rem",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  name: {
    fontSize: "1.25rem",
    margin: "0 0 0.5rem 0",
    color: "#333",
  },
  email: {
    margin: "0.25rem 0",
    color: "#666",
    fontSize: "0.9rem",
  },
  phone: {
    margin: "0.25rem 0",
    color: "#666",
    fontSize: "0.9rem",
  },
  statusLabel: {
    margin: "0.5rem 0",
    fontWeight: 500,
  },
  status: {
    marginLeft: "0.5rem",
    fontWeight: "bold",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
  },
  actionButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f5f5f5",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    color: "#333",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
}
