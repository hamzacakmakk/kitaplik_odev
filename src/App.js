import React, { useState, useEffect } from "react";

const kitaplarData = [
  { id: 1, baslik: "Küçük Prens", yazar: "Antoine de Saint-Exupéry", kategori: "Roman" },
  { id: 2, baslik: "1984", yazar: "George Orwell", kategori: "Roman" },
  { id: 3, baslik: "Bir Bilim Adamının Romanı", yazar: "Oğuz Atay", kategori: "Biyografi" },
  { id: 4, baslik: "Sapiens", yazar: "Yuval Noah Harari", kategori: "Tarih" },
  { id: 5, baslik: "Dönüşüm", yazar: "Franz Kafka", kategori: "Roman" },
  { id: 6, baslik: "Nutuk", yazar: "Mustafa Kemal Atatürk", kategori: "Tarih" }
]

function App() {
  const [aramaMetni, setAramaMetni] = useState(() => {
    return localStorage.getItem("aramaMetni") || ""
  })
  const [kategori, setKategori] = useState("Hepsi")
  const [favoriler, setFavoriler] = useState(() => {
    const kayitli = localStorage.getItem("favoriler")
    return kayitli ? JSON.parse(kayitli) : []
  })

  useEffect(() => {
    localStorage.setItem("aramaMetni", aramaMetni)
  }, [aramaMetni])

  useEffect(() => {
    localStorage.setItem("favoriler", JSON.stringify(favoriler))
  }, [favoriler])

  const toggleFavori = (id) => {
    setFavoriler(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const filtrelenmis = kitaplarData.filter(k => {
    const baslikUygun = k.baslik.toLowerCase().includes(aramaMetni.toLowerCase())
    const kategoriUygun = kategori === "Hepsi" || k.kategori === kategori
    return baslikUygun && kategoriUygun
  })

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Okul Kitaplığı</h1>
      <AramaCubugu aramaMetni={aramaMetni} setAramaMetni={setAramaMetni} />
      <KategoriFiltre kategori={kategori} setKategori={setKategori} />
      <FavoriPaneli kitaplar={kitaplarData} favoriler={favoriler} />
      <KitapListe kitaplar={filtrelenmis} favoriler={favoriler} toggleFavori={toggleFavori} />
    </div>
  )
}

function AramaCubugu({ aramaMetni, setAramaMetni }) {
  return (
    <input
      type="text"
      value={aramaMetni}
      onChange={e => setAramaMetni(e.target.value)}
      placeholder="Kitap ara..."
      style={{ padding: 5, marginRight: 10 }}
    />
  )
}

function KategoriFiltre({ kategori, setKategori }) {
  const kategoriler = ["Hepsi", "Roman", "Tarih", "Biyografi"]
  return (
    <select value={kategori} onChange={e => setKategori(e.target.value)} style={{ padding: 5 }}>
      {kategoriler.map((k, i) => (
        <option key={i} value={k}>{k}</option>
      ))}
    </select>
  )
}

function KitapListe({ kitaplar, favoriler, toggleFavori }) {
  return (
    <div style={{ marginTop: 20 }}>
      {kitaplar.map(k => (
        <KitapKarti
          key={k.id}
          {...k}
          favorideMi={favoriler.includes(k.id)}
          toggleFavori={toggleFavori}
        />
      ))}
    </div>
  )
}

function KitapKarti({ baslik, yazar, kategori, id, favorideMi, toggleFavori }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: "8px 0" }}>
      <h3>{baslik}</h3>
      <p>{yazar} - {kategori}</p>
      <button onClick={() => toggleFavori(id)}>
        {favorideMi ? "Favoriden Çıkar" : "Favori Ekle"}
      </button>
    </div>
  )
}

function FavoriPaneli({ kitaplar, favoriler }) {
  const favoriKitaplar = kitaplar.filter(k => favoriler.includes(k.id))
  return (
    <div style={{ marginTop: 20 }}>
      <h2>Favoriler ({favoriler.length})</h2>
      <ul>
        {favoriKitaplar.map(k => (
          <li key={k.id}>{k.baslik}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
