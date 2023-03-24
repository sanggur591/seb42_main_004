package com.example.server.product.service;

import com.example.server.exception.BusinessLogicException;
import com.example.server.image.entity.ProductImage;
import com.example.server.image.service.ImageService;
import com.example.server.product.entity.Product;
import com.example.server.product.exception.ProductException;
import com.example.server.product.repository.ProductRepository;
import com.example.server.utils.CustomPageRequest;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Optional;

@Transactional
@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ImageService imageService;

    public ProductService(ProductRepository productRepository, ImageService imageService) {
        this.productRepository = productRepository;
        this.imageService = imageService;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, Product productPatcher){
        Product product = findProductById(productId);
        product.patchProduct(productPatcher);
        return productRepository.save(product);
    }

    public void deleteProduct(Long productId){
        Product product = findProductById(productId);
        productRepository.delete(product);
    }

    public Product findProductById(Long productId){
        Optional<Product> findProduct = productRepository.findById(productId);
        return findProduct.orElseThrow(()->new BusinessLogicException(ProductException.PRODUCT_NOT_FOUND));
    }

    public Page<Product> findProducts(int page, int size, String sort,
                                      Sort.Direction direction, boolean adminPage){
        PageRequest pageRequest = adminPage ?
                makeCustomPageRequest(page, size, sort, direction) : makePageRequest(page, size, sort, direction);
        return productRepository.findAll(pageRequest);
    }

    public Page<Product> searchProducts(String search, int page, int size, String sort,
                                        Sort.Direction direction){
        if(search.trim().equals("")){
            return new PageImpl<Product>(new ArrayList<>(), PageRequest.ofSize(size),0);
        }

        PageRequest pageRequest = makePageRequest(page, size, sort, direction);
        return productRepository.findAllByNameContains(search, pageRequest);
    }

    public void uploadImage(Long productId, MultipartFile file) {
        Product product = findProductById(productId);
        ProductImage image = imageService.uploadProductImage(file, product);
        product.setImage(image);
        productRepository.save(product);
    }

    /* ####### private 메서드 ####### */

    private CustomPageRequest makeCustomPageRequest(int page, int size, String sort, Sort.Direction direction) {
        CustomPageRequest pageRequest = null;
        if(direction.isAscending()){
            pageRequest =
                    CustomPageRequest.of(page-1, size, Sort.by(sort).ascending());
        } else if(direction.isDescending()){
            pageRequest =
                    CustomPageRequest.of(page-1, size, Sort.by(sort).descending());
        }
        return pageRequest;
    }

    private PageRequest makePageRequest(int page, int size, String sort, Sort.Direction direction) {
        PageRequest pageRequest = null;
        if(direction.isAscending()){
            pageRequest =
                    PageRequest.of(page-1, size, Sort.by(sort).ascending());
        } else if(direction.isDescending()){
            pageRequest =
                    PageRequest.of(page-1, size, Sort.by(sort).descending());
        }
        return pageRequest;
    }
}
