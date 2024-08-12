export const dynamic = "force-dynamic"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function FinancePage() {
  const income = Math.floor(Math.random() * 100000) + 50000 // Random income between 50,000 and 150,000
  const profit = Math.floor(Math.random() * (income * 0.3)) // Random profit up to 30% of income

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Dashboard</h1>
      <Link href="/">
        <Button className="mb-4">Home</Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${income.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${profit.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
