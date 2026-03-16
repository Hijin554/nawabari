import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../api/client';

const CATEGORIES = ['카페', '산책길', '쉼터', '무서운골목', '공원', '기타'];
const EMOTIONS = ['행복', '평온', '설렘', '무서움', '쓸쓸함', '신남'];

export default function AddRecordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editing = location.state?.record; // 수정 모드일 때 기존 데이터

  const [title, setTitle] = useState(editing?.title || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [address, setAddress] = useState(editing?.address || '');
  const [photoUrl, setPhotoUrl] = useState(editing?.photo_url || '');
  const [emotion, setEmotion] = useState(editing?.emotion || '');
  const [category, setCategory] = useState(editing?.category || '');
  const [isPublic, setIsPublic] = useState(editing?.is_public ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('제목을 입력해주세요.');
    setLoading(true);
    setError('');
    try {
      const data = { title, description, address, photo_url: photoUrl, emotion, category, is_public: isPublic };
      if (editing) {
        await client.put(`/records/${editing.id}`, data);
      } else {
        await client.post('/records', data);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '저장 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f0f1a', minHeight: '100%', padding: '20px', paddingBottom: '60px' }}>
      <h2 style={{ color: '#fff8e1', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
        {editing ? '기록 수정' : '새 기록'}
      </h2>

      <form onSubmit={handleSave}>

        {/* 제목 */}
        <label style={labelStyle}>제목 *</label>
        <input type="text" placeholder="이 장소의 이름은?" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />

        {/* 설명 */}
        <label style={labelStyle}>설명</label>
        <textarea placeholder="어떤 순간이었나요?" value={description} onChange={e => setDescription(e.target.value)}
          style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />

        {/* 주소 */}
        <label style={labelStyle}>주소</label>
        <input type="text" placeholder="장소 주소 (선택)" value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />

        {/* 사진 URL */}
        <label style={labelStyle}>사진 URL</label>
        <input type="text" placeholder="사진 링크 (선택)" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} style={inputStyle} />

        {/* 카테고리 */}
        <label style={labelStyle}>카테고리</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {CATEGORIES.map(c => (
            <button key={c} type="button" onClick={() => setCategory(category === c ? '' : c)} style={chipStyle(category === c)}>
              {c}
            </button>
          ))}
        </div>

        {/* 감정 */}
        <label style={labelStyle}>감정</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {EMOTIONS.map(e => (
            <button key={e} type="button" onClick={() => setEmotion(emotion === e ? '' : e)} style={chipStyle(emotion === e)}>
              {e}
            </button>
          ))}
        </div>

        {/* 공개 여부 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>공개</label>
          <div
            onClick={() => setIsPublic(!isPublic)}
            style={{
              width: '48px', height: '26px', borderRadius: '13px',
              backgroundColor: isPublic ? '#d4a017' : '#333',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
            }}
          >
            <div style={{
              position: 'absolute', top: '3px',
              left: isPublic ? '24px' : '3px',
              width: '20px', height: '20px', borderRadius: '10px',
              backgroundColor: isPublic ? '#fff8e1' : '#aaa',
              transition: 'left 0.2s',
            }} />
          </div>
        </div>

        {error && <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{
          width: '100%', backgroundColor: '#d4a017', color: '#0a0a0f',
          border: 'none', borderRadius: '14px', padding: '16px',
          fontSize: '16px', fontWeight: '700', cursor: 'pointer',
        }}>
          {loading ? '저장 중...' : (editing ? '수정 완료' : '기록 저장')}
        </button>
      </form>
    </div>
  );
}

const labelStyle = {
  display: 'block', color: '#aaa', fontSize: '13px', fontWeight: '500', marginBottom: '6px',
};

const inputStyle = {
  width: '100%', backgroundColor: '#1a1a2e', color: '#fff',
  border: '1px solid #333', borderRadius: '12px',
  padding: '13px 16px', fontSize: '15px', marginBottom: '16px',
  boxSizing: 'border-box', outline: 'none',
};

const chipStyle = (active) => ({
  padding: '7px 14px', borderRadius: '20px',
  border: active ? '1px solid #d4a017' : '1px solid #333',
  backgroundColor: active ? '#d4a017' : '#1a1a2e',
  color: active ? '#0a0a0f' : '#888',
  fontSize: '13px', fontWeight: active ? '600' : '400',
  cursor: 'pointer',
});
