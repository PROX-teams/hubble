package com.hubble.common.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Category {
    DEVELOPMENT("개발"),
    DESIGN("디자인"),
    PLANNING("기획"),
    MARKETING("마케팅"),
    LIFE("일상"),
    OTHER("기타");

    private final String description;
}
