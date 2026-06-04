import { useState } from 'react'
import './App.css'

export default function App() {
  const [language, setLanguage] = useState('es')
  const [market, setMarket] = useState('')
  const [product, setProduct] = useState('')
  const [results, setResults] = useState(null)

  const texts = {
    es: {
      title: 'Fair Compes',
      subtitle: 'Monitor de Prácticas Anticompetitivas',
      market: 'Mercado',
      product: 'Producto',
      search: 'Buscar',
      selectMarket: 'Selecciona un mercado...',
      results: 'Resultados',
      alert: 'Patrones detectados:',
      noResults: 'Ingresa datos para ver resultados'
    },
    en: {
      title: 'Fair Compes',
      subtitle: 'Anticompetitive Practices Monitor',
      market: 'Market',
      product: 'Product',
      search: 'Search',
      selectMarket: 'Select a market...',
      results: 'Results',
      alert: 'Patterns detected:',
      noResults: 'Enter data to see results'
    }
  }

  const t = texts[language]

  const handleSearch = () => {
    if (market && product) {
      setResults({
        market,
        product,
        patterns: [
          'Price fixing (85% probability)',
          'Market concentration (60% probability)',
          'Predatory pricing (45% probability)'
        ]
      })
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <button 
          className="lang-btn"
          onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
        >
          {language === 'es' ? 'English' : 'Español'}
        </button>
      </header>

      <main className="main">
        <section className="search-section">
          <div className="input-group">
            <label>{t.market}</label>
            <select 
              value={market} 
              onChange={(e) => setMarket(e.target.value)}
              className="input"
            >
              <option value="">{t.selectMarket}</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Telecomunicaciones">Telecomunicaciones</option>
              <option value="Energía">Energía</option>
              <option value="Transporte">Transporte</option>
            </select>
          </div>

          <div className="input-group">
            <label>{t.product}</label>
            <input 
              type="text" 
              placeholder="Ingresa producto..."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="input"
            />
          </div>

          <button 
            onClick={handleSearch}
            className="btn-search"
          >
            {t.search}
          </button>
        </section>

        {results && (
          <section className="results-section">
            <h2>{t.results}</h2>
            <div className="result-card">
              <p><strong>Mercado:</strong> {results.market}</p>
              <p><strong>Producto:</strong> {results.product}</p>
              <div className="alert">
                <h3>⚠️ {t.alert}</h3>
                <ul>
                  {results.patterns.map((pattern, i) => (
                    <li key={i}>{pattern}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {!results && (
          <section className="info-section">
            <p>{t.noResults}</p>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Fair Compes © 2024 - Monitor de Competencia</p>
      </footer>
    </div>
  )
}
