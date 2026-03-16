import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/records/favorites')
      .then(res => setFavorites(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: '#0f0f1a', minHeight: '100%', padding: '16px', paddingBottom: '80px' }}>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#555', paddingTop: '60px' }}>불러오는 중...</div>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#555', paddingTop: '60px' }}>
          ⭐ 즐겨찾기한 장소가 없어요
        </div>
      ) : (
        favorites.map(item => (
          <div
            key={item.id}
            onClick={() => navigate(`/record/${item.id}`)}
            style={{
              backgroundColor: '#1a1a2e', borderRadius: '16px', marginBottom: '14px',
              border: '1px solid #2a2a3e', cursor: 'pointer', overflow: 'hidden',
            }}
          >
            {item.photo_url ? (
              <img src={item.photo_url} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '120px', backgroundColor: '#252540', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                📍
              </div>
            )}
            <div style={{ padding: '14px' }}>
              <p style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title}
              </p>
              {item.description && (
                <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.5', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                {item.category && <span style={{ color: '#666', fontSize: '12px' }}>#{item.category}</span>}
                {item.emotion && <span style={{ color: '#666', fontSize: '12px' }}>{item.emotion}</span>}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
