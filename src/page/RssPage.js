import React, { useState, useEffect } from 'react';
import api from '../api/api';
import ArticleCard from '../components/ArticleCard';

const RssPage = () => {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 10;
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(articles.length / articlesPerPage);

  useEffect(() => {
    const fetchRssFeed = async () => {
      try {
        const response = await api.getRssFeedByKeywords();
        console.log(response);
        setArticles(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du flux RSS:', error);
      }
    };

    fetchRssFeed();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    let pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage < 2) {
        startPage = 1;
        endPage = 2;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  

  return (
    <div className="container mx-auto p-4">
        <nav className="flex justify-center mt-4">
        <ul className="inline-flex items-center -space-x-px">
          {currentPage > 2 && (
            <li>
              <button onClick={() => paginate(1)} className="px-3 py-1 rounded-l-lg bg-gray-200 hover:bg-gray-300">1</button>
            </li>
          )}
          {currentPage > 2 && <li className='p-2'>...</li>}
          {renderPageNumbers().map(number => (
            <li key={number}>
              <button onClick={() => paginate(number)} className={`px-3 py-1 bg-gray-200 hover:bg-gray-300 ${number === currentPage ? 'text-blue-600' : ''}`}>
                {number}
              </button>
            </li>
          ))}
          {currentPage < totalPages - 1 && <li className='p-2'>...</li>}
          {currentPage +1 < totalPages && (
            <li>
              <button onClick={() => paginate(totalPages)} className="px-3 py-1 rounded-r-lg bg-gray-200 hover:bg-gray-300">{totalPages}</button>
            </li>
          )}
        </ul>
      </nav>
      {currentArticles.map((article, index) => (
        <div
          key={index}
          className="rounded overflow-hidden shadow-lg bg-cover bg-center cursor-pointer m-4 transition transform duration-300 hover:scale-105"
          style={{ backgroundImage: `url(${article.urlToImage})` }}
          onClick={() => setSelectedArticle(article)}
        >
          <div className="px-6 py-4 bg-gray-700 bg-opacity-50">
            <div className="font-bold text-white text-xl mb-2">{article.title}</div>
            <p className="text-gray-300 text-base mb-4">{new Date(article.publishedAt).toLocaleDateString('en-CA')}</p>
          </div>
        </div>
      ))}

      {selectedArticle && (
        <ArticleCard
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
      <nav className="flex justify-center mt-4">
        <ul className="inline-flex items-center -space-x-px">
          {currentPage > 2 && (
            <li>
              <button onClick={() => paginate(1)} className="px-3 py-1 rounded-l-lg bg-gray-200 hover:bg-gray-300">1</button>
            </li>
          )}
          {currentPage > 2 && <li className='p-2'>...</li>}
          {renderPageNumbers().map(number => (
            <li key={number}>
              <button onClick={() => paginate(number)} className={`px-3 py-1 bg-gray-200 hover:bg-gray-300 ${number === currentPage ? 'text-blue-600' : ''}`}>
                {number}
              </button>
            </li>
          ))}
          {currentPage < totalPages - 1 && <li className='p-2'>...</li>}
          {currentPage +1 < totalPages && (
            <li>
              <button onClick={() => paginate(totalPages)} className="px-3 py-1 rounded-r-lg bg-gray-200 hover:bg-gray-300">{totalPages}</button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default RssPage;
