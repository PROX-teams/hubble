/**
 * HTML 태그를 제거하고 원하는 길이만큼 자른 후 말줄임표(...)를 붙여주는 함수
 */
export const stripHtml = (html: string = '', maxLength: number = 100) => {
  const plainText = html
    .replace(/<[^>]*>?/gm, '') // 태그 제거
    .replace(/&nbsp;/g, ' ')   // 공백 엔티티 처리
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + '...';
};
