'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Input } from '@/shared/ui/input/input/Input';
import Button from '@/shared/ui/button/button/Button';
import AddIcon from '@/shared/assets/icons/common/add.svg';
import { useShallow } from 'zustand/react/shallow';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import * as s from '../../NotebookMetaEditor.css';

export const CoverImageSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { imageUrl, setImageUrl } = useNoteEditorStore(
    useShallow((state) => ({
      imageUrl: state.imageUrl,
      setImageUrl: state.setImageUrl,
    }))
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className={s.section}>
      <h3 className={s.sectionTitle}>노트 커버 이미지</h3>
      <div className={s.coverImageContainer}>
        <Input
          placeholder="이미지 URL을 입력하거나 파일을 선택하세요"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className={s.hiddenFileInput}
        />
        <div
          className={s.imageUploadBox}
          onClick={() => fileInputRef.current?.click()}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="미리보기"
              fill
              className={s.previewImage}
              unoptimized
            />
          ) : (
            <>
              <AddIcon width={24} height={24} />
              <span>클릭하여 이미지 업로드</span>
            </>
          )}
        </div>
        {imageUrl && (
          <Button
            variants="neutral"
            size="sm"
            onClick={() => setImageUrl('')}
          >
            이미지 삭제
          </Button>
        )}
      </div>
    </section>
  );
};
