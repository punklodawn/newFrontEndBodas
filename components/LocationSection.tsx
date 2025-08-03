"use client"

import { useState } from "react"
import LocationCard from "./LocationCard"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

export default function LocationSection() {
  const [mapOpen, setMapOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<"ceremonia" | "recepcion">("ceremonia")

  const handleOpenMap = (location: "ceremonia" | "recepcion") => {
    setCurrentLocation(location)
    setMapOpen(true)
  }

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center nature-gradient">Ubicaciones</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LocationCard
            type="escala"
            title="Ceremonia Religiosa"
            time="19:00 pm"
            place="EL TEMPLO CATÓLICO DEL PUEBLO DE LA ESPERANZA"
            address="Camino interno a Golf Club - LA ESPERANZA"
            onMapClick={() => handleOpenMap("ceremonia")}
          />

          <LocationCard
            type="destino"
            title="Recepción"
            time="21:00 pm"
            place="Golf Club - LA ESPERANZA"
            address="Camino interno a Golf Club - LA ESPERANZA"
            onMapClick={() => handleOpenMap("recepcion")}
          />
        </div>
      </div>

      {/* Diálogo del mapa */}
      <Dialog open={mapOpen} onOpenChange={setMapOpen}>
        {/* Condiciona el título al estado del diálogo */}
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="relative h-[400px] w-full">
            <iframe
              src={
                currentLocation === "ceremonia"
                  ? "https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d1819.1961797453303!2d-64.83664627235962!3d-24.22805216773897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m5!1s0x941a589612c2144d%3A0x35a299654e46bba6!2sHospital%20Nuestro%20Se%C3%B1or%20de%20la%20Buena%20Esperanza!3m2!1d-24.2282913!2d-64.8363832!4m3!3m2!1d-24.228312199999998!2d-64.8349018!5e0!3m2!1ses-419!2sar!4v1754166980376!5m2!1ses-419!2sar"
                  : "https://www.google.com/maps/embed?pb=!1m24!1m8!1m3!1d3638.4537791941507!2d-64.83520723635401!3d-24.225902753158085!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x941a589612c2144d%3A0x35a299654e46bba6!2sHospital%20Nuestro%20Se%C3%B1or%20de%20la%20Buena%20Esperanza%2C%20Rogelio%20Leach%20S%2FNro%20y%20Calle%20Frente%20al%20Ingenio%2C%20Ingenio%20La%20Esperanza%2C%20Jujuy!3m2!1d-24.2282913!2d-64.8363832!4m5!1s0x941a5882674a9147%3A0xea4706b9ff3f9796!2sLa%20Esperanza%20Golf%20Club!3m2!1d-24.2245022!2d-64.8321891!5e0!3m2!1ses-419!2sar!4v1754167888871!5m2!1ses-419!2sar"
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <button
              onClick={() => setMapOpen(false)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 bg-white">
          {mapOpen && (
          <DialogTitle>
            Ubicación de la {currentLocation === "ceremonia" ? "Ceremonia" : "Recepción"}
          </DialogTitle>
            )}
            <h3 className="text-lg font-bold text-nature-green">
              {currentLocation === "ceremonia" ? "EL TEMPLO CATÓLICO DEL PUEBLO DE LA ESPERANZA" : "Hotel Majestic"}
            </h3>
            <p className="text-sm text-nature-green/80">
              {currentLocation === "ceremonia" ? "Av. Principal 123 - Ciudad" : "Calle Secundaria 456 - Ciudad"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

