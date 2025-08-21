"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/supabase/supabase";

interface Photo {
  id: string;
  created_at: string;
  guest_name: string;
  image_url: string;
  status: "pending" | "approved" | "rejected";
  moderated_at: string | null;
  moderated_by: string | null;
}

export default function PhotoModerationPage() {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 12, 24, 48

  useEffect(() => {
    fetchAllPhotos();
  }, []);

  // Calcular páginas y elementos mostrados
  const totalItems = filteredPhotos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPhotos = filteredPhotos.slice(startIndex, endIndex);

  const fetchAllPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("wedding_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching photos:", error);
      } else {
        setAllPhotos(data || []);
        applyFilter("pending", data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filterType: typeof filter, photos: Photo[]) => {
    setCurrentPage(1); // Resetear a primera página al cambiar filtro
    if (filterType === "all") {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter((photo) => photo.status === filterType));
    }
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    applyFilter(newFilter, allPhotos);
  };

  const moderatePhoto = async (id: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("wedding_photos")
        .update({
          status,
          moderated_at: new Date().toISOString(),
          moderated_by: "admin",
        })
        .eq("id", id);

      if (error) {
        console.error("Error moderating photo:", error);
      } else {
        setAllPhotos((prev) =>
          prev.map((photo) =>
            photo.id === id
              ? {
                  ...photo,
                  status,
                  moderated_at: new Date().toISOString(),
                  moderated_by: "admin",
                }
              : photo
          )
        );

        setFilteredPhotos((prev) => prev.filter((photo) => photo.id !== id));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Contadores para cada estado
  const pendingCount = allPhotos.filter((p) => p.status === "pending").length;
  const approvedCount = allPhotos.filter((p) => p.status === "approved").length;
  const rejectedCount = allPhotos.filter((p) => p.status === "rejected").length;

  // Navegación de páginas
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-nature-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
            Moderación de Fotos
          </h1>
          <p className="text-lg text-nature-green">
            Gestiona las fotos subidas por los invitados
          </p>
        </motion.div>

        {/* Panel de Monitoreo */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-nature-sage mb-8">
          <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
            <h2 className="text-xl font-bold">Monitoreo y Estadísticas</h2>
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-nature-cream rounded-lg border border-nature-sage">
              <div className="text-2xl font-bold text-nature-green">
                {allPhotos.length}
              </div>
              <div className="text-sm text-nature-green">Total Fotos</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">
                {pendingCount}
              </div>
              <div className="text-sm text-yellow-700">Pendientes</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">
                {approvedCount}
              </div>
              <div className="text-sm text-green-700">Aprobadas</div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700">
                {rejectedCount}
              </div>
              <div className="text-sm text-red-700">Rechazadas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-nature-sage mb-8">
          <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-xl font-bold mb-2 md:mb-0">Filtros</h2>

            <div className="flex items-center space-x-2">
              <span className="text-sm">Fotos por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-white text-nature-green px-2 py-1 rounded border border-nature-sage"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>

          <div className="p-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-full ${
                filter === "all"
                  ? "bg-nature-green text-white"
                  : "bg-gray-100 text-nature-green"
              }`}
            >
              Todas ({allPhotos.length})
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={`px-4 py-2 rounded-full ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-nature-green"
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => handleFilterChange("approved")}
              className={`px-4 py-2 rounded-full ${
                filter === "approved"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-nature-green"
              }`}
            >
              Aprobadas ({approvedCount})
            </button>
            <button
              onClick={() => handleFilterChange("rejected")}
              className={`px-4 py-2 rounded-full ${
                filter === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-nature-green"
              }`}
            >
              Rechazadas ({rejectedCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-nature-green animate-spin" />
          </div>
        ) : currentPhotos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-nature-sage">
            <p className="text-nature-green text-lg">
              {filter === "pending"
                ? "No hay fotos pendientes de moderación"
                : `No hay fotos ${filter === "all" ? "" : filter}`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-nature-sage"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={photo.image_url}
                      alt={`Foto de ${photo.guest_name}`}
                      fill
                      className="object-cover"
                      onClick={() => setPreviewImage(photo.image_url)}
                    />

                    {photo.status === "pending" && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                        Pendiente
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-nature-green font-medium mb-2">
                      Subido por: {photo.guest_name || "Anónimo"}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(photo.created_at).toLocaleDateString("es-ES")}
                    </p>

                    {photo.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => moderatePhoto(photo.id, "approved")}
                          className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                        >
                          <Check className="h-4 w-4 mr-1" /> Aprobar
                        </button>
                        <button
                          onClick={() => moderatePhoto(photo.id, "rejected")}
                          className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4 mr-1" /> Rechazar
                        </button>
                      </div>
                    )}

                    {photo.status !== "pending" && (
                      <div
                        className={`px-3 py-1 rounded-full text-center text-sm ${
                          photo.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {photo.status === "approved" ? "Aprobada" : "Rechazada"}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-nature-green text-white hover:bg-nature-sage"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex space-x-1">
                  {(() => {
                    // Calcular rango de páginas a mostrar
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(totalPages, startPage + 4);

                    // Ajustar si estamos cerca del final
                    if (endPage - startPage < 4) {
                      startPage = Math.max(1, endPage - 4);
                    }

                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => goToPage(i)}
                          className={`w-10 h-10 rounded-full ${
                            currentPage === i
                              ? "bg-nature-green text-white"
                              : "bg-gray-100 text-nature-green hover:bg-gray-200"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-nature-green text-white hover:bg-nature-sage"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <span className="text-nature-green text-sm">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de vista previa */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute -top-12 right-0 text-white text-3xl"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <Image
              src={previewImage}
              alt="Vista previa"
              width={800}
              height={600}
              className="object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
