"use client"

import { useEffect, useMemo, useState } from "react"
import { Ticket, Crown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const MAX_PER_TABLE = 10

// 🔽 ahora entran más en pantalla
const VISIBLE_GUEST_ROWS = 12
const ROTATION_INTERVAL = 5000

const guestTableNames = [
  "VALLE DE LAS PROMESAS",
  "QUEBRADA DEL ENCUENTRO",
  "TILCARA DEL CORAZÓN",
  "CACTUS DEL AMOR VERDADERO",
  'CERRO DEL "SÍ, QUIERO"',
  "PUCARÁ DEL COMPROMISO",
  "CIELO DE LOS ETERNOS",
  "SALINAS DEL ALMA",
  "TREN DE LAS EMOCIONES",
  "DESIERTO DE LA FELICIDAD",
  "PUENTE DE LOS CORAZONES",
  "MONTE DE LA DULZURA",
  "CAMINO DEL AMOR ANDINO",
  "LAGUNA DE LAS CARICIAS",
]

const headTable = { name: "MESA PRINCIPAL" }
const guestData: { table: string }[] = []

function pad2(n: number) {
  return n.toString().padStart(2, "0")
}
function addMinutes(date: Date, mins: number) {
  return new Date(date.getTime() + mins * 60000)
}

export default function FlightBoardOlive() {
  const [now, setNow] = useState(new Date())
  const [page, setPage] = useState(0)

  // Pausa media (por si hay audio global)
  useEffect(() => {
    document.querySelectorAll("audio, video").forEach((el) => {
      try {
        ;(el as HTMLMediaElement).pause()
      } catch {}
    })
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const { headRow, guestRows } = useMemo(() => {
    const base = new Date()

    const headTime = addMinutes(base, 2)
    const headRow = {
      key: "principal",
      time: `${pad2(headTime.getHours())}:${pad2(headTime.getMinutes())}`,
      flight: "LM-VIP",
      destination: headTable.name,
      gate: "PRINCIPAL",
      status: "RESERVADA",
      remark: "SOLO NOVIOS",
    }

    const guestRows = Array.from({ length: 14 }, (_, i) => {
      const tableNumber = (i + 1).toString()
      const destination = guestTableNames[i]

      const occupied = guestData.filter((g) => g.table === tableNumber).length
      const available = Math.max(0, MAX_PER_TABLE - occupied)

      const time = addMinutes(base, (i + 1) * 3)
      const timeStr = `${pad2(time.getHours())}:${pad2(time.getMinutes())}`

      return {
        key: tableNumber,
        time: timeStr,
        flight: `LM-${pad2(i + 1)}26`,
        destination,
        gate: `MESA ${tableNumber}`,
        status: available > 0 ? "DISPONIBLE" : "COMPLETA",
        remark: available > 0 ? `${available}/${MAX_PER_TABLE} LIBRES` : "SIN LUGARES",
      }
    })

    return { headRow, guestRows }
  }, [])

  const totalPages = Math.max(1, Math.ceil(guestRows.length / VISIBLE_GUEST_ROWS))

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages)
    }, ROTATION_INTERVAL)
    return () => clearInterval(interval)
  }, [totalPages])

  const visibleGuests = guestRows.slice(
    page * VISIBLE_GUEST_ROWS,
    page * VISIBLE_GUEST_ROWS + VISIBLE_GUEST_ROWS
  )

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#8FAE5D] text-white">
      {/* HEADER más bajo */}
      <div className="px-4 py-2 border-b border-white/30 bg-[#7F9E4F]/35">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 border border-white/30 px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest flex items-center gap-2">
              <Ticket className="w-3.5 h-3.5" />
              DEPARTURES
            </div>
            <div>
              <div className="text-base font-black tracking-wider">VUELO LM-2026</div>
              <div className="text-[10px] font-bold tracking-widest text-white/85">
                TABLERO DE MESAS · ASIENTOS LIBRES
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-2xl font-black tracking-wider">
              {now.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </div>
            <div className="text-[10px] font-bold tracking-widest text-white/85">
              14 FEB 2026
            </div>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="flex-1 px-4 py-3 overflow-hidden">
        {/* Encabezado columnas más bajo */}
        <div className="grid grid-cols-12 text-[10px] font-black tracking-widest border-b border-white/30 pb-1">
          <div className="col-span-2">HORA</div>
          <div className="col-span-2">VUELO</div>
          <div className="col-span-4">DESTINO</div>
          <div className="col-span-2">PUERTA</div>
          <div className="col-span-2 text-right">ESTADO</div>
        </div>

        {/* MESA PRINCIPAL FIJA más compacta */}
        <div className="mt-2 mb-2 grid grid-cols-12 items-center bg-white/18 border border-white/28 rounded-lg px-3 py-2">
          <div className="col-span-2 font-mono font-black text-base">{headRow.time}</div>

          <div className="col-span-2 font-mono font-black flex items-center gap-2 text-sm">
            <Crown className="w-4 h-4" />
            {headRow.flight}
          </div>

          <div className="col-span-4 font-black truncate text-sm">
            {headRow.destination}
            <div className="text-[9px] font-bold tracking-widest text-white/85 mt-0.5">
              {headRow.remark}
            </div>
          </div>

          <div className="col-span-2 font-mono font-black text-sm">{headRow.gate}</div>

          <div className="col-span-2 text-right">
            <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-white/26 border border-white/35">
              {headRow.status}
            </span>
          </div>
        </div>

        {/* ROTACIÓN (sin scroll) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            {visibleGuests.map((row) => (
              <div
                key={row.key}
                className="grid grid-cols-12 items-center bg-[#7F9E4F]/25 border border-white/22 rounded-lg px-3 py-2"
              >
                <div className="col-span-2 font-mono font-black text-base">{row.time}</div>

                <div className="col-span-2 font-mono font-black text-sm">{row.flight}</div>

                <div className="col-span-4 font-black truncate text-sm">
                  {row.destination}
                  <div className="text-[9px] font-bold tracking-widest text-white/85 mt-0.5">
                    {row.remark}
                  </div>
                </div>

                <div className="col-span-2 font-mono font-black text-sm">{row.gate}</div>

                <div className="col-span-2 text-right">
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-white/22 border border-white/28">
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-2 text-center text-[10px] font-black tracking-widest text-white/85">
          PÁGINA {page + 1}/{totalPages}
        </div>
      </div>

      {/* FOOTER más bajo */}
      <div className="border-t border-white/30 py-2 text-center text-[10px] font-black tracking-widest bg-[#7F9E4F]/35">
        ELIJA UNA MESA DISPONIBLE · ASIENTOS LIBRES · ¡BUEN VIAJE!
      </div>
    </div>
  )
}
