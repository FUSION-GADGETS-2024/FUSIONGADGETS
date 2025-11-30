'use client';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 1299,
    items: ["Premium Wireless Headphones"],
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "In Transit",
    total: 2499,
    items: ["Ultra HD Laptop Pro", "Wireless Mouse"],
  },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 bg-background">
        <div className="container mx-auto px-8 py-16">
          <h1 className="text-3xl font-semibold mb-8">My Orders</h1>
          
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order {order.id}</CardTitle>
                      <p className="text-sm text-text-secondary mt-1">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm">{item}</p>
                    ))}
                    <p className="text-sm font-semibold pt-2">
                      Total: ${order.total.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}