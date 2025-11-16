"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  Package,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format-currency";

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  selectedSize?: string;
  customization?: {
    printSizeId: string;
    colorName: string;
    extraCost: number;
  };
};

type Order = {
  id: string;
  mercadopago_payment_id: string;
  external_reference: string;
  status: string;
  total: number;
  currency: string;
  items: OrderItem[];
  customer_email?: string;
  customer_name?: string;
  created_at: string;
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders");
        if (!response.ok) {
          throw new Error("Error al cargar las órdenes");
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "rejected":
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "Aprobado";
      case "pending":
        return "Pendiente";
      case "rejected":
        return "Rechazado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <ProfileAdminGuard>
      <div className="min-h-screen bg-black text-[#ededed]">
        <div className="bg-[#0b0b0b] border-b border-[#333333]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="text-neutral-400 hover:text-[#ededed] transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-[#ededed]">
                    Órdenes de Compra
                  </h1>
                  <p className="text-neutral-400 mt-1">
                    Gestiona y revisa todas las órdenes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
              <p className="text-red-400">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-400 mb-2">
                No hay órdenes aún
              </h3>
              <p className="text-neutral-500">
                Las órdenes de compra aparecerán aquí cuando los clientes
                realicen compras.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6 hover:border-[#555555] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#ededed]">
                          Orden #{order.external_reference}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-neutral-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.created_at).toLocaleDateString(
                            "es-AR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                        {order.customer_email && (
                          <div className="flex items-center">
                            <span>{order.customer_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-2xl font-bold text-[#ededed]">
                        <DollarSign className="h-6 w-6" />
                        {formatCurrency(order.total, order.currency)}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        MP: {order.mercadopago_payment_id}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#333333] pt-4">
                    <h4 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Productos ({order.items?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={`${item.productId}-${idx}`}
                          className="flex items-center justify-between bg-neutral-900/50 rounded-lg p-3"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#ededed]">
                              {item.name}
                            </p>
                            <p className="text-xs text-neutral-400">
                              Cant: {item.quantity}
                              {item.selectedSize
                                ? ` · Talle ${item.selectedSize}`
                                : ""}
                              {item.customization
                                ? ` · Estampa ${item.customization.printSizeId} · ${item.customization.colorName}`
                                : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#ededed]">
                              {formatCurrency(
                                (item.price +
                                  (item.customization?.extraCost || 0)) *
                                  item.quantity,
                                item.currency
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProfileAdminGuard>
  );
};

export default OrdersPage;
