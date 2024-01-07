import React, { useEffect } from 'react';

const ArticleCard = ({ article, onClose }) => {
  if (!article) return null;

  const { title, description, url, urlToImage, publishedAt, author } = article;

  useEffect(() => {
      // Désactiver le défilement lors de l'ouverture de la modal
      document.body.style.overflow = 'hidden';
      return () => {
          // Réactiver le défilement lors de la fermeture de la modal
          document.body.style.overflow = 'unset';
      };
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-CA');
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="container mx-auto p-12">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <img src={urlToImage} alt={title} className="w-full" />
          <div className="p-6">
            <h2 className="font-bold text-xl mb-2">{title}</h2>
            <p>{description}</p>
            <div className="text-sm text-gray-600">{formatDate(publishedAt)}</div>
            <p className="italic">{author}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-4 text-blue-500">Lire l'article complet</a>
            <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
