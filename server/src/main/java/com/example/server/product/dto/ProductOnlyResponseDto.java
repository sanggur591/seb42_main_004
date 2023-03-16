package com.example.server.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class ProductOnlyResponseDto {
    private long productId;
    private String name;
    private int weight;
    private int kcal;
    private int price;
}