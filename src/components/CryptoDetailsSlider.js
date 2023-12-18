import React, { useState, useEffect } from 'react';
import api from '../api/api';


const CryptoDetails = ({ crypto }) => {
    return (
      <div className="border-t border-gray-200 bg-gray-100 px-4 py-2">
        <h3 className="font-bold">{crypto.name}</h3>
        <p>Price: {crypto.current_price} €</p>
        <p>24h Change: {crypto.price_change_percentage_24h}%</p>
        <p>Market Cap Change 24h: {crypto.market_cap_change_percentage_24h}%</p>
        <p>Fully Diluted Valuation: {formatValuation(crypto.fully_diluted_valuation)}</p>
        {/* Ajoutez d'autres détails que vous souhaitez afficher */}
      </div>
    );
  };

  
export default CryptoDetails;
