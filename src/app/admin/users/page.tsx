"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";
import { ArrowLeft, Search, Users, UserCheck, UserX } from "lucide-react";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      alert("Rol actualizado exitosamente");
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Error al actualizar el rol");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name &&
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <UserCheck className="h-4 w-4" />;
      case "user":
        return <Users className="h-4 w-4" />;
      default:
        return <UserX className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <ProfileAdminGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </ProfileAdminGuard>
    );
  }

  return (
    <ProfileAdminGuard>
      <div className="min-h-screen bg-black text-[#ededed]">
        {/* Header */}
        <div className="bg-[#0b0b0b] border border-[#333333] shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="text-neutral-400 hover:text-[#ededed]"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-[#ededed]">
                    Gestión de Usuarios
                  </h1>
                  <p className="text-neutral-400 mt-1">
                    Administra usuarios y roles del sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400"
                />
              </div>

              <div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                >
                  <option value="">Todos los roles</option>
                  <option value="admin">Administradores</option>
                  <option value="user">Usuarios</option>
                </select>
              </div>

              <div className="flex items-center text-sm text-neutral-400">
                <Users className="h-4 w-4 mr-2" />
                {filteredUsers.length} usuarios encontrados
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-black text-[#ededed]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0b0b0b] border border-[#333333] divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-black text-[#ededed]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <Users className="h-5 w-5 text-neutral-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#ededed]">
                              {user.full_name || "Sin nombre"}
                            </div>
                            <div className="text-sm text-neutral-400">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#ededed]">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#ededed]">
                          {user.phone || "No especificado"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {getRoleIcon(user.role)}
                          <span className="ml-1 capitalize">{user.role}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {new Date(user.created_at).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="text-sm border border-[#333333] rounded px-2 py-1 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                          >
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-[#ededed]">
                  No hay usuarios
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {searchTerm || selectedRole
                    ? "No se encontraron usuarios con los filtros aplicados."
                    : "No hay usuarios registrados en el sistema."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProfileAdminGuard>
  );
};

export default UsersManagement;
