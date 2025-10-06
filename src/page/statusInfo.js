import React, { useState, useEffect } from 'react';
import api from '../api/api';

const StatusInfo = ({ apiUrls = {}, activeUrl, setActiveUrl }) => {
  const [status, setStatus] = useState(null); // null: loading, 'green' or 'red'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlsStatus, setUrlsStatus] = useState({}); // { key: 'green'|'red'|null }

  const checkActiveStatus = async (url) => {
    setStatus(null);
    try {
      const res = await api.status(url);
      setStatus('green');
      return 'green';
    } catch (e) {
      setStatus('red');
      return 'red';
    }
  };

  const openModalAndCheckAll = async () => {
    setIsModalOpen(true);
    // Set all to loading
    const keys = Object.keys(apiUrls);
    const initial = {};
    keys.forEach(k => (initial[k] = null));
    setUrlsStatus(initial);

    // Check each url status in parallel
    await Promise.all(keys.map(async (k) => {
      try {
        await api.status(apiUrls[k]);
        setUrlsStatus(prev => ({ ...prev, [k]: 'green' }));
      } catch (err) {
        setUrlsStatus(prev => ({ ...prev, [k]: 'red' }));
      }
    }));
  };

  useEffect(() => {
    // check active url at mount and when activeUrl changes
    if (activeUrl) {
      checkActiveStatus(activeUrl);
      const interval = setInterval(() => {
        checkActiveStatus(activeUrl);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeUrl]);

  const handleSelectUrl = async (key) => {
    const url = apiUrls[key];
    // set UI to loading for that url
    setUrlsStatus(prev => ({ ...prev, [key]: null }));
    try {
      await api.status(url);
      // success: set active
      setActiveUrl(url);
      // update statuses: mark selected green
      setUrlsStatus(prev => ({ ...prev, [key]: 'green' }));
      // re-check active status
      await checkActiveStatus(url);
    } catch (err) {
      setUrlsStatus(prev => ({ ...prev, [key]: 'red' }));
      // keep modal open so user can choose another
    }
  };

  const currentKey = Object.keys(apiUrls).find(k => apiUrls[k] === activeUrl) || null;

  return (
    <>
      <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gray-700 rounded-lg shadow-md border border-gray-600 w-fit fixed top-4 z-50">
        <div className="text-xs text-gray-200 px-2 py-1 bg-gray-800 rounded select-none">{activeUrl}</div>
        <button
          className="ml-2 px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded"
          onClick={() => openModalAndCheckAll()}
        >
          Modifier
        </button>
        <span className="text-white font-medium select-none">
          {status === 'green' ? 'Connecté' : status === 'red' ? 'Non connecté' : '...'}
        </span>
        <div className="w-8 h-8 flex items-center justify-center cursor-pointer" onClick={() => checkActiveStatus(activeUrl)}>
          <div
            className={`w-8 h-8 rounded-full ${
              status === 'green'
                ? 'bg-green-500'
                : status === 'red'
                ? 'bg-red-500'
                : 'bg-gray-500'
            } flex items-center justify-center`}
          >
            {status === null && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-start pt-24 justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-gray-800 text-white rounded-lg shadow-xl w-96 p-4 border border-gray-600">
            <h3 className="text-lg font-semibold mb-3">Sélectionner l'URL</h3>
            <div className="space-y-2 max-h-64 overflow-auto">
              {Object.keys(apiUrls).map((k) => (
                <div key={k} className={`flex items-center justify-between p-2 rounded ${currentKey === k ? 'bg-gray-700 border border-gray-600' : 'hover:bg-gray-700'}`}>
                  <div className="flex flex-col items-start space-y-1">
                    <div className="text-sm font-medium select-none flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${urlsStatus[k] === 'green' ? 'bg-green-500' : urlsStatus[k] === 'red' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                      <span>{k}</span>
                    </div>
                    <div className="text-xs text-gray-300 truncate max-w-xs">{apiUrls[k]}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSelectUrl(k)}
                      className={`text-sm px-2 py-1 rounded ${currentKey === k ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                    >
                      {currentKey === k ? 'Actuel' : 'Sélectionner'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button className="px-3 py-1 bg-gray-600 rounded" onClick={() => setIsModalOpen(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusInfo;