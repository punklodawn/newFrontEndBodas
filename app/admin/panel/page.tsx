"use client";
import { Fragment, useState, useEffect, useMemo } from "react";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";

interface MainGuest {
  id?: number;
  name: string;
  email?: string | null;
  code: string;
  is_attending?: boolean | null;
  dietary_restrictions?: string | null;
}

interface CompanionGuest {
  id: number;
  main_guest_id: number;
  name: string;
  is_adult: boolean;
  is_attending: boolean | null;
}

interface GuestStats {
  totalGuests: number;
  totalAttending: number;
  totalNotAttending: number;
  totalPending: number;
  totalAdults: number;
  totalChildren: number;
}

export default function AdminPanel() {
  const router = useRouter();
  const [mainGuest, setMainGuest] = useState<MainGuest>({
    name: "",
    email: "",
    code: "",
  });

  const [companions, setCompanions] = useState<CompanionGuest[]>([
    { name: "", is_adult: true, main_guest_id: 0, id: 0, is_attending: null },
  ]);

  const [allGuests, setAllGuests] = useState<
    (MainGuest & { companions: CompanionGuest[] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [expandedGuests, setExpandedGuests] = useState<Record<number, boolean>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const guestsPerPage = 10; // Puedes ajustar este número según prefieras

useEffect(() => {
  const player = document.querySelector('.music-player')
  if (player) player.classList.add('hidden')
  
  return () => {
    if (player) player.classList.remove('hidden')
  }
}, [])

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email !== "miguelmansillarev22@gmail.com") {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  // Cargar lista de invitados y sus acompañantes al montar el componente
  useEffect(() => {
    loadGuestsWithCompanions();
  }, []);

  const loadGuestsWithCompanions = async () => {
    try {
      setLoading(true);

      // 1. Cargar todos los invitados principales
      const { data: mainGuestsData, error: mainGuestsError } = await supabase
        .from("main_guests")
        .select("*")
        .order("id", { ascending: false });

      if (mainGuestsError) throw mainGuestsError;

      // 2. Cargar todos los acompañantes
      const { data: allCompanionsData, error: companionsError } = await supabase
        .from("companion_guests")
        .select("*");

      if (companionsError) throw companionsError;

      // 3. Combinar los datos
      const guestsWithCompanions =
        mainGuestsData?.map((guest) => ({
          ...guest,
          companions:
            allCompanionsData?.filter(
              (comp) => comp.main_guest_id === guest.id
            ) || [],
        })) || [];

      setAllGuests(guestsWithCompanions);
    } catch (error) {
      console.error("Error loading guests:", error);
      setMessage({
        type: "error",
        text: "Error al cargar la lista de invitados",
      });
    } finally {
      setLoading(false);
    }
  };

 // Estado para el filtro activo
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

// Filtrar invitados basado en el término de búsqueda Y el filtro activo
  const filteredGuests = useMemo(() => {
    let filtered = allGuests.filter(
      (guest) =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Aplicar filtros adicionales si hay uno activo
    if (activeFilter) {
      switch (activeFilter) {
        case 'attending':
          filtered = filtered.filter(guest => 
            guest.is_attending === true || 
            guest.companions.some(comp => comp.is_attending === true)
          );
          break;
        case 'notAttending':
          filtered = filtered.filter(guest => 
            guest.is_attending === false || 
            guest.companions.some(comp => comp.is_attending === false)
          );
          break;
        case 'pending':
          filtered = filtered.filter(guest => 
            guest.is_attending === null || 
            guest.companions.some(comp => comp.is_attending === null)
          );
          break;
        case 'adults':
          // Todos los invitados principales son adultos, más los acompañantes adultos
          filtered = filtered.filter(guest => 
            guest.companions.some(comp => comp.is_adult === true)
          );
          break;
        case 'children':
          filtered = filtered.filter(guest => 
            guest.companions.some(comp => comp.is_adult === false)
          );
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [allGuests, searchTerm, activeFilter]);


  // Calcular invitados para la página actual
  const currentGuests = useMemo(() => {
    const startIndex = (currentPage - 1) * guestsPerPage;
    return filteredGuests.slice(startIndex, startIndex + guestsPerPage);
  }, [filteredGuests, currentPage, guestsPerPage]);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);

  const handleMainGuestChange = (field: keyof MainGuest, value: string) => {
    setMainGuest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompanionChange = (
    index: number,
    field: keyof CompanionGuest,
    value: string | boolean
  ) => {
    const updated = [...companions];
    updated[index] = { ...updated[index], [field]: value };
    setCompanions(updated);
  };

  const addCompanion = () => {
    setCompanions([
      ...companions,
      {
        name: "",
        is_adult: true,
        main_guest_id: 0,
        id: 0,
        is_attending: null,
      },
    ]);
  };

  const removeCompanion = (index: number) => {
    if (companions.length > 1) {
      const updated = [...companions];
      updated.splice(index, 1);
      setCompanions(updated);
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setMainGuest((prev) => ({ ...prev, code: result }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validación básica
    if (!mainGuest.name || !mainGuest.code) {
      setMessage({ type: "error", text: "Por favor complete nombre y código" });
      return;
    }

    try {
      // 1. Insertar invitado principal
      const { data: mainGuestData, error: mainGuestError } = await supabase
        .from("main_guests")
        .insert([
          {
            name: mainGuest.name,
            email: mainGuest.email || null,
            code: mainGuest.code,
          },
        ])
        .select()
        .single();

      if (mainGuestError) throw mainGuestError;

      // 2. Insertar acompañantes si existen
      if (companions.some((c) => c.name.trim() !== "")) {
        const companionsToInsert = companions
          .filter((c) => c.name.trim() !== "")
          .map((c) => ({
            name: c.name,
            is_adult: c.is_adult,
            main_guest_id: mainGuestData.id,
            is_attending: null,
          }));

        if (companionsToInsert.length > 0) {
          const { error: companionsError } = await supabase
            .from("companion_guests")
            .insert(companionsToInsert);

          if (companionsError) throw companionsError;
        }
      }

      // 3. Limpiar formulario y mostrar mensaje
      setMainGuest({
        name: "",
        email: "",
        code: "",
      });
      setCompanions([
        {
          name: "",
          is_adult: true,
          main_guest_id: 0,
          id: 0,
          is_attending: null,
        },
      ]);

      setMessage({
        type: "success",
        text: "Invitado registrado correctamente",
      });
      loadGuestsWithCompanions(); // Recargar la lista completa
    } catch (error) {
      console.error("Error registering guest:", error);
      setMessage({ type: "error", text: "Error al registrar el invitado" });
    }
  };

  const toggleGuestExpansion = (guestId: number) => {
    setExpandedGuests((prev) => ({
      ...prev,
      [guestId]: !prev[guestId],
    }));
  };


  const calculateStats = useMemo(() => {
  const stats: GuestStats = {
    totalGuests: 0,
    totalAttending: 0,
    totalNotAttending: 0,
    totalPending: 0,
    totalAdults: 0,
    totalChildren: 0
  };


    allGuests.forEach(guest => {
      // Contar invitado principal (SIEMPRE es adulto)
      stats.totalGuests += 1;
      stats.totalAdults += 1; // Invitado principal siempre es adulto
      
      if (guest.is_attending === true) stats.totalAttending += 1;
      if (guest.is_attending === false) stats.totalNotAttending += 1;
      if (guest.is_attending === null) stats.totalPending += 1;

      // Contar acompañantes
      guest.companions.forEach(companion => {
        stats.totalGuests += 1;
        if (companion.is_attending === true) stats.totalAttending += 1;
        if (companion.is_attending === false) stats.totalNotAttending += 1;
        if (companion.is_attending === null) stats.totalPending += 1;
        
        if (companion.is_adult) stats.totalAdults += 1;
        else stats.totalChildren += 1;
      });
    });

    return stats;
  }, [allGuests]);



  return (
    <AdminGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

        {/* Formulario para registrar invitados */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Registrar Nuevo Invitado
          </h2>

          {message && (
            <div
              className={`p-3 rounded mb-4 ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Invitado Principal
                </label>
                <input
                  type="text"
                  value={mainGuest.name}
                  onChange={(e) =>
                    handleMainGuestChange("name", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Invitación
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mainGuest.code}
                    onChange={(e) =>
                      handleMainGuestChange("code", e.target.value)
                    }
                    className="flex-1 p-2 border border-gray-300 rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Generar
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Opcional)
              </label>
              <input
                type="email"
                value={mainGuest.email || ""}
                onChange={(e) => handleMainGuestChange("email", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Sección de acompañantes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Acompañantes
                </label>
                <button
                  type="button"
                  onClick={addCompanion}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  + Agregar
                </button>
              </div>

              <div className="space-y-2">
                {companions.map((companion, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Nombre del acompañante"
                      value={companion.name}
                      onChange={(e) =>
                        handleCompanionChange(index, "name", e.target.value)
                      }
                      className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <select
                      value={companion.is_adult ? "adult" : "child"}
                      onChange={(e) =>
                        handleCompanionChange(
                          index,
                          "is_adult",
                          e.target.value === "adult"
                        )
                      }
                      className="p-2 border border-gray-300 rounded"
                    >
                      <option value="adult">Adulto</option>
                      <option value="child">Niño</option>
                    </select>
                    {companions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompanion(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Registrar Invitado
            </button>
          </form>
        </div>

        {/* Lista de invitados registrados con sus acompañantes */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold">Invitados Registrados</h2>

            {/* Buscador */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar por nombre o código"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Resetear a la primera página al buscar
                }}
                className="w-full p-2 pl-10 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

        {/* Estadísticas INTERACTIVAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div 
            className={`p-4 rounded-lg shadow border cursor-pointer transition-all ${
              activeFilter === null 
                ? "bg-white border-gray-200" 
                : "bg-blue-50 border-blue-200"
            }`}
            onClick={() => setActiveFilter(null)}
          >
            <h3 className="text-sm font-medium text-gray-500">Total Invitados</h3>
            <p className="text-2xl font-semibold">{calculateStats.totalGuests}</p>
          </div>
          <div 
            className={`p-4 rounded-lg shadow border cursor-pointer transition-all ${
              activeFilter === 'attending' 
                ? "bg-green-100 border-green-300" 
                : "bg-green-50 border-green-200"
            }`}
            onClick={() => setActiveFilter('attending')}
          >
            <h3 className="text-sm font-medium text-green-600">Confirmados</h3>
            <p className="text-2xl font-semibold text-green-700">{calculateStats.totalAttending}</p>
          </div>
          <div 
            className={`p-4 rounded-lg shadow border cursor-pointer transition-all ${
              activeFilter === 'pending' 
                ? "bg-yellow-100 border-yellow-300" 
                : "bg-yellow-50 border-yellow-200"
            }`}
            onClick={() => setActiveFilter('pending')}
          >
            <h3 className="text-sm font-medium text-yellow-600">Por confirmar</h3>
            <p className="text-2xl font-semibold text-yellow-700">{calculateStats.totalPending}</p>
          </div>
          <div 
            className={`p-4 rounded-lg shadow border cursor-pointer transition-all ${
              activeFilter === 'notAttending' 
                ? "bg-red-100 border-red-300" 
                : "bg-red-50 border-red-200"
            }`}
            onClick={() => setActiveFilter('notAttending')}
          >
            <h3 className="text-sm font-medium text-red-600">No asistirán</h3>
            <p className="text-2xl font-semibold text-red-700">{calculateStats.totalNotAttending}</p>
          </div>
        </div>

        {/* Desglose adultos/niños INTERACTIVO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div 
            className={`p-4 rounded-lg shadow border cursor-pointer transition-all ${
              activeFilter === 'adults' 
                ? "bg-blue-100 border-blue-300" 
                : "bg-blue-50 border-blue-200"
            }`}
            onClick={() => setActiveFilter('adults')}
          >
            <h3 className="text-sm font-medium text-blue-600">Total Adultos</h3>
            <p className="text-2xl font-semibold text-blue-700">{calculateStats.totalAdults}</p>
          </div>
          <div 
            className={`p-4 rounded-lg shadow border cursor-pointer transition-all ${
              activeFilter === 'children' 
                ? "bg-purple-100 border-purple-300" 
                : "bg-purple-50 border-purple-200"
            }`}
            onClick={() => setActiveFilter('children')}
          >
            <h3 className="text-sm font-medium text-purple-600">Total Niños</h3>
            <p className="text-2xl font-semibold text-purple-700">{calculateStats.totalChildren}</p>
          </div>
        </div>

        {/* Indicador de filtro activo */}
        {activeFilter && (
          <div className="mb-4 flex items-center">
            <span className="text-sm text-gray-600 mr-2">Filtro activo:</span>
            <span className="text-sm font-medium text-blue-600 capitalize">
              {activeFilter === 'attending' && 'Confirmados'}
              {activeFilter === 'notAttending' && 'No asistirán'}
              {activeFilter === 'pending' && 'Por confirmar'}
              {activeFilter === 'adults' && 'Adultos'}
              {activeFilter === 'children' && 'Niños'}
            </span>
            <button 
              onClick={() => setActiveFilter(null)}
              className="ml-3 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
            >
              Limpiar filtro
            </button>
          </div>
        )}

          {loading ? (
            <p>Cargando lista de invitados...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confirmación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acompañantes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalles
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentGuests.map((guest) => (
                      <Fragment key={guest.id}>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {guest.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {guest.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {guest.email || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {guest.is_attending === true && (
                              <span className="text-green-600">Confirmado</span>
                            )}
                            {guest.is_attending === false && (
                              <span className="text-red-600">No asistirá</span>
                            )}
                            {guest.is_attending === null && (
                              <span className="text-gray-500">
                                Sin responder
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {guest.companions.length} acompañante(s)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {guest.id !== undefined ? (
                              <button
                                onClick={() => toggleGuestExpansion(guest.id!)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {expandedGuests[guest.id] ? "Ocultar" : "Ver"}{" "}
                                detalles
                              </button>
                            ) : (
                              <span className="text-gray-400">
                                No disponible
                              </span>
                            )}
                          </td>
                        </tr>
                        {guest.id !== undefined && expandedGuests[guest.id] && (
                          <tr>
                            <td colSpan={5} className="px-6 py-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">
                                      Lista de Acompañantes:
                                    </h4>
                                    {guest.companions.length > 0 ? (
                                      <ul className="list-disc list-inside space-y-1">
                                        {guest.companions.map((companion) => (
                                          <li
                                            key={companion.id}
                                            className="text-gray-700"
                                          >
                                            {companion.name}
                                            <span className="text-gray-500 text-sm ml-2">
                                              (
                                              {companion.is_adult
                                                ? "Adulto"
                                                : "Niño"}
                                              )
                                            </span>
                                            {companion.is_attending !==
                                              null && (
                                              <span
                                                className={`ml-2 text-sm ${
                                                  companion.is_attending
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                              >
                                                (
                                                {companion.is_attending
                                                  ? "Confirmado"
                                                  : "No asistirá"}
                                                )
                                              </span>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-gray-500">
                                        No hay acompañantes registrados
                                      </p>
                                    )}
                                  </div>

                                  {/* Sección de comentarios/sugerencias */}
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">
                                      Comentarios y Restricciones:
                                    </h4>
                                    {guest.dietary_restrictions ? (
                                      <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="text-gray-700">
                                          {guest.dietary_restrictions}
                                        </p>
                                      </div>
                                    ) : (
                                      <p className="text-gray-500">
                                        No hay comentarios o restricciones
                                        dietéticas
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>

                {filteredGuests.length === 0 && (
                  <p className="text-center py-4 text-gray-500">
                    {searchTerm
                      ? "No se encontraron invitados con ese criterio"
                      : "No hay invitados registrados aún"}
                  </p>
                )}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-4 py-2 border rounded ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Anterior
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Mostrar máximo 5 páginas en la navegación
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 border rounded ${
                            currentPage === pageNum
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2 py-2">...</span>
                    )}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 border rounded ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
