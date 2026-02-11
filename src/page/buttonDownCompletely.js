// ButtonDownCompletely.js
// Action cachée : appui simultané gauche+droite pendant 6s sur le background.
// Barre de progression visible après 3s, notifications à l'envoi et à la réponse.
import React, { useRef, useCallback } from 'react';
import api from '../api/api';
import DualZoneTrigger from '../components/DualZoneTrigger';
import NotificationStack from '../components/NotificationStack';

const ButtonDownCompletely = ({ activeUrl }) => {
  const notifRef = useRef(null);

  const handleTrigger = useCallback(async () => {
    // Notification d'envoi
    if (notifRef.current) {
      notifRef.current.push('🔒 Requête close_completely envoyée…', 'info');
    }

    try {
      const response = await api.down_completely(activeUrl);
      console.log('API DOWN_COMPLETELY response:', response);
      if (notifRef.current) {
        notifRef.current.push('✅ Serveur : fermeture complète confirmée', 'success');
      }
    } catch (error) {
      console.error('Error with API DOWN_COMPLETELY request:', error);
      if (notifRef.current) {
        notifRef.current.push('❌ Erreur : le serveur n\'a pas répondu', 'error');
      }
    }
  }, [activeUrl]);

  return (
    <>
      <NotificationStack ref={notifRef} />
      <DualZoneTrigger onTrigger={handleTrigger} />
    </>
  );
};

export default ButtonDownCompletely;