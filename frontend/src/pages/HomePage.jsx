import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const CATEGORIES = ['전체', '카페', '산책길', '쉼터', '무서운골목', '공원', '기타'];
const EMOTIONS = ['전체', '행복', '평온', '설렘', '무서움', '쓸쓸함', '신남'];

const EMOTION_COLORS = {
  행복: '#FFD700', 평온: '#87CEEB', 설렘: '#FFB6C1',
  무서움: '#8B0000', 쓸쓸함: '#708090', 신남: '#FF6347',
};

export default function HomePage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const [emotion, setEmotion] = useState('전체');
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== '전체') params.category = category;
      if (emotion !== '전체') params.emotion = emotion;
      const res = await client.get('/records', { params });
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, emotion]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  return (
    <div style={{ backgroundColor: '#0f0f1a', minHeight: '100%' }}>

      {/* 검색창 */}
      <div style={{ padding: '16px 16px 8px' }}>
        <input
          type="text"
          placeholder="제목, 설명 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchRecords()}
          style={{
            width: '100%', backgroundColor: '#1a1a2e', color: '#fff',
            border: '1px solid #333', borderRadius: '12px',
            padding: '12px 16px', fontSize: '15px', boxSizing: 'border-box', outline: 'none',
          }}
        />
      </div>

      {/* 카테고리 필터 */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px 16px', overflowX: 'auto' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={chipStyle(category === c)}>
            {c}
          </button>
        ))}
      </div>

      {/* 감정 필터 */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px 16px 12px', overflowX: 'auto' }}>
        {EMOTIONS.map(e => (
          <button key={e} onClick={() => setEmotion(e)} style={chipStyle(emotion === e)}>
            {e}
          </button>
        ))}
      </div>

      {/* 기록 목록 */}
      <div style={{ padding: '0 16px', paddingBottom: '80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#555', paddingTop: '60px' }}>불러오는 중...</div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#555', paddingTop: '60px', lineHeight: '1.8' }}>
            아직 기록이 없어요<br />첫 순간을 남겨보세요
          </div>
        ) : (
          records.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/record/${item.id}`)}
              style={{
                backgroundColor: '#1a1a2e', borderRadius: '16px', marginBottom: '14px',
                border: '1px solid #2a2a3e', cursor: 'pointer', overflow: 'hidden',
              }}
            >
              {/* 사진 */}
              {item.photo_url ? (
                <img src={item.photo_url} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '140px', backgroundColor: '#252540', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                  📍
                </div>
              )}

              <div style={{ padding: '14px' }}>
                {/* 제목 + 감정 배지 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ flex: 1, color: '#fff', fontSize: '16px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </span>
                  {item.emotion && (
                    <span style={{
                      backgroundColor: EMOTION_COLORS[item.emotion] || '#555',
                      color: '#fff', fontSize: '11px', fontWeight: '600',
                      padding: '3px 8px', borderRadius: '10px', marginLeft: '8px', flexShrink: 0,
                    }}>
                      {item.emotion}
                    </span>
                  )}
                </div>

                {/* 설명 */}
                {item.description && (
                  <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.5', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                )}

                {/* 메타 */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {item.category && <span style={{ color: '#666', fontSize: '12px' }}>#{item.category}</span>}
                  {item.address && <span style={{ color: '#666', fontSize: '12px' }}>{item.address}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* + 버튼 */}
      <button
        onClick={() => navigate('/add')}
        style={{
          position: 'fixed', right: '24px', bottom: '80px',
          width: '56px', height: '56px', borderRadius: '28px',
          backgroundColor: '#d4a017', border: 'none',
          fontSize: '28px', color: '#0a0a0f', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(212,160,23,0.4)',
        }}
      >
        +
      </button>
    </div>
  );
}

const chipStyle = (active) => ({
  padding: '6px 14px',
  borderRadius: '20px',
  border: active ? '1px solid #d4a017' : '1px solid #333',
  backgroundColor: active ? '#d4a017' : '#1a1a2e',
  color: active ? '#0a0a0f' : '#888',
  fontSize: '13px',
  fontWeight: active ? '600' : '400',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});
