/**
 * 날짜를 'YYYY.MM.DD' 형식으로 포맷팅합니다.
 * @param dateString - 포맷팅할 날짜 문자열 또는 Date 객체
 * @returns 포맷팅된 날짜 문자열 (예: 2024.03.16)
 */
export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // 유효하지 않은 날짜인 경우 빈 문자열 반환
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  .replace(/\. /g, '.')
  .replace(/\.$/, '');
};
