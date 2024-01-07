import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

import CryptoDetails from '../components/CryptoDetailsSlider';
import api from '../api/api';


const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};

const SortIcon = ({ isActive, isAsc }) => {
  return (
    <span className="inline-block ml-1">
      <span className={`inline-block ${isActive && isAsc ? 'text-green-600' : 'text-gray-500'}`}>▲</span>
      <span className={`inline-block ${isActive && !isAsc ? 'text-green-600' : 'text-gray-500'}`}>▼</span>
    </span>
  );
};

const formatValuation = (value) => {
  const num = value ?? 0;
  if (num >= 1e6 && num < 1e9) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  return `${num.toFixed(2)}`;
};

const HomePage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [cryptoData, setCryptoData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [allCryptos, setAllCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(null); // État pour stocker la crypto sélectionnée
  const [currency, setCurrency] = useState('€');
  const conversionRate = 1.09;

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let cryptoIds;
        let allAutorizeCrypto
        if ( !isLoggedIn) {
          allAutorizeCrypto = await api.getAllCryptos();
          cryptoIds = allAutorizeCrypto.data.map(crypto => crypto._id);
        } else {
          allAutorizeCrypto = await api.getUserAuthorizedCrypto();
          cryptoIds = allAutorizeCrypto.data.cryptos.map(crypto => crypto);
        }
        const body = {
          "cryptoIds" : cryptoIds
        }
        console.log("body", body);
        const allAutorizeCryptoDatas = await api.getCryptoData(cryptoIds.join());
        console.log("datas:" , allAutorizeCryptoDatas);
        setCryptoData(allAutorizeCryptoDatas.data);
        setOriginalData(allAutorizeCryptoDatas.data); // Sauvegarde des données originales
        setAllCryptos(allAutorizeCrypto.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);


  const sortData = (key, isNumeric) => {
  
    if (!key || key === 'image' || key === 'symbol') {
      return; // Pas de tri pour 'image' et 'symbol'
    }
  
    let newSortConfig = { ...sortConfig };
    if (sortConfig.key === key) {
      newSortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : sortConfig.direction === 'desc' ? null : 'asc';
    } else {
      newSortConfig = { key, direction: 'asc' };
    }
  
    if (newSortConfig.direction === null) {
      setSortConfig(newSortConfig);
      setCryptoData([...originalData]);
    } else {
      const sortedData = [...cryptoData].sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];
    
        if (isNumeric) {
          aValue = aValue ? parseFloat(aValue.toString().replace(/[\%\$]/g, '')) : 0;
          bValue = bValue ? parseFloat(bValue.toString().replace(/[\%\$]/g, '')) : 0;
        }
    
        return newSortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });

      setCryptoData(sortedData);
    }
  
    setSortConfig(newSortConfig);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredData = searchTerm
    ? cryptoData.filter((crypto) =>
        crypto.name.toLowerCase().includes(searchTerm) || 
        crypto.symbol.toLowerCase().includes(searchTerm)
      )
    : cryptoData;
  
  const handleRowClick = (crypto) => {
    setSelectedCrypto(selectedCrypto === crypto ? null : crypto); // Basculer les détails
  };

  const handleCurrencyToggle = () => {
    setCurrency(currency === '€' ? '$' : '€');
  };

  const convertValue = (value) => {
    return currency === '$' ? (value * conversionRate).toFixed(2) : value;
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="container mx-auto py-8 px-20">
      <div className="mb-4 flex justify-between">
        <input 
          type="text" 
          className="w-full px-3 py-2 rounded-full border focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Rechercher une crypto (nom ou symbole)" 
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button 
          onClick={handleCurrencyToggle} 
          className="ml-4 px-3 py-2 bg-blue-500 text-white font-semibold rounded"
        >
          {currency === '€' ? '$' : '€'}
        </button>
      </div>
  
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 text-left">Crypto</th>
              <th className="px-2 cursor-pointer text-center" onClick={() => sortData('current_price', true)}>
                Current Price {<SortIcon isActive={sortConfig.key === 'current_price' && sortConfig.direction !== null} isAsc={sortConfig.direction === 'asc'} />}
              </th>
              <th className="px-2 cursor-pointer text-center" onClick={() => sortData('price_change_percentage_24h', true)}>
                24h % {<SortIcon isActive={sortConfig.key === 'price_change_percentage_24h'  && sortConfig.direction !== null} isAsc={sortConfig.direction === 'asc'} />}
              </th>
              <th className="px-2 cursor-pointer text-center" onClick={() => sortData('market_cap_change_percentage_24h', true)}>
                Market Cap Change 24h {<SortIcon isActive={sortConfig.key === 'market_cap_change_percentage_24h'  && sortConfig.direction !== null} isAsc={sortConfig.direction === 'asc'} />}
              </th>
              <th className="px-2 cursor-pointer text-center" onClick={() => sortData('fully_diluted_valuation', true)}>
                Fully Diluted Valuation {<SortIcon isActive={sortConfig.key === 'fully_diluted_valuation'  && sortConfig.direction !== null} isAsc={sortConfig.direction === 'asc'} />}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {filteredData.map((crypto) => (
            <React.Fragment key={crypto._id}>
              <tr className={`border-b border-gray-200 hover:bg-gray-100`}>
                <td className="px-2 flex items-center justify-start h-12">
                  <img src={crypto.crypto.image} alt={crypto.name} className="h-6 w-6 mr-2" />
                  <div>
                    <span className="font-medium">{crypto.symbol.toUpperCase()}</span>
                    <span className="text-sm text-gray-500 pl-2">{crypto.name}</span>
                  </div>
                </td>
                <td className="text-center">{convertValue(crypto.price)} {currency}</td>
                <td className={`text-center ${crypto.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {crypto.priceChange24h}%
                </td>
                <td className={`text-center ${crypto.market_cap_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {crypto.market_cap_change_percentage_24h}%
                </td>
                <td className="text-center">{formatValuation(convertValue(crypto.marketCap))}</td>
                <td className="text-center cursor-pointer"  onClick={() => handleRowClick(crypto)}>
                  <span className="inline-block ml-2  bg-blue-400 rounded-full py-1 px-2">{selectedCrypto === crypto ? '▼' : '▲'}</span>
                </td>
              </tr>
              {selectedCrypto === crypto && <tr><td colSpan="6"><CryptoDetails crypto={crypto} convert={convertValue} /></td></tr>}
            </React.Fragment>
          ))}
        </tbody>

        </table>
      </div>
    </div>
  );
  
  
};

export default HomePage;
