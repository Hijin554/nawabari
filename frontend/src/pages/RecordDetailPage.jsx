import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function RecordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/records/${id}`)
      .then(res => setRecord(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFavorite = async () => {
    try {
      const res = await client.post(`/records/${id}/favorite`);
      setRecord(prev => ({ ...prev, is_favorited: res.data.is_favorited }));
    } catch (err) {
      alert('즐겨찾기 처리 실패');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('이 기록을 삭제할까요?')) return;
    try {
      await client.delete(`/records/${id}`);
      navigate('/');
    } catch {
      alert('삭제 실패');
    }
  };

  if (loading) return (
    <div style={{ backgroundColor: '#0f0f1a', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#d4a017', fontSize: '16px' }}>불러오는 중...</div>
    </div>
  );

  if (!record) return null;

  const isOwner = user?.id === record.user_id;

  return (
    <div style={{ backgroundColor: '#0f0f1a', minHeight: '100%', paddingBottom: '40px' }}>

      {/* 사진 */}
      {record.photo_url ? (
        <img src={record.photo_url} alt={record.title} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '200px', backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>
          📍
        </div>
      )}

      <div style={{ padding: '20px' }}>

        {/* 제목 + 즐겨찾기 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <h1 style={{ flex: 1, color: '#fff8e1', fontSize: '22px', fontWeight: '700', margin: 0 }}>
            {record.title}
          </h1>
          <button onClick={handleFavorite} style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', padding: '4px' }}>
            {record.is_favorited ? '⭐' : '☆'}
          </button>
        </div>

        {/* 태그 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {record.category && (
            <span style={tagStyle('#333')}># {record.category}</span>
          )}
          {record.emotion && (
            <span style={tagStyle('#d4a017')}>{record.emotion}</span>
          )}
          {!record.is_public && (
            <span style={tagStyle('#555')}>🔒 나만보기</span>
          )}
        </div>

        {/* 주소 */}
        {record.address && (
          <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '12px' }}>
            📌 {record.address}
          </p>
        )}

        {/* 설명 */}
        {record.description && (
          <p style={{ color: '#ddd', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }}>
            {record.description}
          </p>
        )}

        {/* 날짜 */}
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '24px' }}>
          {new Date(record.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* 수정/삭제 (내 기록만) */}
        {isOwner && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate(`/edit/${record.id}`, { state: { record } })}
              style={{ flex: 1, backgroundColor: '#1a1a2e', color: '#d4a017', border: '1px solid #d4a017', borderRadius: '12px', padding: '13px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              style={{ flex: 1, backgroundColor: '#2a0a0a', color: '#ff4444', border: '1px solid #8B0000', borderRadius: '12px', padding: '13px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const tagStyle = (borderColor) => ({
  backgroundColor: '#1a1a2e',
  color: '#ccc',
  border: `1px solid ${borderColor}`,
  borderRadius: '12px',
  padding: '5px 12px',
  fontSize: '13px',
});
