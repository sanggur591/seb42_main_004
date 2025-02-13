import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ModalDiv, { TextButton } from '../commons/ModalDiv';
import { AsideSignatureButton, AsideWrapper } from '../commons/CartAside';
import { deleteProduct, initializeCustom } from '../../reducers/customReducer';
import { addCartItem, deleteCartItem } from '../../reducers/cartReducer';
import postData from '../../util/postData';
import deleteData from '../../util/deleteData';

function CustomAside({ custom }) {
  const { isLogin, admin } = useSelector((state) => state.authReducer);
  const { state } = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addCustomToCart = async () => {
    let error = false;
    const errorFunc = (res, errorCode, order) => {
      if (res?.status !== errorCode) {
        alert(
          `장바구니 추가 작업이 실패했습니다(${order})\n관리자에게 문의해주세요.`
        );
        error = true;
      }
    };

    const { cartMealboxId } = state;
    if (cartMealboxId) {
      isLogin &&
        (await deleteData(`/users/cart/${cartMealboxId}`).then((res) => {
          errorFunc(res, 200, 1);
        }));
      if (error) return;
      dispatch(deleteCartItem([cartMealboxId]));
    }

    const data = { ...custom };
    const quantity = state.quantity || 1;
    if (isLogin) {
      data.products = data.products.map((product) => {
        const { productId, quantity } = product;
        return { productId, quantity };
      });
      const postReqData = {
        adminMadeMealboxes: [],
        customMealboxes: [{ mealbox: data, quantity }],
      };
      await postData(`/users/cart/all`, postReqData).then((res) => {
        errorFunc(res, 201, 2);
      });
      if (error) return;
    }
    dispatch(addCartItem({ ...data, quantity: quantity }));
    dispatch(initializeCustom());

    if (
      window.confirm(
        'Custom 밀박스가 장바구니에 추가되었습니다.\n장바구니로 이동하시겠습니까?'
      )
    ) {
      navigate('/cart');
    } else navigate('/mealboxes');
  };

  return (
    <AsideWrapper>
      {admin && openModal && (
        <ModalDiv mealBox={custom} closeModal={() => setOpenModal(false)} />
      )}
      <InAsideBoxDiv>
        <InAsideH2 className="hidden">
          {custom?.id ? custom.name : 'Custom'}
        </InAsideH2>
        {custom && (
          <ElementInBucketUl>
            {custom.products.map((product) => (
              <ElementInBucketLi key={product.productId}>
                <span>{`${product.name}`}</span>
                <span>
                  {`${product.quantity}`}
                  <TextButton
                    onClick={() => dispatch(deleteProduct(product.productId))}
                    className="linkstyle"
                  >
                    &#10005;
                  </TextButton>
                </span>
              </ElementInBucketLi>
            ))}
          </ElementInBucketUl>
        )}
        <InAsidePriceDiv>
          <span>
            합계 <span>({custom.kcal?.toLocaleString('ko-KR')}kcal)</span>
          </span>
          <span>{`${custom.price?.toLocaleString('ko-KR')}원`}</span>
        </InAsidePriceDiv>
      </InAsideBoxDiv>
      <AsideSignatureButton
        onClick={() =>
          custom.products.length !== 0 &&
          (admin ? setOpenModal(true) : addCustomToCart())
        }
      >
        {!admin
          ? '장바구니 담기'
          : custom?.mealboxId
          ? '밀박스 수정 진행하기'
          : '밀박스 생성 진행하기'}
      </AsideSignatureButton>
    </AsideWrapper>
  );
}

export default CustomAside;

const InAsideBoxDiv = styled.div`
  background-color: var(--bucket_brown);
  padding: 1rem;
  border-radius: 10px 10px 0 0;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: -2px -2px 2px rgba(0, 0, 0, 0.4);

    ::before {
      content: '';
      border-bottom: calc(4px * 1.732) solid var(--bucket_brown);
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      position: absolute;
      top: -6.4px;
      left: 50%;
    }

    :hover {
      border-radius: 10px 10px 0 0;

      ::before {
        display: none;
      }

      > h2,
      > ul {
        display: block;
      }
    }
  }
`;
const InAsideH2 = styled.h2`
  color: var(--white);
  min-height: 1vh;

  @media (max-width: 768px) {
    display: none;
  }
`;
const ElementInBucketUl = styled.ul`
  @media (max-width: 768px) {
    display: none;
  }
`;
const ElementInBucketLi = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > span {
    font-size: 0.8rem;
    margin-right: -2px;
    word-break: keep-all;

    > button {
      margin-left: 0.5rem;
    }
  }
`;
const InAsidePriceDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: -0.5rem;

  > span {
    > span {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`;
